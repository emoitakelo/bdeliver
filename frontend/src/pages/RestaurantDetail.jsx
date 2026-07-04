import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import axios from 'axios';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [restaurant, setRestaurant] = useState({});
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('order'); // 'overview', 'order', 'reviews', 'photos'

  const addToCartHandler = (item) => {
    dispatch(addToCart({ ...item, qty: 1 }));
  };

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const resRest = await axios.get(`/api/restaurants/${id}`);
        setRestaurant(resRest.data);
        const resMenu = await axios.get(`/api/restaurants/${id}/menu`);
        setMenu(resMenu.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantData();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500"></div></div>;

  const cuisinesText = Array.isArray(restaurant.cuisines) ? restaurant.cuisines.join(', ') : restaurant.cuisine;
  
  // Group menu by category
  const menuByCategory = menu.reduce((acc, item) => {
    const cat = item.category || 'Mains';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-white min-h-screen">
      {/* Header Info */}
      <div className="container mx-auto px-4 pt-6 max-w-7xl">
        {/* Breadcrumb */}
        <div className="text-gray-500 text-xs mb-4 hover:text-gray-700 cursor-pointer w-fit" onClick={() => navigate('/')}>
          Home / {restaurant.location} / <span className="text-gray-400">{restaurant.name}</span>
        </div>

        {/* Gallery Preview (Zomato style top images) */}
        <div className="flex gap-2 h-64 md:h-96 mb-6 overflow-hidden rounded-lg">
          <div className="w-2/3 h-full overflow-hidden cursor-pointer" onClick={() => setActiveTab('photos')}>
            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="w-1/3 flex flex-col gap-2 h-full">
            {restaurant.imageGallery && restaurant.imageGallery.slice(0, 2).map((img, idx) => (
              <div key={idx} className="h-1/2 overflow-hidden cursor-pointer relative" onClick={() => setActiveTab('photos')}>
                <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                {idx === 1 && restaurant.imageGallery.length > 2 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-xl">
                    View Gallery
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Restaurant Title & Meta */}
        <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-1">{restaurant.name}</h1>
            <p className="text-lg text-gray-600 mb-1">{cuisinesText}</p>
            <p className="text-gray-500">{restaurant.location || restaurant.address}</p>
          </div>
          <div className="text-right flex gap-6">
            <div className="flex flex-col items-center">
              <span className="bg-green-700 text-white font-bold px-3 py-1 rounded-lg text-lg flex items-center shadow-md">
                {restaurant.rating} <span className="ml-1 text-sm">★</span>
              </span>
              <span className="text-xs text-gray-500 font-semibold mt-1 border-b border-dashed border-gray-400 pb-1">{restaurant.numReviews} Dining Ratings</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8 sticky top-0 bg-white z-10 pt-2">
          {['overview', 'order', 'reviews', 'photos'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xl font-medium capitalize ${activeTab === tab ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-600 hover:text-red-400'}`}
            >
              {tab === 'order' ? 'Order Online' : tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-20">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="w-full md:w-2/3">
              <h3 className="text-2xl font-semibold mb-4">About this place</h3>
              <div className="mb-8 border border-gray-100 rounded-lg p-6 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Average Cost</h4>
                <p className="text-gray-600 text-lg">${restaurant.costForTwo} for two people (approx.)</p>
              </div>
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Cuisines</h4>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(restaurant.cuisines) ? restaurant.cuisines : [restaurant.cuisine]).map(c => (
                    <span key={c} className="px-4 py-2 border border-gray-200 rounded-full text-red-500 font-medium">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ORDER ONLINE TAB */}
          {activeTab === 'order' && (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/4 hidden md:block border-r border-gray-200 pr-4">
                <div className="sticky top-20">
                  {Object.keys(menuByCategory).map(category => (
                    <a key={category} href={`#cat-${category}`} className="block py-3 text-lg font-medium text-gray-600 hover:text-red-500 border-b border-gray-100 border-dashed">
                      {category} ({menuByCategory[category].length})
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="w-full md:w-3/4">
                {Object.keys(menuByCategory).map(category => (
                  <div key={category} id={`cat-${category}`} className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      {category}
                    </h2>
                    <div className="space-y-6">
                      {menuByCategory[category].map(item => (
                        <div key={item._id} className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 pb-6 group">
                          <div className="flex-1 pr-4">
                            <div className="flex items-center mb-1">
                              <div className={`w-4 h-4 flex items-center justify-center border mr-2 rounded-sm ${item.isVegetarian ? 'border-green-600' : 'border-red-600'}`}>
                                <div className={`w-2 h-2 rounded-full ${item.isVegetarian ? 'bg-green-600' : 'bg-red-600'}`}></div>
                              </div>
                              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-500 transition-colors">{item.name}</h3>
                            </div>
                            <p className="font-semibold text-gray-800 mb-2">${item.price.toFixed(2)}</p>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                          </div>
                          <div className="mt-4 sm:mt-0 flex flex-col items-center relative">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-xl shadow-sm mb-3" />
                            )}
                            <button 
                              onClick={() => addToCartHandler(item)}
                              className={`absolute ${item.image ? '-bottom-4' : 'top-0'} bg-white text-red-500 border border-red-300 font-bold px-8 py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-red-50 transition-all z-10`}
                            >
                              ADD
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PHOTOS TAB */}
          {activeTab === 'photos' && (
            <div>
              <h3 className="text-2xl font-semibold mb-6">Gallery</h3>
              {restaurant.imageGallery && restaurant.imageGallery.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {restaurant.imageGallery.map((img, idx) => (
                    <div key={idx} className="h-48 overflow-hidden rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-lg">No photos available for this restaurant.</p>
              )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="text-center py-12 border border-gray-100 rounded-lg bg-gray-50">
              <p className="text-xl text-gray-500">Reviews feature coming soon!</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
