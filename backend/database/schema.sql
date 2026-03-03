-- =====================================================
-- Student Application Screening System - Database Schema
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- STUDENT PROFILES TABLE
-- =====================================================
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    nationality VARCHAR(100),
    profile_picture_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- APPLICATIONS TABLE
-- =====================================================
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Personal Information
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT NOT NULL,
    
    -- Academic Information
    high_school_name VARCHAR(255) NOT NULL,
    high_school_gpa DECIMAL(3, 2),
    graduation_year INTEGER NOT NULL,
    intended_major VARCHAR(255),
    
    -- Additional Information
    extracurricular_activities TEXT,
    personal_statement TEXT,
    
    -- Application Status
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'evaluated', 'accepted', 'rejected')),
    
    -- AI Evaluation
    ai_score DECIMAL(5, 2),
    ai_ranking INTEGER,
    ai_evaluation_date TIMESTAMP,
    
    -- Timestamps
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP
);

-- =====================================================
-- DOCUMENTS TABLE
-- =====================================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ADMIN ACTIONS LOG TABLE
-- =====================================================
CREATE TABLE admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_ai_score ON applications(ai_score DESC);
CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at DESC);

-- =====================================================
-- TRIGGERS for updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert a test admin user (password: Admin123!)
-- Note: In production, hash this password using bcrypt
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('admin@university.edu', '$2b$10$rQXJqWkzKz7qU5gYxZQGGOYnZXxQxYxHxGxJxKxLxMxNxOxPxQxRx', 'Admin', 'User', 'admin');

-- Insert a test student user (password: Student123!)
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('student@test.com', '$2b$10$rQXJqWkzKz7qU5gYxZQGGOYnZXxQxYxHxGxJxKxLxMxNxOxPxQxRx', 'John', 'Doe', 'student');

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Students can view/update their own profile
CREATE POLICY "Students can manage own profile" ON student_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Students can view/create/update their own applications
CREATE POLICY "Students can manage own applications" ON applications
    FOR ALL USING (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Admins can update application status
CREATE POLICY "Admins can update applications" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Documents follow application permissions
CREATE POLICY "Documents follow application permissions" ON documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = documents.application_id 
            AND applications.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Admin actions log is admin-only
CREATE POLICY "Admins can view action logs" ON admin_actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- =====================================================
-- VIEWS for Common Queries
-- =====================================================

-- View for applications with user details
CREATE OR REPLACE VIEW applications_with_users AS
SELECT 
    a.*,
    u.first_name || ' ' || u.last_name as applicant_name,
    u.email as applicant_email,
    COUNT(d.id) as document_count
FROM applications a
JOIN users u ON a.user_id = u.id
LEFT JOIN documents d ON a.id = d.application_id
GROUP BY a.id, u.first_name, u.last_name, u.email;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✓ Database schema created successfully!';
    RAISE NOTICE '✓ Tables: users, student_profiles, applications, documents, admin_actions';
    RAISE NOTICE '✓ Indexes created for performance';
    RAISE NOTICE '✓ Triggers added for automatic timestamp updates';
    RAISE NOTICE '✓ Row Level Security policies enabled';
    RAISE NOTICE '✓ Sample admin user: admin@university.edu (password: Admin123!)';
    RAISE NOTICE '✓ Sample student user: student@test.com (password: Student123!)';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Update the sample user passwords with properly hashed versions';
    RAISE NOTICE '2. Configure Supabase storage buckets for document uploads';
    RAISE NOTICE '3. Set up your backend .env file with database credentials';
END $$;
