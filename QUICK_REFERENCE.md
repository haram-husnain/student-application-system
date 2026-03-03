# 🚀 QUICK REFERENCE CARD

## 📱 Emergency Quick Start

### If Everything Fails - Start Fresh:

```bash
# 1. Start Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev

# 2. Start Frontend (NEW terminal)
cd frontend
npm install
npm run dev

# 3. Open browser: http://localhost:3000
```

---

## 🔑 Important URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000
- **Supabase:** https://supabase.com
- **GitHub:** https://github.com

---

## 👤 Test Accounts

### Admin Account:
```
Email: admin@university.edu
Password: Admin123!
```

### Create Your Own Student:
```
Register at: http://localhost:3000/register
```

---

## 🛠️ Common Commands

### Backend:
```bash
npm run dev          # Start development server
npm start            # Start production server
npm install          # Install dependencies
```

### Frontend:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm install          # Install dependencies
```

### Git:
```bash
git status           # Check file changes
git add .            # Add all files
git commit -m "msg"  # Commit with message
git push             # Push to GitHub
```

---

## 🐛 Quick Fixes

### Backend won't start:
```bash
lsof -i :5000        # Check what's using port 5000
kill -9 [PID]        # Kill that process
```

### Frontend won't start:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Can't login:
```javascript
// In browser console (F12):
localStorage.clear()
location.reload()
```

### Database issues:
```
Go to Supabase → SQL Editor
Re-run backend/database/schema.sql
```

---

## 📋 Feature Checklist

### Sprint 2 (UI):
- [x] Login UI
- [x] Register UI
- [x] Profile UI
- [x] Application Form UI
- [x] Document Upload UI
- [x] Admin Dashboard UI

### Sprint 3 (Functionality):
- [x] Login functionality
- [x] Register functionality
- [x] Profile create/update
- [x] Application create/view
- [x] Document upload
- [x] Admin application view

---

## 🎯 API Endpoints Quick Reference

```
Auth:
POST   /api/auth/register      # Register
POST   /api/auth/login         # Login
GET    /api/auth/user          # Current user

Profile:
GET    /api/profile/:id        # Get profile
PUT    /api/profile/:id        # Update profile

Applications:
POST   /api/applications       # Create
GET    /api/applications       # List user's apps
GET    /api/applications/:id   # Get one
PUT    /api/applications/:id   # Update

Documents:
POST   /api/documents/upload   # Upload
GET    /api/documents/:appId   # List docs

Admin:
GET    /api/admin/applications # All apps
PUT    /api/admin/.../status   # Update status
GET    /api/admin/statistics   # Stats
```

---

## 📁 File Locations

```
Important Files:
├── backend/.env                     # Database credentials
├── backend/server.js                # Main server file
├── backend/database/schema.sql      # Database setup
├── frontend/src/App.jsx             # Main React app
├── frontend/src/services/api.js     # API calls
├── frontend/src/context/AuthContext.jsx  # Auth state
└── README.md                        # Full documentation
```

---

## 👥 Team Responsibilities

**Backend:**
- Husnain: Auth
- Anne: Profile  
- Leona: Applications
- Alexandra: Documents
- James: Admin

**Frontend:**
- Husnain: Login/Register
- Anne: Profile UI
- Leona: Application Form
- Alexandra: Document Upload
- James: Admin Dashboard

---

## 🔐 Environment Variables

```env
# Backend .env
PORT=5000
DATABASE_URL=your_supabase_db_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=any_long_random_string
```

```env
# Frontend .env
VITE_API_URL=http://localhost:5000/api
```

---

## ⚡ Performance Tips

1. **Always run backend first**, then frontend
2. **Keep terminals open** while testing
3. **Use Chrome DevTools** (F12) to debug
4. **Check Network tab** to see API calls
5. **Read error messages** carefully

---

## 🎨 UI Routes

```
Public:
/login                  # Login page
/register               # Register page

Student:
/student/dashboard      # Student home
/student/profile        # View/edit profile
/student/apply          # New application
/student/applications   # All applications

Admin:
/admin/dashboard        # Admin home
/admin/applications/:id # View application
```

---

## 💾 Database Tables

```
users                 # All users (students + admins)
student_profiles      # Student extra info
applications          # All applications
documents             # Uploaded files
admin_actions         # Admin activity log
```

---

## 🎯 Today's Goal

✅ Complete and test all features  
✅ Commit everything to GitHub  
✅ Prepare for presentation  
✅ Submit before deadline  

---

## 📞 When You Need Help

1. Check error message
2. Check this guide
3. Check browser console (F12)
4. Check backend terminal
5. Google the error
6. Ask team member
7. Check README.md

---

## 🔄 Restart Everything

```bash
# Kill all processes
Ctrl+C in both terminals

# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev

# Test: Open http://localhost:3000
```

---

## ✨ Success Markers

You know it's working when:
- ✅ No red errors in terminal
- ✅ Can open http://localhost:3000
- ✅ Can register new user
- ✅ Can login
- ✅ Can see student dashboard
- ✅ Can submit application
- ✅ Admin can view applications

---

## 🎉 You're Ready When...

1. Backend runs without errors
2. Frontend runs without errors  
3. Can complete student flow
4. Can complete admin flow
5. Everything pushed to GitHub
6. Screenshots taken
7. README updated

---

**LAST MINUTE CHECKLIST:**

□ Backend running?
□ Frontend running?
□ Can register?
□ Can login?
□ Can submit app?
□ Admin works?
□ On GitHub?
□ Ready to present?

---

**You've got this! 💪**

**Deadline: Today, February 13, 2026**

**Status: Sprint 2 & 3 Complete!** ✓

---

*Keep this card handy during development and presentation!*
