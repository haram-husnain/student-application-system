# 🚀 DEPLOYMENT & SUBMISSION GUIDE

## Sprint 2 & 3 - Due: February 13, 2026

---

## ⏰ Timeline for Today

```
9:00 AM - 10:00 AM  → Database setup & Backend installation
10:00 AM - 11:00 AM → Backend testing
11:00 AM - 12:00 PM → Frontend installation & integration
12:00 PM - 1:00 PM  → Lunch break
1:00 PM - 3:00 PM   → Full system testing & bug fixes
3:00 PM - 4:00 PM   → Git commit & documentation
4:00 PM - 5:00 PM   → Final testing & submission
```

---

## 📝 Pre-Deployment Checklist

### Before You Start:
- [ ] Supabase account created
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git installed (`git --version`)
- [ ] GitHub account ready
- [ ] All team members have access

---

## 🎯 STEP-BY-STEP DEPLOYMENT

### STEP 1: Supabase Setup (15 minutes)

1. **Create Supabase Project:**
   ```
   → Go to https://supabase.com
   → Sign up / Log in
   → Click "New Project"
   → Project name: student-app-screening
   → Database password: [SAVE THIS!]
   → Region: Southeast Asia (Singapore)
   → Click "Create new project"
   → Wait 2-3 minutes for provisioning
   ```

2. **Get API Credentials:**
   ```
   → Click Settings (gear icon)
   → Click "API"
   → Copy "Project URL" → This is your SUPABASE_URL
   → Copy "anon public" key → This is your SUPABASE_ANON_KEY
   ```

3. **Get Database URL:**
   ```
   → Click Settings
   → Click "Database"
   → Scroll to "Connection string"
   → Select "Direct Connection"
   → Copy the URL
   → Replace [YOUR-PASSWORD] with your database password
   → This is your DATABASE_URL
   ```

4. **Run Database Schema:**
   ```
   → Click "SQL Editor" in left sidebar
   → Click "New query"
   → Open backend/database/schema.sql
   → Copy ALL contents
   → Paste into SQL Editor
   → Click "RUN" button
   → You should see "Success. No rows returned"
   ```

---

### STEP 2: Backend Setup (20 minutes)

1. **Navigate to Backend:**
   ```bash
   cd student-application-system/backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   
   **If this fails:**
   ```bash
   # Delete node_modules if exists
   rm -rf node_modules package-lock.json
   
   # Try again
   npm install
   ```

3. **Create .env File:**
   ```bash
   # Copy the example
   cp .env.example .env
   
   # Edit the file (use nano, vim, or your editor)
   nano .env
   ```

4. **Fill in .env Variables:**
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
   SUPABASE_URL=https://[project-id].supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   JWT_SECRET=student_application_system_secret_key_2026_very_secure
   ```
   
   **IMPORTANT:** Replace [password] and [project-id] with YOUR values!

5. **Test Backend:**
   ```bash
   npm run dev
   ```
   
   **Expected Output:**
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Student Application Screening System
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✓ Server running on port 5000
   ✓ API available at http://localhost:5000
   ✓ Environment: development
   ```

6. **Test API Health Check:**
   ```bash
   # Open new terminal
   curl http://localhost:5000
   ```
   
   **Expected Response:**
   ```json
   {
     "message": "Student Application Screening System API",
     "version": "1.0.0",
     "status": "running",
     "timestamp": "2026-02-13T..."
   }
   ```

7. **Test Registration Endpoint:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@student.com",
       "password": "Test12345!",
       "confirmPassword": "Test12345!",
       "firstName": "Test",
       "lastName": "Student"
     }'
   ```
   
   **Expected Response:**
   ```json
   {
     "message": "User registered successfully.",
     "token": "eyJhbGci...",
     "user": {...}
   }
   ```

---

### STEP 3: Frontend Setup (15 minutes)

1. **Open NEW Terminal** (keep backend running)

2. **Navigate to Frontend:**
   ```bash
   cd student-application-system/frontend
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```
   
   **If you see warnings about React or Vite:**
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Start Frontend:**
   ```bash
   npm run dev
   ```
   
   **Expected Output:**
   ```
   VITE v5.0.8  ready in 500 ms
   
   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ➜  press h to show help
   ```

