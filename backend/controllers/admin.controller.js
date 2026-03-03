const supabase = require('../config/supabase');

/**
 * Get all applications (Admin only)
 */
const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;

    console.log('Fetching all applications, status filter:', status);

    let query = supabase
      .from('applications')
      .select('*')
      .order('submitted_at', { ascending: false });

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data: applications, error } = await query;

    if (error) {
      console.error('Fetch all applications error:', error);
      throw error;
    }

    console.log('Applications fetched:', applications?.length);

    res.status(200).json({
      applications: applications || []
    });

  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      error: 'Failed to fetch applications'
    });
  }
};

/**
 * Get application statistics (Admin only)
 */
const getStatistics = async (req, res) => {
  try {
    console.log('Fetching statistics');

    // Get all applications
    const { data: applications, error } = await supabase
      .from('applications')
      .select('*');

    if (error) throw error;

    // Calculate statistics
    const totalApplications = applications.length;
    
    const statusCounts = {
      submitted: applications.filter(app => app.status === 'submitted').length,
      under_review: applications.filter(app => app.status === 'under_review').length,
      evaluated: applications.filter(app => app.status === 'evaluated').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };

    // Calculate average AI score
    const applicationsWithScore = applications.filter(app => app.ai_score);
    const averageAIScore = applicationsWithScore.length > 0
      ? Math.round(applicationsWithScore.reduce((sum, app) => sum + app.ai_score, 0) / applicationsWithScore.length)
      : 0;

    console.log('Statistics calculated:', { totalApplications, statusCounts, averageAIScore });

    res.status(200).json({
      statistics: {
        totalApplications,
        statusCounts,
        averageAIScore
      }
    });

  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics'
    });
  }
};

/**
 * Get single application details (Admin only)
 */
const getApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;

    console.log('Fetching application details:', applicationId);

    // Get application
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Get documents
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', applicationId);

    console.log('Application details fetched');

    res.status(200).json({
      application,
      documents: documents || []
    });

  } catch (error) {
    console.error('Get application details error:', error);
    res.status(500).json({
      error: 'Failed to fetch application details'
    });
  }
};

/**
 * Update application status (Admin only)
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    console.log('Updating application status:', applicationId, status);

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['submitted', 'under_review', 'evaluated', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('applications')
      .update({ 
        status,
        reviewed_by: req.user.id,
        updated_at: new Date()
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error('Update status error:', error);
      throw error;
    }

    console.log('Status updated successfully');

    res.status(200).json({
      message: 'Application status updated successfully',
      application: data
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      error: 'Failed to update application status'
    });
  }
};

/**
 * Delete application (Admin only)
 */
const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    console.log('Deleting application:', applicationId);

    // Delete documents first
    await supabase
      .from('documents')
      .delete()
      .eq('application_id', applicationId);

    // Delete application
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId);

    if (error) {
      console.error('Delete application error:', error);
      throw error;
    }

    console.log('Application deleted successfully');

    res.status(200).json({
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      error: 'Failed to delete application'
    });
  }
};

module.exports = {
  getAllApplications,
  getStatistics,
  getApplicationDetails,
  updateApplicationStatus,
  deleteApplication
};
