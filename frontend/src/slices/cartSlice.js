import { createSlice } from '@reduxjs/toolkit';

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
const itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
const deliveryPrice = addDecimals(itemsPrice > 50 || itemsPrice == 0 ? 0 : 5);
const totalPrice = (Number(itemsPrice) + Number(taxPrice) + Number(deliveryPrice)).toFixed(2);

const initialState = {
  cartItems,
  shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
  paymentMethod: 'PayPal',
  itemsPrice,
  taxPrice,
  deliveryPrice,
  totalPrice
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      );
      state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
      state.deliveryPrice = addDecimals(state.itemsPrice > 50 ? 0 : 5);
      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.taxPrice) +
        Number(state.deliveryPrice)
      ).toFixed(2);

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      );
      state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
      state.deliveryPrice = addDecimals(state.itemsPrice > 50 ? 0 : 5);
      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.taxPrice) +
        Number(state.deliveryPrice)
      ).toFixed(2);

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  },
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems } = cartSlice.actions;

export default cartSlice.reducer;
