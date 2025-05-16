
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const locationController = require('../controllers/locationController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// User routes
router.post('/register', upload.single('profilePicture'), userController.register);
router.post('/check-username', userController.checkUsername);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, upload.single('profilePicture'), userController.updateProfile);

// Location routes
router.get('/locations/countries', locationController.getCountries);
router.get('/locations/countries/:countryId/states', locationController.getStatesByCountry);
router.get('/locations/countries/:countryId/states/:stateId/cities', locationController.getCitiesByState);
router.post('/locations/seed', locationController.seedLocations);

module.exports = router;
