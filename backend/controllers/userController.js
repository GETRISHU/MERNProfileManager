
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const userData = req.body;
    
    // Add profile picture path if uploaded
    if (req.file) {
      userData.profilePicture = `uploads/${req.file.filename}`;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Validate password manually
    if (userData.password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(userData.password)) {
      return res.status(400).json({ message: 'Password must contain at least one special character' });
    }
    
    if (!/\d/.test(userData.password)) {
      return res.status(400).json({ message: 'Password must contain at least one number' });
    }
    
    // Create and save new user
    const user = new User(userData);
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    // Send response without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if username is available
exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.body;
    
    // Validate username format
    if (username.length < 4 || username.length > 20) {
      return res.status(400).json({ 
        isAvailable: false, 
        message: 'Username must be between 4 and 20 characters'
      });
    }
    
    if (/\s/.test(username)) {
      return res.status(400).json({ 
        isAvailable: false, 
        message: 'Username cannot contain spaces'
      });
    }
    
    // Check if username exists in database
    const existingUser = await User.findOne({ username });
    
    res.json({ 
      isAvailable: !existingUser,
      message: existingUser ? 'Username already taken' : 'Username available'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Handle password update separately
    if (userData.newPassword) {
      // Verify current password
      const isMatch = await user.comparePassword(userData.currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      // Validate new password
      if (userData.newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }
      
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(userData.newPassword)) {
        return res.status(400).json({ message: 'Password must contain at least one special character' });
      }
      
      if (!/\d/.test(userData.newPassword)) {
        return res.status(400).json({ message: 'Password must contain at least one number' });
      }
      
      user.password = userData.newPassword;
      
      // Remove password fields from update data
      delete userData.currentPassword;
      delete userData.newPassword;
    }
    
    // Add profile picture path if uploaded
    if (req.file) {
      // Delete old profile picture if exists
      if (user.profilePicture) {
        try {
          const fs = require('fs');
          const path = require('path');
          const oldPath = path.join(__dirname, '..', user.profilePicture);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        } catch (err) {
          console.error('Error deleting old profile picture:', err);
        }
      }
      userData.profilePicture = `uploads/${req.file.filename}`;
    }
    
    // Update other fields
    Object.keys(userData).forEach(key => {
      if (key !== 'password' && userData[key] !== undefined) {
        user[key] = userData[key];
      }
    });
    
    // Save updated user
    await user.save();
    
    // Send response without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
