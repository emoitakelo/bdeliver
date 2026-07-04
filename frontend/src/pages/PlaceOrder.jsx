import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCartItems, saveShippingAddress, savePaymentMethod } from '../slices/cartSlice';
import axios from 'axios';
import { usePaystackPayment } from 'react-paystack';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);

  const [address, setAddress] = useState(cart.shippingAddress.address || '');
  const [city, setCity] = useState(cart.shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(cart.shippingAddress.postalCode || '');
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!auth.userInfo) {
      navigate('/login?redirect=/placeorder');
    }
  }, [auth.userInfo, navigate]);

  // Paystack Configuration
  const exchangeRate = 128.90; // Accurate live exchange rate: 1 USD = ~128.90 KES
  const amountInKes = cart.totalPrice * exchangeRate;

  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: auth.userInfo?.email || 'test@example.com',
    amount: Math.round(amountInKes * 100), // Convert to KES sub-units
    currency: 'KES', // Must be KES as per merchant account settings
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_replace_me',
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode) {
      alert('Please fill in your billing & shipping details first.');
      return;
    }

    setIsProcessing(true);
    dispatch(saveShippingAddress({ address, city, postalCode }));
    dispatch(savePaymentMethod('Paystack'));

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const orderData = {
        orderItems: cart.cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image || 'default.jpg', // fallback in case image is missing
          price: item.price,
          menuItem: item._id, // Map _id to menuItem to satisfy mongoose ref
        })),
        deliveryAddress: { address, city, postalCode },
        paymentMethod: 'Paystack',
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        deliveryPrice: cart.deliveryPrice,
        totalPrice: cart.totalPrice,
      };

      // 1. Create the order in our database
      const { data: createdOrder } = await axios.post('/api/orders', orderData, config);
      
      // 2. Launch Paystack payment window
      initializePayment({
        onSuccess: async (reference) => {
          try {
            // 3. On success, update order status to Paid
            await axios.put(
              `/api/orders/${createdOrder._id}/pay`,
              {
                id: reference.reference,
                status: reference.status,
                update_time: new Date().toISOString(),
                email_address: auth.userInfo.email,
              },
              config
            );
            dispatch(clearCartItems());
            navigate('/profile');
          } catch (error) {
            console.error('Error updating order to paid:', error);
            alert('Payment received but order update failed. Please contact support.');
          }
        },
        onClose: () => {
          // Payment window closed prematurely
          dispatch(clearCartItems());
          alert('Payment cancelled. Order has been saved as unpaid.');
          navigate('/profile');
        }
      });
    } catch (error) {
      console.error(error);
      alert('Failed to place order.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Secure Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Billing & Shipping Details
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Street Address</label>
                  <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 font-medium mb-2">City</label>
                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 font-medium mb-2">Postal Code</label>
                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                Your Order
              </h2>
              {cart.cartItems.length === 0 ? (
                <p>Your cart is empty <Link to="/" className="text-red-500 font-bold ml-2">Go back to menu</Link></p>
              ) : (
                <div className="space-y-4">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${item.isVegetarian ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <Link to={`/restaurant/${item.restaurant}`} className="text-lg font-semibold text-gray-800 hover:text-red-500 transition-colors">
                          {item.name}
                        </Link>
                      </div>
                      <div className="text-gray-700 font-medium">
                        {item.qty} × ${item.price} = <span className="font-bold">${(item.qty * item.price).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.cartItems.reduce((a, c) => a + c.qty, 0)} items)</span>
                  <span className="font-semibold text-gray-900">${cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span className="font-semibold text-gray-900">${cart.taxPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600 border-b border-dashed border-gray-200 pb-4">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-green-600">{cart.deliveryPrice > 0 ? `$${cart.deliveryPrice}` : 'FREE'}</span>
                </div>
                <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-2">
                  <span>Grand Total</span>
                  <span className="text-red-600">${cart.totalPrice}</span>
                </div>
              </div>

              <button 
                type="button"
                className="w-full bg-red-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-red-600 transition-all shadow-md transform hover:scale-[1.02] flex justify-center items-center"
                disabled={cart.cartItems.length === 0 || isProcessing}
                onClick={placeOrderHandler}
              >
                {isProcessing ? 'Processing...' : 'Pay with Paystack'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
