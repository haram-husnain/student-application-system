const supabase = require('../config/supabase');

/**
 * AI Scoring Algorithm (Philippine Education System)
 * Scores based on:
 * - GPA / General Average (30 points) - 75-100 scale
 * - Graduation Year (10 points) - Recent graduates preferred
 * - Senior High Track alignment (15 points)
 * - Personal Statement quality (15 points)
 * - Extracurricular Activities (15 points)
 * - Application completeness (15 points)
 * Total: 100 points
 */

const calculateAIScore = (application) => {
  let score = 0;
  const currentYear = new Date().getFullYear();

  // 1. GPA / General Average (30 points) - Most important factor
  if (application.high_school_gpa) {
    const gpa = parseFloat(application.high_school_gpa);
    
    if (gpa >= 98) score += 30;        // 98-100: Outstanding (30 pts)
    else if (gpa >= 95) score += 27;   // 95-97.99: Excellent (27 pts)
    else if (gpa >= 92) score += 24;   // 92-94.99: Very Good (24 pts)
    else if (gpa >= 90) score += 21;   // 90-91.99: Good (21 pts)
    else if (gpa >= 87) score += 18;   // 87-89.99: Above Average (18 pts)
    else if (gpa >= 85) score += 15;   // 85-86.99: Average (15 pts)
    else if (gpa >= 82) score += 12;   // 82-84.99: Fair (12 pts)
    else if (gpa >= 80) score += 9;    // 80-81.99: Passing (9 pts)
    else if (gpa >= 77) score += 6;    // 77-79.99: Low Passing (6 pts)
    else if (gpa >= 75) score += 3;    // 75-76.99: Barely Passing (3 pts)
  }

  // 2. Graduation Year (10 points) - Recent graduates get more points
  const yearDiff = currentYear - parseInt(application.graduation_year);
  if (yearDiff <= 0) score += 10;      // Current year or future (10 pts)
  else if (yearDiff <= 1) score += 8;  // Last year (8 pts)
  else if (yearDiff <= 2) score += 6;  // 2 years ago (6 pts)
  else if (yearDiff <= 3) score += 3;  // 3 years ago (3 pts)

  // 3. Track-Major Alignment (15 points)
  const trackMajorAlignment = {
    'STEM': [
      'BS Computer Engineering', 'BS Electrical Engineering', 'BS Mechanical Engineering', 
      'BS Civil Engineering', 'BS Industrial Engineering', 'BS Computer Science', 
      'BS Information Technology', 'BS Information Systems', 'BS Mathematics', 'BS Biology'
    ],
    'ABM': [
      'BS Business Administration', 'BS Accountancy', 'BS Marketing Management', 'BS Entrepreneurship'
    ],
    'HUMSS': [
      'BA Communication', 'BS Psychology', 'BA Political Science'
    ],
    'Arts and Design': [
      'BS Architecture', 'BS Interior Design', 'BS Multimedia Arts'
    ],
    'GAS': [] // General Academic Strand - fits any program
  };

  const track = application.senior_high_track;
  const major = application.intended_major;
  
  if (track && major) {
    if (track === 'GAS') {
      score += 10; // GAS students get partial credit
    } else {
      const alignedMajors = trackMajorAlignment[track] || [];
      if (alignedMajors.includes(major)) {
        score += 15; // Perfect alignment
      } else {
        score += 7; // Different track, partial credit
      }
    }
  }

  // 4. Personal Statement Quality (15 points)
  if (application.personal_statement) {
    const wordCount = application.personal_statement.split(/\s+/).length;
    if (wordCount >= 300) score += 15;      // 300+ words: Excellent (15 pts)
    else if (wordCount >= 200) score += 12; // 200-299 words: Good (12 pts)
    else if (wordCount >= 150) score += 9;  // 150-199 words: Fair (9 pts)
    else if (wordCount >= 100) score += 6;  // 100-149 words: Basic (6 pts)
    else if (wordCount >= 50) score += 3;   // 50-99 words: Minimal (3 pts)
  }

  // 5. Extracurricular Activities (15 points)
  if (application.extracurricular_activities) {
    const activityLength = application.extracurricular_activities.length;
    if (activityLength >= 300) score += 15;      // Extensive (15 pts)
    else if (activityLength >= 200) score += 12; // Strong (12 pts)
    else if (activityLength >= 150) score += 9;  // Moderate (9 pts)
    else if (activityLength >= 100) score += 6;  // Some (6 pts)
    else if (activityLength >= 50) score += 3;   // Minimal (3 pts)
  }

  // 6. Application Completeness (15 points)
  let completenessScore = 0;
  const requiredFields = [
    'full_name', 'email', 'phone', 'date_of_birth', 'address',
    'high_school_name', 'graduation_year', 'intended_major', 
    'senior_high_track', 'high_school_gpa'
  ];
  
  const filledFields = requiredFields.filter(field => application[field]).length;
  completenessScore = Math.round((filledFields / requiredFields.length) * 15);
  score += completenessScore;

  return Math.min(Math.round(score), 100); // Cap at 100 and round to whole number
};

/**
 * Evaluate single application
 */
const evaluateApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    console.log('Evaluating application:', applicationId);

    // Get application
    const { data: application, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (error || !application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Calculate AI score
    const aiScore = calculateAIScore(application);

    // Update application with AI score
    const { error: updateError } = await supabase
      .from('applications')
      .update({ 
        ai_score: aiScore,
        status: 'evaluated',
        updated_at: new Date()
      })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    console.log('AI evaluation complete. Score:', aiScore);

    res.status(200).json({
      message: 'Application evaluated successfully',
      aiScore
    });

  } catch (error) {
    console.error('AI evaluation error:', error);
    res.status(500).json({
      error: 'Failed to evaluate application'
    });
  }
};

/**
 * Evaluate all pending applications
 */
const evaluateAllApplications = async (req, res) => {
  try {
    console.log('Evaluating all pending applications');

    // Get all submitted or under_review applications
    const { data: applications, error } = await supabase
      .from('applications')
      .select('*')
      .in('status', ['submitted', 'under_review']);

    if (error) throw error;

    console.log('Found applications to evaluate:', applications?.length);

    // Evaluate each application
    const updates = applications.map(app => ({
      id: app.id,
      ai_score: calculateAIScore(app)
    }));

    // Update all at once
    for (const update of updates) {
      await supabase
        .from('applications')
        .update({ 
          ai_score: update.ai_score,
          status: 'evaluated',
          updated_at: new Date()
        })
        .eq('id', update.id);
    }

    console.log('Batch evaluation complete');

    res.status(200).json({
      message: `Successfully evaluated ${updates.length} applications`,
      evaluatedCount: updates.length
    });

  } catch (error) {
    console.error('Batch evaluation error:', error);
    res.status(500).json({
      error: 'Failed to evaluate applications'
    });
  }
};

module.exports = {
  evaluateApplication,
  evaluateAllApplications
};
