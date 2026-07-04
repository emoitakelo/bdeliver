import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Payment Method</h1>
      <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="mb-6">
          <span className="block text-gray-700 text-sm font-bold mb-4">Select Method</span>
          <div className="flex items-center mb-4">
            <input
              id="paypal"
              type="radio"
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
              name="paymentMethod"
              value="PayPal"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="paypal" className="ml-2 text-sm font-medium text-gray-900">
              PayPal or Credit Card
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="stripe"
              type="radio"
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
              name="paymentMethod"
              value="Stripe"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="stripe" className="ml-2 text-sm font-medium text-gray-900">
              Stripe
            </label>
          </div>
        </div>
        <button type="submit" className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors">
          Continue to Summary
        </button>
      </form>
    </div>
  );
};

export default Payment;
