const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Restaurant'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true,
    default: 'Mains'
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
