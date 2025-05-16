
const Country = require('../models/Location');

// Get all countries
exports.getCountries = async (req, res) => {
  try {
    const countries = await Country.find({}, 'name');
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get states by country
exports.getStatesByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;
    const country = await Country.findById(countryId, 'states.name');
    
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    
    res.json(country.states);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cities by state
exports.getCitiesByState = async (req, res) => {
  try {
    const { countryId, stateId } = req.params;
    const country = await Country.findById(countryId);
    
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    
    const state = country.states.id(stateId);
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }
    
    res.json(state.cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed location data
exports.seedLocations = async (req, res) => {
  try {
    // Check if data already exists
    const count = await Country.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Location data already exists' });
    }

    // Sample data for demonstration
    const sampleData = [
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

    await Country.insertMany(sampleData);
    res.status(201).json({ message: 'Location data seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
