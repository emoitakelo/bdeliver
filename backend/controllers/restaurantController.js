const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// @desc    Fetch all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  try {
    const { location, cuisines, minRating, maxCost, keyword } = req.query;
    
    let query = {};
    
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { cuisines: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    if (location) {
      query.location = location;
    }
    
    if (cuisines) {
      const cuisinesArray = cuisines.split(',');
      query.cuisines = { $in: cuisinesArray };
    }
    
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }
    
    if (maxCost) {
      query.costForTwo = { $lte: Number(maxCost) };
    }

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get menu items for a restaurant
// @route   GET /api/restaurants/:id/menu
// @access  Public
const getRestaurantMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurant: req.params.id });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unique locations
// @route   GET /api/restaurants/locations
// @access  Public
const getLocations = async (req, res) => {
  try {
    const locations = await Restaurant.distinct('location');
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  getLocations,
};
