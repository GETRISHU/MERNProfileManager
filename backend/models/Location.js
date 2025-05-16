
const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const StateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cities: [CitySchema]
});

const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  states: [StateSchema]
});

const Country = mongoose.model('Country', CountrySchema);
module.exports = Country;
