const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    console.log('=== REGISTER START ===');
    console.log('Email:', email);

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      console.log('Email already exists');
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully');

    // Create user - USING 'password' COLUMN NOT 'password_hash'
    console.log('Creating user in database...');
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        email: email.toLowerCase(),
        password: hashedPassword,  // CHANGED FROM password_hash
        first_name: firstName,
        last_name: lastName,
        role: 'student'
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return res.status(500).json({ error: 'Failed to create user account' });
    }

    console.log('User created:', newUser.id);

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('=== REGISTER SUCCESS ===');

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('=== REGISTER ERROR ===');
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('=== LOGIN START ===');
    console.log('Email:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (userError) {
      console.error('Database error:', userError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User found:', user.id);
    console.log('Has password:', !!user.password);

    if (!user.password) {
      console.error('User has no password - corrupted account');
      return res.status(500).json({ error: 'Account data corrupted. Please contact support.' });
    }

    // Verify password - USING 'password' COLUMN NOT 'password_hash'
    console.log('Comparing passwords...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('=== LOGIN SUCCESS ===');

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.logout = async (req, res) => {
  res.json({ message: 'Logout successful' });
};
