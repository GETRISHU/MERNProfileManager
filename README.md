
# User Profile Wizard Form Builder

A multi-step form application built with the MERN stack (MongoDB, Express, React, Node.js) that includes frontend and backend validation, dynamic fields, file upload functionality, and real-time validation.

## Features

- Multi-step form with progress indicator
- Frontend + Backend validation (without third-party libraries)
- Dynamic fields based on user selection
- File upload with preview (profile picture)
- Real-time validation (username availability, password strength)
- Conditional logic for form fields
- Summary page before submission
- MongoDB integration for data storage

## Creating from Scratch

Here's a step-by-step guide to create this project from scratch:

### Step 1: Set up the Frontend

```bash
# Create a new React project with Vite
npm create vite@latest profile-wizard-form-builder -- --template react-ts
cd profile-wizard-form-builder

# Install dependencies
npm install react-router-dom
npm install tailwindcss postcss autoprefixer
npm install @radix-ui/react-icons
npm install class-variance-authority
npm install clsx
npm install tailwind-merge
npm install sonner
```

### Step 2: Set up Tailwind CSS

```bash
# Initialize Tailwind CSS
npx tailwindcss init -p
```

### Step 3: Set up the Backend

```bash
# Create a new directory for the backend
mkdir backend
cd backend

# Initialize a new Node.js project
npm init -y

# Install dependencies
npm install express mongoose cors dotenv multer bcryptjs jsonwebtoken
npm install nodemon --save-dev

# Create server.js file
touch server.js
```

### Step 4: Configure MongoDB

```bash
# Create a .env file for environment variables
touch .env

# Add MongoDB connection string to .env
echo "MONGODB_URI=mongodb://localhost:27017/profile-wizard" > .env
echo "PORT=5000" >> .env
echo "JWT_SECRET=your_jwt_secret" >> .env
```

### Step 5: Set up API Routes

```bash
# Create routes directory
mkdir routes
cd routes

# Create user routes
touch userRoutes.js
```

### Step 6: Create MongoDB Models

```bash
# Create models directory
mkdir models
cd models

# Create user model
touch User.js
```

### Step 7: Run the Application

```bash
# Run the backend server
cd backend
npm run dev

# In a new terminal, run the frontend
cd frontend
npm run dev
```

## How to Deploy the Application

### Step 1: Deploy the Backend (e.g., with Render.com)

1. Sign up for a free account on Render.com
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the build command: `npm install`
5. Set the start command: `node server.js`
6. Add environment variables (MONGODB_URI, JWT_SECRET)
7. Deploy

### Step 2: Deploy the Frontend (e.g., with Netlify or Vercel)

1. Sign up for a free account on Netlify or Vercel
2. Connect your GitHub repository
3. Set the build command: `npm run build`
4. Set the publish directory: `dist`
5. Add environment variables if needed
6. Deploy

### Step 3: Connect Frontend to Backend

Update your frontend API URL to point to your deployed backend URL.

## Project Structure

```
profile-wizard-form-builder/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProfileWizard/
│   │   │   │   ├── ProfilePicture.tsx
│   │   │   │   ├── PersonalInfoForm.tsx
│   │   │   │   ├── ProfessionalDetailsForm.tsx
│   │   │   │   ├── PreferencesForm.tsx
│   │   │   │   ├── SummaryPage.tsx
│   │   │   │   ├── CompletionPage.tsx
│   │   │   │   └── ProfileWizard.tsx
│   │   ├── pages/
│   │   │   └── Index.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
├── backend/
│   ├── routes/
│   │   └── userRoutes.js
│   ├── models/
│   │   └── User.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
└── README.md
```

## Full Backend Implementation

For a complete backend implementation, create these files:

### server.js
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### models/User.js
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 4,
    maxlength: 20
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  profilePicture: {
    type: String
  },
  profession: {
    type: String,
    enum: ['Student', 'Developer', 'Entrepreneur'],
    required: true
  },
  companyName: {
    type: String,
    required: function() {
      return this.profession === 'Entrepreneur';
    }
  },
  addressLine1: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  subscriptionPlan: {
    type: String,
    enum: ['Basic', 'Pro', 'Enterprise'],
    required: true
  },
  newsletter: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
```

### routes/userRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only jpeg, jpg and png files
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG images are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max file size
  },
  fileFilter: fileFilter
});

// Check if username exists
router.post('/check-username', async (req, res) => {
  try {
    const { username } = req.body;
    const existingUser = await User.findOne({ username });
    
    res.json({ isAvailable: !existingUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register user
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const { 
      username, 
      password, 
      profession, 
      companyName,
      addressLine1,
      country,
      state, 
      city,
      subscriptionPlan,
      newsletter
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one special character' });
    }
    
    if (!/\d/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one number' });
    }

    // Create new user
    const user = new User({
      username,
      password,
      profession,
      companyName,
      addressLine1,
      country,
      state,
      city,
      subscriptionPlan,
      newsletter: newsletter === 'true'
    });

    // Add profile picture if uploaded
    if (req.file) {
      user.profilePicture = req.file.path;
    }

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile/:id', upload.single('profilePicture'), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      username, 
      currentPassword, 
      newPassword, 
      profession, 
      companyName,
      addressLine1,
      country,
      state, 
      city,
      subscriptionPlan,
      newsletter
    } = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      user.username = username;
    }

    // Update password if provided
    if (newPassword) {
      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Validate new password
      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }
      
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        return res.status(400).json({ message: 'Password must contain at least one special character' });
      }
      
      if (!/\d/.test(newPassword)) {
        return res.status(400).json({ message: 'Password must contain at least one number' });
      }

      user.password = newPassword;
    }

    // Update other fields
    if (profession) user.profession = profession;
    if (companyName || companyName === '') user.companyName = companyName;
    if (addressLine1) user.addressLine1 = addressLine1;
    if (country) user.country = country;
    if (state) user.state = state;
    if (city) user.city = city;
    if (subscriptionPlan) user.subscriptionPlan = subscriptionPlan;
    if (newsletter !== undefined) user.newsletter = newsletter === 'true';

    // Update profile picture if uploaded
    if (req.file) {
      // Delete old profile picture if exists
      if (user.profilePicture) {
        try {
          fs.unlinkSync(user.profilePicture);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      user.profilePicture = req.file.path;
    }

    // Save updated user
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

## License
MIT
