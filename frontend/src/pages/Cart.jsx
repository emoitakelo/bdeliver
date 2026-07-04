import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (item, qty) => {
    dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/placeorder');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          Your cart is empty <Link to="/" className="font-bold underline ml-2">Go Back</Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${item.isVegetarian ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <Link to={`/restaurant/${item.restaurant}`} className="text-lg font-medium text-gray-800 hover:underline">
                    {item.name}
                  </Link>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="font-bold text-gray-800">${item.price}</span>
                  <select 
                    value={item.qty} 
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    className="border rounded p-1"
                  >
                    {[...Array(10).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={() => removeFromCartHandler(item._id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="md:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                <span className="font-medium text-gray-800">${cart.itemsPrice}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-800">${cart.taxPrice}</span>
              </div>
              <div className="flex justify-between mb-4 border-b pb-4">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-gray-800">${cart.deliveryPrice}</span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-lg font-bold text-red-600">${cart.totalPrice}</span>
              </div>
              <button 
                onClick={checkoutHandler}
                className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition-colors"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
