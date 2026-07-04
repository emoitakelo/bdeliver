import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const cuisineText = Array.isArray(restaurant.cuisines) && restaurant.cuisines.length > 0 
    ? restaurant.cuisines.join(', ') 
    : restaurant.cuisine || '';

  return (
    <Link to={`/restaurant/${restaurant._id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
        <div className="h-56 overflow-hidden relative">
          <img 
            src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
            alt={restaurant.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {restaurant.featured && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wide">
              Featured
            </div>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 flex-1 pr-2">{restaurant.name}</h3>
            <span className="bg-green-700 text-white text-sm font-bold px-2 py-1 rounded flex items-center shadow-sm">
              {restaurant.rating} <span className="ml-1 text-[10px]">★</span>
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-600 text-sm line-clamp-1 flex-1 pr-2">{cuisineText}</p>
            <p className="text-gray-600 text-sm font-medium whitespace-nowrap">${restaurant.costForTwo} for two</p>
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span className="line-clamp-1">{restaurant.location || restaurant.address}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