5. **Open Browser:**
   ```
   → Open http://localhost:3000
   → You should see the Login page
   ```

---

### STEP 4: Full System Testing (30 minutes)

#### Test 1: Student Registration & Login
```
1. Click "Register here"
2. Fill in all fields:
   - First Name: John
   - Last Name: Doe
   - Email: john@student.com
   - Password: Student123!
   - Confirm Password: Student123!
3. Click "Register"
4. Should redirect to Student Dashboard
5. Logout
6. Login with same credentials
7. Should redirect back to Student Dashboard
```

#### Test 2: Student Profile
```
1. Login as student
2. Click "View Profile" or navigate to /student/profile
3. Click "Edit Profile"
4. Fill in:
   - Phone: +1234567890
   - Date of Birth: 2000-01-01
   - Gender: Male
   - Nationality: Philippines
   - Address: 123 Main St
5. Click "Save Changes"
6. Should show "Profile updated successfully!"
```

#### Test 3: Application Submission
```
1. Login as student
2. Click "Apply Now" or navigate to /student/apply
3. Fill in ALL required fields:
   - Full Name: John Doe
   - Email: john@student.com
   - Phone: +1234567890
   - Date of Birth: 2000-01-01
   - Address: 123 Main St, City
   - High School Name: Test High School
   - GPA: 3.8
   - Graduation Year: 2024
   - Intended Major: Computer Science
   - Extracurricular: Basketball, Debate Club
   - Personal Statement: Write something
4. Click "Submit Application"
5. Should see "Application submitted successfully!"
6. Should redirect to applications list
```

#### Test 4: Document Upload
```
1. From applications list
2. Click "View Details" on your application
3. Navigate to document upload section
4. Select Document Type: Transcript
5. Choose a PDF file (< 5MB)
6. Click "Upload Document"
7. Should see "Document uploaded successfully!"
8. Document should appear in list below
```

#### Test 5: Admin Login & Dashboard
```
1. Logout
2. Login as admin:
   - Email: admin@university.edu
   - Password: Admin123!
3. Should redirect to Admin Dashboard
4. Should see statistics cards
5. Should see applications list
6. Should see John Doe's application
```

#### Test 6: Admin Application Review
```
1. In Admin Dashboard
2. Click "View" on John Doe's application
3. Should see all application details
4. Change status to "Under Review"
5. Click "Update Status"
6. Should see "Status updated successfully!"
7. Status should change in the display
```

---

### STEP 5: Bug Fixing (30 minutes)

#### Common Issues & Solutions:

**Issue: "Failed to fetch"**
```bash
# Solution 1: Check backend is running
# In backend terminal, should see server running

# Solution 2: Check port
# Backend should be on 5000
# Frontend should be on 3000

# Solution 3: Restart both servers
# Ctrl+C in both terminals, then npm run dev again
```

**Issue: "Invalid token" or "401 Unauthorized"**
```bash
# Solution: Clear localStorage
# In browser console (F12):
localStorage.clear()
# Then refresh page
```

**Issue: "Cannot connect to database"**
```bash
# Solution: Verify DATABASE_URL in backend/.env
# Make sure password is correct
# Test connection in Supabase dashboard
```

**Issue: "File upload failed"**
```bash
# Solution: Check uploads directory exists
cd backend
mkdir -p uploads
```

**Issue: CSS not loading**
```bash
# Solution: Clear browser cache
# Or hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

---

### STEP 6: Git & GitHub Setup (20 minutes)

1. **Initialize Git:**
   ```bash
   cd student-application-system
   git init
   ```

2. **Add Files:**
   ```bash
   git add .
   git status  # Verify .env is NOT listed (should be ignored)
   ```

3. **Commit:**
   ```bash
   git commit -m "Sprint 2 & 3: Complete full-stack implementation

   Implemented features:
   - User authentication (login/register)
   - Student profile management
   - Application submission system
   - Document upload functionality
   - Admin dashboard and review system
   - Complete API backend with Supabase
   - React frontend with routing
   
   Team: Husnain, Coquia, Aquino, Sulit, Anievas"
   ```

4. **Create GitHub Repository:**
   ```
   → Go to https://github.com
   → Click "New repository"
   → Name: student-application-system
   → Description: ITS120L Term Project - Automated Student Application Screening
   → Private or Public (choose based on instructor requirements)
   → DON'T initialize with README (we already have one)
   → Click "Create repository"
   ```

5. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/student-application-system.git
   git branch -M main
   git push -u origin main
   ```

