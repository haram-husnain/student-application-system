import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Multer: in-memory buffer upload
const upload = multer({ storage: multer.memoryStorage() });

/** Helper: read Bearer token and fetch user */
async function getUserFromAuthHeader(req) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return { user: null, error: "Missing token" };

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return { user: null, error: error.message };
  return { user: data.user, error: null };
}

/** Helper: role check */
async function getProfileRole(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) return { role: null, error: error.message };
  return { role: data.role, error: null };
}

/* ========== AUTH ========== */

/** Signup: creates auth user + profiles row */
app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });

    const userId = data.user?.id;
    if (!userId) return res.status(400).json({ error: "No user returned from signup" });

    // Create profile
    const { error: pErr } = await supabase.from("profiles").insert({
      id: userId,
      first_name: first_name || null,
      last_name: last_name || null,
      role: role === "admin" ? "admin" : "student"
    });

    if (pErr) return res.status(400).json({ error: pErr.message });

    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

/** Login: returns access token + role */
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: error.message });

    const userId = data.user.id;
    const { role, error: rErr } = await getProfileRole(userId);
    if (rErr) return res.status(400).json({ error: rErr });

    return res.json({
      access_token: data.session.access_token,
      user: { id: userId, email: data.user.email, role }
    });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

/* ========== APPLICATION CRUD ========== */

/** Create application + optional files
 * expects multipart/form-data:
 * - personal_info (stringified JSON)
 * - academic_records (stringified JSON)
 * - files[] (0..n)
 * - file_types[] (matching files) e.g. transcript, good_moral
 */
app.post("/applications", upload.array("files"), async (req, res) => {
  try {
    const { user, error } = await getUserFromAuthHeader(req);
    if (!user) return res.status(401).json({ error });

    const personal_info = req.body.personal_info ? JSON.parse(req.body.personal_info) : {};
    const academic_records = req.body.academic_records ? JSON.parse(req.body.academic_records) : {};
    const fileTypes = Array.isArray(req.body.file_types)
      ? req.body.file_types
      : req.body.file_types
        ? [req.body.file_types]
        : [];

    // create application row
    const { data: appRow, error: aErr } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        personal_info,
        academic_records,
        status: "Submitted"
      })
      .select("*")
      .single();

    if (aErr) return res.status(400).json({ error: aErr.message });

    // upload files to Storage + documents table
    const files = req.files || [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const fileType = fileTypes[i] || "document";
      const ext = (f.originalname.split(".").pop() || "bin").toLowerCase();

      const storagePath = `${appRow.id}/${fileType}-${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("documents")
        .upload(storagePath, f.buffer, { contentType: f.mimetype, upsert: true });

      if (upErr) return res.status(400).json({ error: upErr.message });

      // signed URL (private bucket)
      const { data: signed, error: sErr } = await supabase.storage
        .from("documents")
        .createSignedUrl(storagePath, 60 * 60 * 24); // 24h

      if (sErr) return res.status(400).json({ error: sErr.message });

      const { error: dErr } = await supabase.from("documents").insert({
        application_id: appRow.id,
        file_url: signed.signedUrl,
        file_type: fileType
      });

      if (dErr) return res.status(400).json({ error: dErr.message });
    }

    return res.json({ ok: true, application: appRow });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

/** Student: get own applications */
app.get("/applications/me", async (req, res) => {
  const { user, error } = await getUserFromAuthHeader(req);
  if (!user) return res.status(401).json({ error });

  const { data, error: qErr } = await supabase
    .from("applications")
    .select("*, documents(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (qErr) return res.status(400).json({ error: qErr.message });
  return res.json({ data });
});

/** Student: update own application (basic) */
app.put("/applications/:id", async (req, res) => {
  const { user, error } = await getUserFromAuthHeader(req);
  if (!user) return res.status(401).json({ error });

  const { id } = req.params;
  const { personal_info, academic_records } = req.body;

  // ensure ownership
  const { data: existing, error: eErr } = await supabase
    .from("applications")
    .select("id,user_id")
    .eq("id", id)
    .single();

  if (eErr) return res.status(404).json({ error: "Not found" });
  if (existing.user_id !== user.id) return res.status(403).json({ error: "Forbidden" });

  const { data, error: uErr } = await supabase
    .from("applications")
    .update({
      personal_info: personal_info ?? undefined,
      academic_records: academic_records ?? undefined
    })
    .eq("id", id)
    .select("*")
    .single();

  if (uErr) return res.status(400).json({ error: uErr.message });
  return res.json({ data });
});

/** Student: delete own application */
app.delete("/applications/:id", async (req, res) => {
  const { user, error } = await getUserFromAuthHeader(req);
  if (!user) return res.status(401).json({ error });

  const { id } = req.params;

  const { data: existing, error: eErr } = await supabase
    .from("applications")
    .select("id,user_id")
    .eq("id", id)
    .single();

  if (eErr) return res.status(404).json({ error: "Not found" });
  if (existing.user_id !== user.id) return res.status(403).json({ error: "Forbidden" });

  const { error: dErr } = await supabase.from("applications").delete().eq("id", id);
  if (dErr) return res.status(400).json({ error: dErr.message });

  return res.json({ ok: true });
});

/* ========== ADMIN ========== */

/** Admin: list all applications */
app.get("/applications", async (req, res) => {
  const { user, error } = await getUserFromAuthHeader(req);
  if (!user) return res.status(401).json({ error });

  const { role, error: rErr } = await getProfileRole(user.id);
  if (rErr) return res.status(400).json({ error: rErr });
  if (role !== "admin") return res.status(403).json({ error: "Admins only" });

  const { data, error: qErr } = await supabase
    .from("applications")
    .select("*, profiles(first_name,last_name,role), documents(*)")
    .order("created_at", { ascending: false });

  if (qErr) return res.status(400).json({ error: qErr.message });
  return res.json({ data });
});

app.get("/health", (_, res) => res.json({ ok: true }));

/* ========== ROOT ========== */
app.get("/", (_, res) => {
  res.json({ 
    message: "Student Application System API", "version":"1.0.0","status":"running",
    endpoints: {
      auth: {
        signup: "POST /auth/signup",
        login: "POST /auth/login"
      },
      applications: {
        create: "POST /applications",
        getMyApplications: "GET /applications/me",
        update: "PUT /applications/:id",
        delete: "DELETE /applications/:id",
        getAll: "GET /applications (admin only)"
      },
      health: "GET /health"
    }
  });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
