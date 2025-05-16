
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Country = require('../models/Location');

// Load environment variables
dotenv.config();

// Sample location data
const locationData = [
  {
    name: 'United States',
    states: [
      {
        name: 'California',
        cities: [
          { name: 'Los Angeles' },
          { name: 'San Francisco' },
          { name: 'San Diego' }
        ]
      },
      {
        name: 'New York',
        cities: [
          { name: 'New York City' },
          { name: 'Buffalo' },
          { name: 'Albany' }
        ]
      },
      {
        name: 'Texas',
        cities: [
          { name: 'Houston' },
          { name: 'Austin' },
          { name: 'Dallas' }
        ]
      }
    ]
  },
  {
    name: 'Canada',
    states: [
      {
        name: 'Ontario',
        cities: [
          { name: 'Toronto' },
          { name: 'Ottawa' },
          { name: 'Hamilton' }
        ]
      },
      {
        name: 'Quebec',
        cities: [
          { name: 'Montreal' },
          { name: 'Quebec City' },
          { name: 'Laval' }
        ]
      },
      {
        name: 'British Columbia',
        cities: [
          { name: 'Vancouver' },
          { name: 'Victoria' },
          { name: 'Surrey' }
        ]
      }
    ]
  },
  {
    name: 'India',
    states: [
      {
        name: 'Maharashtra',
        cities: [
          { name: 'Mumbai' },
          { name: 'Pune' },
          { name: 'Nagpur' }
        ]
      },
      {
        name: 'Karnataka',
        cities: [
          { name: 'Bangalore' },
          { name: 'Mysore' },
          { name: 'Hubli' }
        ]
      },
      {
        name: 'Tamil Nadu',
        cities: [
          { name: 'Chennai' },
          { name: 'Coimbatore' },
          { name: 'Madurai' }
        ]
      }
    ]
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/profile-wizard')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if data already exists
      const count = await Country.countDocuments();
      if (count > 0) {
        console.log('Location data already exists. Skipping seed.');
      } else {
        // Insert data
        await Country.insertMany(locationData);
        console.log('Location data seeded successfully');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {
      // Close connection
      mongoose.disconnect();
      console.log('MongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
