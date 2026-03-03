import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applicationService } from "../../services/api";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    seniorHighSchoolName: "",
    chosenTrack: "",
    graduationYear: "",
    gpa: "",
    intendedMajor: "",
    extracurricularActivities: "",
    personalStatement: "",
  });

  // File uploads
  const [grade11Transcript, setGrade11Transcript] = useState(null);
  const [grade12Transcript, setGrade12Transcript] = useState(null);
  const [moralCertificate, setMoralCertificate] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleFileChange = (e, setter, fieldName) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 5MB" });
      return;
    }
    setter(file);
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: false });
    }
    setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    console.log("=== FORM DATA ===");
    console.log(formData);
    console.log("=== FILES ===", {
      grade11Transcript,
      grade12Transcript,
      moralCertificate,
    });

    // Required text fields
    if (!formData.fullName.trim()) newErrors.fullName = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.phone.trim()) newErrors.phone = true;
    if (!formData.dateOfBirth) newErrors.dateOfBirth = true;
    if (!formData.address.trim()) newErrors.address = true;
    if (!formData.seniorHighSchoolName.trim())
      newErrors.seniorHighSchoolName = true;
    if (!formData.chosenTrack) newErrors.chosenTrack = true;
    if (!formData.graduationYear) newErrors.graduationYear = true;
    if (!formData.gpa) newErrors.gpa = true;
    if (!formData.intendedMajor) newErrors.intendedMajor = true;

    // Required files
    if (!grade11Transcript) newErrors.grade11Transcript = true;
    if (!grade12Transcript) newErrors.grade12Transcript = true;
    if (!moralCertificate) newErrors.moralCertificate = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validate form
    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields and upload all required documents.",
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare application data
      const applicationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        highSchoolName: formData.seniorHighSchoolName,
        highSchoolGpa: parseFloat(formData.gpa), // Use the GPA from form
        graduationYear: parseInt(formData.graduationYear), // Convert to number
        intendedMajor: formData.intendedMajor,
        extracurricularActivities: formData.extracurricularActivities || null,
        personalStatement: formData.personalStatement || null,
        seniorHighTrack: formData.chosenTrack,
      };

      const response =
        await applicationService.createApplication(applicationData);
      const applicationId = response.data.application.id;

      // Upload documents
      const uploadPromises = [
        uploadDocument(applicationId, grade11Transcript, "Grade 11 Transcript"),
        uploadDocument(applicationId, grade12Transcript, "Grade 12 Transcript"),
        uploadDocument(
          applicationId,
          moralCertificate,
          "Good Moral Certificate",
        ),
      ];

      await Promise.all(uploadPromises);

      setMessage({
        type: "success",
        text: "Application and documents submitted successfully!",
      });
      setTimeout(() => navigate("/student/applications"), 2000);
    } catch (error) {
      console.error("Submit error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to submit application",
      });
      setLoading(false);
    }
  };

  const uploadDocument = async (applicationId, file, documentType) => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("applicationId", applicationId);
    formData.append("documentType", documentType);

    const response = await fetch("http://localhost:5000/api/documents/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${documentType}`);
    }

    return response.json();
  };

  const inputStyle = (fieldName) => ({
    width: "100%",
    padding: "0.75rem",
    border: errors[fieldName] ? "2px solid #ef4444" : "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "all 0.2s",
  });

  const fileInputStyle = (fieldName) => ({
    width: "100%",
    padding: "0.75rem",
    border: errors[fieldName] ? "2px dashed #ef4444" : "2px dashed #cbd5e1",
    borderRadius: "8px",
    background: "white",
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Submit Application</h2>

      {message.text && (
        <div
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            background: message.type === "success" ? "#d1fae5" : "#fee2e2",
            borderRadius: "8px",
            borderLeft: `4px solid ${message.type === "success" ? "#10b981" : "#ef4444"}`,
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h3>Personal Information</h3>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <label>
              Full Name *{" "}
              {errors.fullName && (
                <span style={{ color: "#ef4444" }}>Required</span>
              )}
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={inputStyle("fullName")}
            />
          </div>
          <div>
            <label>
              Email *{" "}
              {errors.email && (
                <span style={{ color: "#ef4444" }}>Required</span>
              )}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle("email")}
            />
          </div>
          <div>
            <label>
              Phone *{" "}
              {errors.phone && (
                <span style={{ color: "#ef4444" }}>Required</span>
              )}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle("phone")}
            />
          </div>
          <div>
            <label>
              Date of Birth *{" "}
              {errors.dateOfBirth && (
                <span style={{ color: "#ef4444" }}>Required</span>
              )}
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              style={inputStyle("dateOfBirth")}
            />
          </div>
          <div>
            <label>
              Address *{" "}
              {errors.address && (
                <span style={{ color: "#ef4444" }}>Required</span>
              )}
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              style={inputStyle("address")}
            />
          </div>
        </div>

        <h3>Senior High School Information</h3>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <label>
              Senior High School Name *{" "}
              {errors.seniorHighSchoolName && (
                <span style={{ color: "#ef4444" }}>Required</span>
              )}
            </label>
            <input
              type="text"
              name="seniorHighSchoolName"
              value={formData.seniorHighSchoolName}
              onChange={handleChange}
              style={inputStyle("seniorHighSchoolName")}
            />
          </div>
          <div>
            <label>
              Chosen Track *{" "}
              {errors.chosenTrack && (
                <span style={{ color: "#ef4444" }}>Required</span>
              )}
            </label>
            <select
              name="chosenTrack"
              value={formData.chosenTrack}
              onChange={handleChange}
              style={inputStyle("chosenTrack")}
            >
              <option value="">Select Track</option>
              <option value="STEM">
                STEM (Science, Technology, Engineering, Mathematics)
              </option>
              <option value="ABM">
                ABM (Accountancy, Business, Management)
              </option>
              <option value="HUMSS">
                HUMSS (Humanities and Social Sciences)
              </option>
              <option value="GAS">GAS (General Academic Strand)</option>
              <option value="TVL">TVL (Technical-Vocational-Livelihood)</option>
              <option value="Arts and Design">Arts and Design</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          <div>
            <label>
              Graduation Year *{" "}
              {errors.graduationYear && (
                <span style={{ color: "#ef4444" }}>Required</span>
              )}
            </label>
            <input
              type="number"
              min="2015"
              max="2030"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              style={inputStyle("graduationYear")}
            />
          </div>
          <div>
            <label>
              General Average / GPA *{" "}
              {errors.gpa && <span style={{ color: "#ef4444" }}>Required</span>}
            </label>
            <input
              type="number"
              name="gpa"
              min="75"
              max="100"
              step="0.01"
              value={formData.gpa}
              onChange={handleChange}
              style={inputStyle("gpa")}
              placeholder="e.g., 95.5"
            />
            <small style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              Enter your General Average (75-100 scale)
            </small>
          </div>
        </div>

        <h3>Required Documents</h3>
        <div
          style={{
            background: "#f9fafb",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "2rem",
          }}
        >
          <p style={{ marginBottom: "1rem", color: "#6b7280" }}>
            Please upload the following required documents (Max 5MB each):
          </p>

          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Grade 11 Transcript of Records *{" "}
                {errors.grade11Transcript && (
                  <span style={{ color: "#ef4444" }}>Required</span>
                )}
              </label>
              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(e, setGrade11Transcript, "grade11Transcript")
                }
                accept=".pdf,.jpg,.jpeg,.png"
                style={fileInputStyle("grade11Transcript")}
              />
              {grade11Transcript && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.875rem",
                    color: "#10b981",
                  }}
                >
                  ✓ {grade11Transcript.name}
                </p>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Grade 12 Transcript of Records *{" "}
                {errors.grade12Transcript && (
                  <span style={{ color: "#ef4444" }}>Required</span>
                )}
              </label>
              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(e, setGrade12Transcript, "grade12Transcript")
                }
                accept=".pdf,.jpg,.jpeg,.png"
                style={fileInputStyle("grade12Transcript")}
              />
              {grade12Transcript && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.875rem",
                    color: "#10b981",
                  }}
                >
                  ✓ {grade12Transcript.name}
                </p>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Good Moral Certificate *{" "}
                {errors.moralCertificate && (
                  <span style={{ color: "#ef4444" }}>Required</span>
                )}
              </label>
              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(e, setMoralCertificate, "moralCertificate")
                }
                accept=".pdf,.jpg,.jpeg,.png"
                style={fileInputStyle("moralCertificate")}
              />
              {moralCertificate && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.875rem",
                    color: "#10b981",
                  }}
                >
                  ✓ {moralCertificate.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <h3>College Information</h3>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <label>
              Intended Major/Program *{" "}
              {errors.intendedMajor && (
                <span style={{ color: "#ef4444" }}>Required</span>
              )}
            </label>
            <select
              name="intendedMajor"
              value={formData.intendedMajor}
              onChange={handleChange}
              style={inputStyle("intendedMajor")}
            >
              <option value="">Select Program</option>
              <optgroup label="Engineering">
                <option value="BS Computer Engineering">
                  BS Computer Engineering
                </option>
                <option value="BS Electrical Engineering">
                  BS Electrical Engineering
                </option>
                <option value="BS Mechanical Engineering">
                  BS Mechanical Engineering
                </option>
                <option value="BS Civil Engineering">
                  BS Civil Engineering
                </option>
                <option value="BS Industrial Engineering">
                  BS Industrial Engineering
                </option>
              </optgroup>
              <optgroup label="Computer Science & IT">
                <option value="BS Computer Science">BS Computer Science</option>
                <option value="BS Information Technology">
                  BS Information Technology
                </option>
                <option value="BS Information Systems">
                  BS Information Systems
                </option>
              </optgroup>
              <optgroup label="Business">
                <option value="BS Business Administration">
                  BS Business Administration
                </option>
                <option value="BS Accountancy">BS Accountancy</option>
                <option value="BS Marketing Management">
                  BS Marketing Management
                </option>
                <option value="BS Entrepreneurship">BS Entrepreneurship</option>
              </optgroup>
              <optgroup label="Arts & Sciences">
                <option value="BA Communication">BA Communication</option>
                <option value="BS Psychology">BS Psychology</option>
                <option value="BA Political Science">
                  BA Political Science
                </option>
                <option value="BS Biology">BS Biology</option>
                <option value="BS Mathematics">BS Mathematics</option>
              </optgroup>
              <optgroup label="Architecture & Design">
                <option value="BS Architecture">BS Architecture</option>
                <option value="BS Interior Design">BS Interior Design</option>
                <option value="BS Multimedia Arts">BS Multimedia Arts</option>
              </optgroup>
            </select>
          </div>
        </div>

        <h3>Additional Information (Optional)</h3>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <label>Extracurricular Activities</label>
            <textarea
              name="extracurricularActivities"
              value={formData.extracurricularActivities}
              onChange={handleChange}
              rows="4"
              style={inputStyle("extracurricularActivities")}
              placeholder="List your clubs, sports, volunteer work, leadership roles, etc."
            />
          </div>
          <div>
            <label>Personal Statement</label>
            <textarea
              name="personalStatement"
              value={formData.personalStatement}
              onChange={handleChange}
              rows="6"
              style={inputStyle("personalStatement")}
              placeholder="Tell us about yourself, your goals, and why you want to attend our university."
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            {loading ? "Submitting..." : "Submit Application with Documents"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/student/dashboard")}
            style={{
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
