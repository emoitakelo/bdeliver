const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById, getRestaurantMenu, getLocations } = require('../controllers/restaurantController');

router.route('/').get(getRestaurants);
router.route('/locations').get(getLocations);
router.route('/:id').get(getRestaurantById);
router.route('/:id/menu').get(getRestaurantMenu);

module.exports = router;
