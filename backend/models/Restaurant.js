const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    default: 'Downtown'
  },
  cuisines: [{
    type: String
  }],
  cuisine: {
    type: String,
    required: false
  },
  costForTwo: {
    type: Number,
    required: true,
    default: 50
  },
  imageGallery: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
