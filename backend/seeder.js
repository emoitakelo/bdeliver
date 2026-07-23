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
        name: 'Nyama Mama',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        address: 'Delta Towers, Westlands',
        location: 'Westlands',
        cuisines: ['Kenyan', 'African'],
        costForTwo: 3000,
        rating: 4.6,
        numReviews: 245,
        featured: true,
        imageGallery: [
          'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544025162-831627473070?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        user: adminUser._id,
        name: 'Kosewe Ranalo Foods',
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        address: 'Kimathi Street, CBD',
        location: 'Nairobi CBD',
        cuisines: ['Traditional', 'Kenyan'],
        costForTwo: 1500,
        rating: 4.3,
        numReviews: 180,
        featured: false,
        imageGallery: [
          'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        user: adminUser._id,
        name: 'Artcaffe Coffee & Bakery',
        image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80',
        address: 'Yaya Centre, Kilimani',
        location: 'Kilimani',
        cuisines: ['Cafe', 'Bakery', 'Continental'],
        costForTwo: 2000,
        rating: 4.7,
        numReviews: 410,
        featured: true,
        imageGallery: [
          'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ];

    const createdRestaurants = await Restaurant.insertMany(restaurants);

    // 3. Mock Menu Items
    const menuItems = [
      // For Nyama Mama
      {
        restaurant: createdRestaurants[0]._id,
        name: 'Nyama Choma Platter',
        description: 'Assorted grilled meats served with kachumbari',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1544025162-831627473070?auto=format&fit=crop&w=800&q=80',
        category: 'Mains',
        isVegetarian: false
      },
      {
        restaurant: createdRestaurants[0]._id,
        name: 'Ugali & Sukuma Wiki',
        description: 'Staple maize meal served with collard greens',
        price: 400,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        category: 'Sides',
        isVegetarian: true
      },
      // For Kosewe Ranalo Foods
      {
        restaurant: createdRestaurants[1]._id,
        name: 'Whole Tilapia Fish',
        description: 'Deep fried or wet fry tilapia from Lake Victoria',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80',
        category: 'Mains',
        isVegetarian: false
      },
      {
        restaurant: createdRestaurants[1]._id,
        name: 'Matoke & Beef Stew',
        description: 'Plantain stewed with tender beef chunks',
        price: 850,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
        category: 'Mains',
        isVegetarian: false
      },
      // For Artcaffe
      {
        restaurant: createdRestaurants[2]._id,
        name: 'Almond Croissant',
        description: 'Freshly baked flaky pastry with almond filling',
        price: 350,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        category: 'Bakery',
        isVegetarian: true
      },
      {
        restaurant: createdRestaurants[2]._id,
        name: 'Kenyan House Blend Coffee',
        description: 'Rich, aromatic medium roast coffee',
        price: 300,
        image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80',
        category: 'Beverages',
        isVegetarian: true
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
