import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";
import {
  type CartItemType,
  type InitialCartStateType,
  type ShippingAddresType,
} from "../../../shared/interface";

const initialState: InitialCartStateType = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart") as string)
  : {
      cartItems: [],
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0,
      shippingAddress: {
        address: "",
        city: "",
        postalCode: "",
        country: "",
      },
      paymentMethod: "",
    };
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      //check if item already exist in the cart
      const existItem = state.cartItems.find(
        (x: CartItemType) => item._id === x._id
      );
      if (existItem) {
        state.cartItems = state.cartItems.map((x: any) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      updateCart(state);
    },
    deleteFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item._id !== id);
      updateCart(state);
    },
    saveShippingAddres: (state, action) => {
      state.shippingAddress = action.payload as ShippingAddresType;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      updateCart(state);
    },
  },
});
export const {
  addToCart,
  deleteFromCart,
  saveShippingAddres,
  savePaymentMethod,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
