# Complete Setup Guide - Student Application Screening System
**Sprint 2 & 3 Combined Implementation**
**Due: February 13, 2026**

## 📋 Overview
This guide provides complete, copy-paste ready code for both backend and frontend implementation.

## 🎯 Team Assignments

### Backend Team
- **Husnain, Haram**: Authentication API
- **Coquia, Anne**: Student Profile API & AI Implementation
- **Aquino, Leona**: Application API
- **Sulit, Alexandra**: Document Upload API
- **Anievas, James**: Admin Dashboard API

### Frontend Team
- **Husnain, Haram**: Login & Registration UI + Functionality
- **Coquia, Anne**: Student Profile UI + Create/Update
- **Aquino, Leona**: Application Form UI + Create/View
- **Sulit, Alexandra**: Document Upload UI + Functionality
- **Anievas, James**: Admin Dashboard UI + View

---

## 🚀 Quick Start (5 Steps)

### Step 1: Clone and Setup Repository
```bash
# Create project directory
mkdir student-application-system
cd student-application-system

# Initialize git
git init
```

### Step 2: Setup Supabase Database
1. Go to https://supabase.com and create a free account
2. Create a new project (name: `student-app-screening`)
3. Save these credentials (you'll need them):
   - `SUPABASE_URL`: Found in Settings > API
   - `SUPABASE_ANON_KEY`: Found in Settings > API
   - `DATABASE_URL`: Found in Settings > Database > Connection String (use the Direct Connection)

### Step 3: Setup Backend
```bash
# Create and navigate to backend directory
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors dotenv bcrypt jsonwebtoken multer @supabase/supabase-js
npm install --save-dev nodemon

# Create .env file (update with your credentials)
cat > .env << 'EOF'
PORT=5000
DATABASE_URL=your_postgresql_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
OPENAI_API_KEY=your_openai_api_key_optional
EOF

# Go back to root
cd ..
```

### Step 4: Setup Frontend
```bash
# Create Vite + React project
npm create vite@latest frontend -- --template react

# Navigate to frontend
cd frontend

# Install dependencies
npm install axios react-router-dom

# Go back to root
cd ..
```

### Step 5: Database Setup in Supabase
1. Open Supabase Dashboard > SQL Editor
2. Copy and paste the SQL from `backend/database/schema.sql` (we'll create this)
3. Run the query

---

## 📁 Complete File Structure

```
student-application-system/
├── backend/
│   ├── config/
│   │   └── supabase.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── profile.routes.js
│   │   ├── application.routes.js
│   │   ├── document.routes.js
│   │   └── admin.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── profile.controller.js
│   │   ├── application.controller.js
│   │   ├── document.controller.js
│   │   └── admin.controller.js
│   ├── uploads/
│   ├── database/
│   │   └── schema.sql
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── student/
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── ApplicationForm.jsx
│   │   │   │   ├── DocumentUpload.jsx
│   │   │   │   └── ApplicationStatus.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       └── ApplicationDetail.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── README.md
└── .gitignore
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
OPENAI_API_KEY=sk-your-openai-key-optional
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📝 Implementation Timeline

### Today (February 13, 2026) - Sprints 2 & 3
- **9:00 AM - 10:30 AM**: Database setup + Backend structure
- **10:30 AM - 12:00 PM**: Backend API implementation
- **12:00 PM - 1:00 PM**: Lunch break
- **1:00 PM - 3:00 PM**: Frontend components
- **3:00 PM - 4:00 PM**: Integration & testing
- **4:00 PM - 5:00 PM**: Git commit, documentation, submission

---

## 🎯 Success Criteria

### Sprint 2 (UI Coding Iteration) - Completed ✓
- [x] Login and Registration UI
- [x] Student Profile UI
- [x] Student Application Form UI
- [x] Document Upload UI
- [x] Admin Dashboard UI

### Sprint 3 (UI Coding Implementation) - Completed ✓
- [x] Login and Registration functionality
- [x] Student profile create and update
- [x] Application create and view
- [x] Document upload functionality
- [x] Admin application view

---

## 🚨 Critical Notes

1. **NEVER commit .env files** - They're in .gitignore
2. **Test each API endpoint** before connecting frontend
3. **Use Postman** or Thunder Client for API testing
4. **Keep backup** of database schema
5. **Document all bugs** in sprint meetings

---

## 📞 Support

If you get stuck:
1. Check this guide first
2. Review error messages carefully
3. Check browser console (F12)
4. Check backend terminal for errors
5. Verify environment variables are loaded

---

## 📚 Next Steps After Today

Tomorrow you'll implement Sprint 4:
- Application update and delete
- AI-based screening
- Admin status updates
- Action logging
- Secure data validation
