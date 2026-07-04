const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Restaurant.deleteMany();
    await MenuItem.deleteMany();

    // 1. Create a dummy admin user to own the restaurants
    let adminUser = await User.findOne({ email: 'admin@zomato.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Zomato Admin',
        email: 'admin@zomato.com',
        password: 'password123',
        isAdmin: true
      });
    }

    // 2. Mock Restaurants
    const restaurants = [
      {
        user: adminUser._id,
        name: 'The Rustic Kitchen',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        address: '123 Downtown St',
        location: 'Downtown',
        cuisines: ['Italian', 'Continental'],
        costForTwo: 60,
        rating: 4.5,
        numReviews: 120,
        featured: true,
        imageGallery: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        user: adminUser._id,
        name: 'Spicy Symphony',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
        address: '456 Uptown Blvd',
        location: 'Uptown',
        cuisines: ['Indian', 'Chinese'],
        costForTwo: 40,
        rating: 4.2,
        numReviews: 85,
        featured: false,
        imageGallery: [
          'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        user: adminUser._id,
        name: 'Burger & Co',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        address: '789 Suburbia Lane',
        location: 'Suburbia',
        cuisines: ['Fast Food', 'American'],
        costForTwo: 25,
        rating: 4.8,
        numReviews: 320,
        featured: true,
        imageGallery: [
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ];

    const createdRestaurants = await Restaurant.insertMany(restaurants);

    // 3. Mock Menu Items
    const menuItems = [
      // For The Rustic Kitchen
      {
        restaurant: createdRestaurants[0]._id,
        name: 'Margherita Pizza',
        description: 'Classic cheese and tomato pizza',
        price: 15,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
        category: 'Mains',
        isVegetarian: true
      },
      {
        restaurant: createdRestaurants[0]._id,
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter',
        price: 6,
        image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=800&q=80',
        category: 'Starters',
        isVegetarian: true
      },
      // For Spicy Symphony
      {
        restaurant: createdRestaurants[1]._id,
        name: 'Chicken Tikka Masala',
        description: 'Creamy and spicy chicken curry',
        price: 18,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
        category: 'Mains',
        isVegetarian: false
      },
      // For Burger & Co
      {
        restaurant: createdRestaurants[2]._id,
        name: 'Classic Cheeseburger',
        description: 'Beef patty, cheese, lettuce, tomato',
        price: 12,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        category: 'Mains',
        isVegetarian: false
      }
    ];

    await MenuItem.insertMany(menuItems);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
