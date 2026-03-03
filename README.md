# Student Application Screening System with AI and Secure Data Handling

## 📋 Project Information

**Group:** Group 7  
**Course:** ITS120L - FOPM02  
**Institution:** Mapúa University  
**Deadline:** Sprint 2 & 3 - February 13, 2026

### Team Members & Responsibilities

#### Backend Team:
- **Husnain, Haram** - Authentication API
- **Coquia, Anne** - Student Profile API & AI Implementation
- **Aquino, Leona** - Application API
- **Sulit, Alexandra** - Document Upload API
- **Anievas, James** - Admin Dashboard API

#### Frontend Team:
- **Husnain, Haram** - Login & Registration UI + Functionality
- **Coquia, Anne** - Student Profile UI + Create/Update
- **Aquino, Leona** - Application Form UI + Create/View
- **Sulit, Alexandra** - Document Upload UI + Functionality
- **Anievas, James** - Admin Dashboard UI + View

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Supabase account (free tier)
- Git

### Step 1: Database Setup

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new account (if you don't have one)
3. Create a new project
4. Go to Settings > API and copy:
   - `Project URL` (SUPABASE_URL)
   - `anon` / `public` key (SUPABASE_ANON_KEY)
5. Go to Settings > Database > Connection String
   - Copy the `Direct Connection` URL (DATABASE_URL)
6. Go to SQL Editor
7. Paste the contents of `backend/database/schema.sql`
8. Run the query

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials (use nano, vim, or any text editor)
nano .env

# Start the backend server
npm run dev
```

Your backend should now be running on `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

Your frontend should now be running on `http://localhost:3000`

### Step 4: Test the Application

1. Open browser to `http://localhost:3000`
2. Register a new student account
3. Login and test the features

**Default Admin Credentials** (from database seed):
- Email: `admin@university.edu`
- Password: `Admin123!`

---

## 📁 Project Structure

```
student-application-system/
├── backend/
│   ├── config/
│   │   └── supabase.js           # Supabase client configuration
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   ├── profile.controller.js # Profile management
│   │   ├── application.controller.js # Application CRUD
│   │   ├── document.controller.js # Document uploads
│   │   └── admin.controller.js   # Admin operations
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── profile.routes.js
│   │   ├── application.routes.js
│   │   ├── document.routes.js
│   │   └── admin.routes.js
│   ├── uploads/                  # Uploaded documents storage
│   ├── database/
│   │   └── schema.sql            # Database schema
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   └── .env                      # Environment variables (not in git)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── student/
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── ApplicationForm.jsx
│   │   │   │   ├── ApplicationStatus.jsx
│   │   │   │   └── DocumentUpload.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       └── ApplicationDetail.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state
│   │   ├── services/
│   │   │   └── api.js            # API client
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css               # Global styles
│   │   └── main.jsx              # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── README.md
└── SETUP_GUIDE.md
```

---

## 🔧 Environment Variables

### Backend (.env)

```env
PORT=5000
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
OPENAI_API_KEY=sk-your-openai-key-optional-for-sprint-4
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout user

### Profile
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/:userId` - Update profile
- `DELETE /api/profile/:userId` - Delete profile

### Applications
- `POST /api/applications` - Create application
- `GET /api/applications` - Get user's applications
- `GET /api/applications/:id` - Get specific application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:applicationId` - Get documents
- `GET /api/documents/download/:documentId` - Download document
- `DELETE /api/documents/:documentId` - Delete document

### Admin
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/applications/:id` - Get application details
- `PUT /api/admin/applications/:id/status` - Update status
- `PUT /api/admin/applications/:id/ai-evaluation` - Update AI score
- `DELETE /api/admin/applications/:id` - Delete application
- `GET /api/admin/statistics` - Get statistics
- `GET /api/admin/logs` - Get admin logs

---

## ✅ Sprint 2 & 3 Deliverables

### Sprint 2: UI Coding Iteration (Completed)
- ✓ Login and Registration UI
- ✓ Student Profile UI
- ✓ Student Application Form UI
- ✓ Document Upload UI
- ✓ Admin Dashboard UI

### Sprint 3: UI Coding Implementation (Completed)
- ✓ Login and Registration functionality
- ✓ Student profile create and update
- ✓ Application create and view
- ✓ Document upload functionality
- ✓ Admin application view

---

## 🧪 Testing

### Manual Testing Checklist

#### Student Flow:
1. Register a new student account
2. Login with student credentials
3. Update profile information
4. Create a new application
5. Upload required documents
6. View application status

#### Admin Flow:
1. Login with admin credentials
2. View all applications
3. Filter applications by status
4. View application details
5. Update application status
6. View statistics

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process if needed
kill -9 [PID]

# Verify environment variables
cat .env

# Check database connection
# Make sure DATABASE_URL is correct
```

### Frontend Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if port 3000 is in use
lsof -i :3000
```

### Database Issues
```bash
# Re-run the schema
# Go to Supabase SQL Editor
# Paste contents of backend/database/schema.sql
# Execute
```

### CORS Errors
- Make sure backend is running on port 5000
- Check that frontend proxy is configured in vite.config.js
- Verify CORS is enabled in server.js

---

## 📝 Git Workflow

```bash
# Initialize repository (first time only)
git init
git add .
git commit -m "Initial commit: Sprint 2 & 3 implementation"

# Create GitHub repository
# Then push to GitHub
git remote add origin https://github.com/yourusername/student-application-system.git
git branch -M main
git push -u origin main

# For updates
git add .
git commit -m "Description of changes"
git push
```

---

## 🔐 Security Notes

- Never commit `.env` files to Git
- Use strong JWT secrets in production
- Enable Row Level Security in Supabase
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Sanitize file uploads

---

## 📚 Technologies Used

### Backend:
- Node.js
- Express.js
- Supabase (PostgreSQL)
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads

### Frontend:
- React 18
- Vite
- React Router DOM
- Axios
- Context API for state management

---

## 🎯 Next Steps (Sprint 4)

- Application update and delete functionality
- AI-based application screening
- Admin status updates with notifications
- Action logging
- Secure data handling validation
- AI integration with OpenAI/Gemini API

---

## 👥 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review error messages in browser console (F12)
3. Check backend terminal for errors
4. Contact team members

---

## 📄 License

This project is for educational purposes as part of ITS120L course requirements.

---

## 🙏 Acknowledgments

- Prof. Crizepvill Dumalaog
- Mapúa University
- Group 7 Team Members
- Anthropic (for technical guidance)

---

**Last Updated:** February 13, 2026
**Status:** Sprint 2 & 3 Completed ✓
