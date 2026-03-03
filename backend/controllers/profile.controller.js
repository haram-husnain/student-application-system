const supabase = require('../config/supabase');

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('Getting profile for user:', userId);

    // Fetch user basic info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch student profile if exists
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    console.log('Profile data:', profile);

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      profile: profile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, firstName, lastName, phone, address, dateOfBirth, gender, nationality } = req.body;

    console.log('=== UPDATE PROFILE START ===');
    console.log('User ID:', userId);
    console.log('Request body:', req.body);

    // Update user table
    const userUpdates = {};
    if (email) userUpdates.email = email;
    if (firstName) userUpdates.first_name = firstName;
    if (lastName) userUpdates.last_name = lastName;

    console.log('Updating users table with:', userUpdates);

    const { data: updatedUser, error: userUpdateError } = await supabase
      .from('users')
      .update(userUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (userUpdateError) {
      console.error('User update error:', userUpdateError);
      return res.status(500).json({ error: 'Failed to update user info' });
    }

    console.log('User updated successfully');

    // Update/create profile
    const profileUpdates = {};
    if (phone !== undefined) profileUpdates.phone = phone;
    if (address !== undefined) profileUpdates.address = address;
    if (dateOfBirth !== undefined) profileUpdates.date_of_birth = dateOfBirth;
    if (gender !== undefined) profileUpdates.gender = gender;
    if (nationality !== undefined) profileUpdates.nationality = nationality;

    console.log('Profile updates:', profileUpdates);

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    let profileData;

    if (existingProfile) {
      console.log('Updating existing profile');
      const { data, error } = await supabase
        .from('student_profiles')
        .update(profileUpdates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({ error: 'Failed to update profile' });
      }
      profileData = data;
    } else {
      console.log('Creating new profile');
      const { data, error } = await supabase
        .from('student_profiles')
        .insert([{ user_id: userId, ...profileUpdates }])
        .select()
        .single();

      if (error) {
        console.error('Profile create error:', error);
        return res.status(500).json({ error: 'Failed to create profile' });
      }
      profileData = data;
    }

    console.log('=== UPDATE PROFILE SUCCESS ===');

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name
      },
      profile: profileData
    });

  } catch (error) {
    console.error('=== UPDATE PROFILE ERROR ===');
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const { error } = await supabase
      .from('student_profiles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Delete profile error:', error);
      return res.status(500).json({ error: 'Failed to delete profile' });
    }

    res.status(200).json({ message: 'Profile deleted successfully' });

  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Server error deleting profile' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile
};