6. **Verify on GitHub:**
   ```
   → Refresh your GitHub repository page
   → Should see all files
   → Check README.md displays properly
   → Verify .env is NOT visible (should be ignored)
   ```

---

### STEP 7: Documentation (15 minutes)

1. **Create Screenshots:**
   ```
   Take screenshots of:
   - Login page
   - Registration page
   - Student dashboard
   - Profile page
   - Application form
   - Document upload
   - Admin dashboard
   - Application detail page
   ```

2. **Create SCREENSHOTS folder:**
   ```bash
   mkdir screenshots
   # Save all screenshots here
   git add screenshots/
   git commit -m "Add screenshots for documentation"
   git push
   ```

3. **Update README if needed:**
   ```bash
   # Add any additional notes
   nano README.md
   git add README.md
   git commit -m "Update README with final notes"
   git push
   ```

---

### STEP 8: Final Submission (15 minutes)

1. **Create Submission Document:**
   - Copy GitHub repository URL
   - List all completed features
   - Include screenshots
   - Add team member contributions
   - Note any known issues

2. **Prepare for Presentation:**
   - Test all features one more time
   - Prepare talking points for each feature
   - Assign who presents what

3. **Submit to Instructor:**
   - GitHub repository link
   - Documentation
   - Screenshots
   - Any additional requirements

---

## ✅ Final Checklist

### Code Quality:
- [ ] All API endpoints work
- [ ] Frontend connects to backend
- [ ] Authentication works
- [ ] File upload works
- [ ] Admin features work
- [ ] No console errors in browser
- [ ] No server errors in terminal

### Documentation:
- [ ] README.md complete
- [ ] .env.example provided
- [ ] Database schema included
- [ ] Setup instructions clear
- [ ] Screenshots taken

### Git:
- [ ] All code committed
- [ ] Pushed to GitHub
- [ ] .env NOT in repository
- [ ] Repository is accessible

### Submission:
- [ ] GitHub URL shared
- [ ] Documentation submitted
- [ ] Team ready to present

---

## 🎉 Success Criteria

You're ready to submit when:
1. ✅ You can register a new student
2. ✅ You can login as student
3. ✅ You can submit an application
4. ✅ You can upload documents
5. ✅ Admin can view applications
6. ✅ Admin can update status
7. ✅ Everything is on GitHub
8. ✅ No critical errors

---

## 📞 Emergency Contacts

If something breaks at the last minute:

1. **Check error messages** - They usually tell you what's wrong
2. **Check this guide** - Most issues are covered
3. **Google the error** - Exact error message
4. **Check team chat** - Someone else might have fixed it
5. **Contact instructor** - If truly stuck

---

## 💡 Pro Tips

1. **Test Early**: Don't wait until last minute to test
2. **Commit Often**: Small commits are better than one big one
3. **Read Errors**: Error messages tell you exactly what's wrong
4. **Use Console**: F12 in browser shows detailed errors
5. **Stay Calm**: Most issues have simple fixes

---

## 🎯 What to Present

1. **Login/Register flow**
2. **Student submitting application**
3. **Document upload**
4. **Admin reviewing application**
5. **Status updates**
6. **Code walkthrough** (optional)

---

**Good luck with your submission!** 🚀

You've built a complete full-stack application with authentication, file uploads, and admin management. That's impressive work!

---

**Remember:**
- Sprint 2 & 3 are BOTH due today
- Backend + Frontend integration is complete
- All required features are implemented
- Focus on testing and documentation now

**You've got this! 💪**
