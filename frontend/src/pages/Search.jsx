import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';

const Search = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  
  const initialLocation = queryParams.get('location') || '';
  const initialKeyword = queryParams.get('keyword') || '';
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [locations, setLocations] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [maxCost, setMaxCost] = useState(100);
  
  const AVAILABLE_CUISINES = ['Italian', 'Continental', 'Indian', 'Chinese', 'Fast Food', 'American', 'Japanese', 'Mexican'];

  useEffect(() => {
    // Fetch unique locations
    axios.get('/api/restaurants/locations')
      .then(res => setLocations(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const currentParams = new URLSearchParams(search);
      let apiUrl = `/api/restaurants?`;
      
      const loc = currentParams.get('location');
      const kw = currentParams.get('keyword');
      const c = currentParams.get('cuisines');
      const mr = currentParams.get('minRating');
      const mc = currentParams.get('maxCost');
      
      if (loc) apiUrl += `&location=${loc}`;
      if (kw) apiUrl += `&keyword=${kw}`;
      if (c) apiUrl += `&cuisines=${c}`;
      if (mr) apiUrl += `&minRating=${mr}`;
      if (mc) apiUrl += `&maxCost=${mc}`;
      
      const res = await axios.get(apiUrl);
      setRestaurants(res.data);
    } catch (error) {
      console.error('Error fetching restaurants', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line
  }, [search]);

  const handleFilterChange = () => {
    const params = new URLSearchParams();
    if (selectedLocation) params.set('location', selectedLocation);
    if (initialKeyword) params.set('keyword', initialKeyword);
    if (cuisines.length > 0) params.set('cuisines', cuisines.join(','));
    if (minRating > 0) params.set('minRating', minRating);
    if (maxCost < 100) params.set('maxCost', maxCost);
    
    navigate(`/search?${params.toString()}`);
  };

  const toggleCuisine = (c) => {
    if (cuisines.includes(c)) {
      setCuisines(cuisines.filter(item => item !== c));
    } else {
      setCuisines([...cuisines, c]);
    }
  };

  const clearFilters = () => {
    setSelectedLocation('');
    setCuisines([]);
    setMinRating(0);
    setMaxCost(100);
    navigate(`/search`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Filters */}
        <div className="w-full md:w-1/4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
            <button onClick={clearFilters} className="text-red-500 text-sm font-semibold hover:underline cursor-pointer">Clear All</button>
          </div>
          
          {/* Location Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-lg">Location</h3>
            <select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Cuisines Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-lg">Cuisines</h3>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
              {AVAILABLE_CUISINES.map(c => (
                <label key={c} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={cuisines.includes(c)}
                    onChange={() => toggleCuisine(c)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-gray-600">{c}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Rating Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-lg">Rating</h3>
            <div className="space-y-2">
              {[4.5, 4.0, 3.5, 3.0].map(rating => (
                <label key={rating} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating"
                    checked={minRating === rating}
                    onChange={() => setMinRating(rating)}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-gray-600">{rating}+ Stars</span>
                </label>
              ))}
              <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating"
                    checked={minRating === 0}
                    onChange={() => setMinRating(0)}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-gray-600">Any</span>
                </label>
            </div>
          </div>
          
          {/* Cost Filter */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-700 mb-3 text-lg">Cost for Two</h3>
            <div className="px-2">
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="10"
                value={maxCost}
                onChange={(e) => setMaxCost(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="text-right text-gray-600 font-semibold mt-2">Up to ${maxCost}</div>
            </div>
          </div>
          
          <button 
            onClick={handleFilterChange}
            className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors shadow-md"
          >
            Apply Filters
          </button>
        </div>
        
        {/* Right Side - Results */}
        <div className="w-full md:w-3/4">
          <div className="mb-6 flex justify-between items-end">
            <h1 className="text-3xl font-extrabold text-gray-800">
              {initialKeyword ? `Results for "${initialKeyword}"` : 'Delivery Restaurants'}
            </h1>
            <p className="text-gray-500 font-medium">{restaurants.length} places found</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500"></div></div>
          ) : restaurants.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-32 h-32 mb-6 bg-red-50 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No results found</h3>
              <p className="text-gray-500 mb-6 max-w-md">We couldn't find any restaurants matching your filters. Try removing some filters or searching in a different area.</p>
              <button 
                onClick={clearFilters}
                className="bg-red-100 text-red-600 font-bold px-6 py-3 rounded-lg hover:bg-red-200 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Search;
