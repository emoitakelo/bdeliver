import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [resRestaurants, resLocations] = await Promise.all([
          axios.get('/api/restaurants?featured=true'),
          axios.get('/api/restaurants/locations')
        ]);
        setRestaurants(resRestaurants.data.length ? resRestaurants.data : await axios.get('/api/restaurants').then(r => r.data));
        setLocations(resLocations.data);
        if (resLocations.data.length > 0) setSelectedLocation(resLocations.data[0]);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keyword.length > 1) {
        try {
          const res = await axios.get(`/api/restaurants?location=${selectedLocation}&keyword=${keyword}`);
          setSuggestions(res.data);
        } catch (error) {
          console.error('Error fetching suggestions', error);
        }
      } else {
        setSuggestions([]);
      }
    };
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [keyword, selectedLocation]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?location=${selectedLocation}&keyword=${keyword}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-[60vh] min-h-[400px] flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="relative z-10 w-full max-w-4xl px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight flex items-center justify-center">
            <span className="text-red-500 mr-2">B</span>Deliver
          </h1>
          <p className="text-2xl md:text-4xl text-white mb-10 font-light">Discover the best food & drinks in your area</p>
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row bg-white rounded-lg p-2 shadow-2xl relative">
            
            {/* Location Dropdown */}
            <div className="flex items-center md:w-1/3 border-b md:border-b-0 md:border-r border-gray-300 p-2">
              <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700 text-lg cursor-pointer"
              >
                <option value="">Select Location</option>
                {locations.map((loc, idx) => (
                  <option key={idx} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            {/* Search Input */}
            <div className="flex-1 flex items-center p-2 relative">
              <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                placeholder="Search for restaurant, cuisine or a dish" 
                className="w-full bg-transparent focus:outline-none text-gray-700 text-lg"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              
              {/* Suggestion Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-80 overflow-y-auto z-50">
                  {suggestions.map(restaurant => (
                    <div 
                      key={restaurant._id}
                      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                    >
                      <img src={restaurant.image} alt={restaurant.name} className="w-12 h-12 rounded object-cover mr-4" />
                      <div>
                        <h4 className="font-bold text-gray-800">{restaurant.name}</h4>
                        <p className="text-sm text-gray-500">{restaurant.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Featured Section */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Popular & Featured</h2>
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
