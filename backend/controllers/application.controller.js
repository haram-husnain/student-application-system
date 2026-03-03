const supabase = require('../config/supabase');

/**
 * Create a new application
 * POST /api/applications
 */
const createApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      address,
      highSchoolName,
      highSchoolGpa,
      graduationYear,
      intendedMajor,
      extracurricularActivities,
      personalStatement
    } = req.body;

    // Validation
    if (!fullName || !email || !phone || !dateOfBirth || !address || 
        !highSchoolName || !graduationYear || !intendedMajor) {
      return res.status(400).json({ 
        error: 'All required fields must be filled.' 
      });
    }

    // Validate GPA range
    if (highSchoolGpa && (highSchoolGpa < 75 || highSchoolGpa > 100)) {
      return res.status(400).json({ 
        error: 'General Average must be between 75 and 100.' 
      });
    }

    // Validate graduation year
    const currentYear = new Date().getFullYear();
    if (graduationYear < currentYear - 10 || graduationYear > currentYear + 5) {
      return res.status(400).json({ 
        error: 'Graduation year must be within reasonable range.' 
      });
    }

    // Check if user already has a pending or under review application
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id, status')
      .eq('user_id', userId)
      .in('status', ['submitted', 'under_review'])
      .single();

    if (existingApplication) {
      return res.status(409).json({ 
        error: 'You already have a pending application. Please wait for it to be reviewed.' 
      });
    }

    // Create application
    const { data: newApplication, error: insertError } = await supabase
      .from('applications')
      .insert([
        {
          user_id: userId,
          full_name: fullName,
          email: email.toLowerCase(),
          phone,
          date_of_birth: dateOfBirth,
          address,
          high_school_name: highSchoolName,
          high_school_gpa: highSchoolGpa,
          graduation_year: graduationYear,
          intended_major: intendedMajor,
          extracurricular_activities: extracurricularActivities,
          personal_statement: personalStatement,
          status: 'submitted'
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Application creation error:', insertError);
      return res.status(500).json({ 
        error: 'Failed to create application.' 
      });
    }

    res.status(201).json({
      message: 'Application submitted successfully.',
      application: newApplication
    });

  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ 
      error: 'An error occurred while creating the application.' 
    });
  }
};

/**
 * Get all applications for the current user
 * GET /api/applications
 */
const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: applications, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Fetch applications error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch applications.' 
      });
    }

    res.status(200).json({
      applications: applications || []
    });

  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching applications.' 
    });
  }
};

/**
 * Get a specific application by ID
 * GET /api/applications/:id
 */
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const { data: application, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !application) {
      return res.status(404).json({ 
        error: 'Application not found.' 
      });
    }

    // Authorization check: students can only view their own applications
    if (userRole === 'student' && application.user_id !== userId) {
      return res.status(403).json({ 
        error: 'You can only view your own applications.' 
      });
    }

    // Fetch associated documents
    const { data: documents } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', id)
      .order('uploaded_at', { ascending: false });

    res.status(200).json({
      application,
      documents: documents || []
    });

  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching the application.' 
    });
  }
};

/**
 * Update an application
 * PUT /api/applications/:id
 */
const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Fetch existing application
    const { data: existingApplication, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingApplication) {
      return res.status(404).json({ 
        error: 'Application not found.' 
      });
    }

    // Authorization check: students can only update their own applications
    if (userRole === 'student' && existingApplication.user_id !== userId) {
      return res.status(403).json({ 
        error: 'You can only update your own applications.' 
      });
    }

    // Students can only update applications with 'submitted' status
    if (userRole === 'student' && existingApplication.status !== 'submitted') {
      return res.status(403).json({ 
        error: 'You cannot update an application that is already under review or evaluated.' 
      });
    }

    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      address,
      highSchoolName,
      highSchoolGpa,
      graduationYear,
      intendedMajor,
      extracurricularActivities,
      personalStatement
    } = req.body;

    // Build update object
    const updates = {};
    if (fullName) updates.full_name = fullName;
    if (email) updates.email = email.toLowerCase();
    if (phone) updates.phone = phone;
    if (dateOfBirth) updates.date_of_birth = dateOfBirth;
    if (address) updates.address = address;
    if (highSchoolName) updates.high_school_name = highSchoolName;
    if (highSchoolGpa !== undefined) updates.high_school_gpa = highSchoolGpa;
    if (graduationYear) updates.graduation_year = graduationYear;
    if (intendedMajor) updates.intended_major = intendedMajor;
    if (extracurricularActivities !== undefined) updates.extracurricular_activities = extracurricularActivities;
    if (personalStatement !== undefined) updates.personal_statement = personalStatement;

    // Update application
    const { data: updatedApplication, error: updateError } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Application update error:', updateError);
      return res.status(500).json({ 
        error: 'Failed to update application.' 
      });
    }

    res.status(200).json({
      message: 'Application updated successfully.',
      application: updatedApplication
    });

  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ 
      error: 'An error occurred while updating the application.' 
    });
  }
};

/**
 * Delete an application (admin only)
 * DELETE /api/applications/:id
 */
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    // Only admins can delete applications
    if (userRole !== 'admin') {
      return res.status(403).json({ 
        error: 'Only administrators can delete applications.' 
      });
    }

    // Check if application exists
    const { data: application } = await supabase
      .from('applications')
      .select('id')
      .eq('id', id)
      .single();

    if (!application) {
      return res.status(404).json({ 
        error: 'Application not found.' 
      });
    }

    // Delete application (cascade will handle documents)
    const { error: deleteError } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Application deletion error:', deleteError);
      return res.status(500).json({ 
        error: 'Failed to delete application.' 
      });
    }

    res.status(200).json({ 
      message: 'Application deleted successfully.' 
    });

  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ 
      error: 'An error occurred while deleting the application.' 
    });
  }
};

module.exports = {
  createApplication,
  getUserApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
};
