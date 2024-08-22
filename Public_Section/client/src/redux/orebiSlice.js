import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  userInfo: null,
  products: [],
  checkedCategorys: [],
  checkedPriceRanges: [],
  isAuthenticated: -1,
};

export const orebiSlice = createSlice({
  name: "RideRevive",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.products.find(item => item._id === action.payload._id);
      if (existingItem) {
        if (existingItem.quantity + action.payload.quantity <= existingItem.amount) {
          existingItem.quantity += action.payload.quantity;
          toast.success("Product quantity updated in cart");
        } else {
          toast.error("Not enough stock available");
        }
      } else {
        state.products.push(action.payload);
        toast.success("Product added to cart");
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(item => item._id === action.payload._id);
      if (item) {
        if (item.quantity < item.amount) {
          item.quantity++;
          toast.success("Product quantity increased");
        } else {
          toast.error("No enough products in stock");
        }
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.products.find(item => item._id === action.payload._id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
        }
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(item => item._id !== action.payload);
      toast.error("Product removed from cart");
    },
    resetCart: (state) => {
      state.products = [];
    },
    togglePriceRange: (state, action) => {
      const range = action.payload;
      const isRangeChecked = state.checkedPriceRanges.some(r => r._id === range._id);

      if (isRangeChecked) {
        state.checkedPriceRanges = state.checkedPriceRanges.filter(r => r._id !== range._id);
      } else {
        state.checkedPriceRanges.push(range);
      }
    },
    toggleCategory: (state, action) => {
      const category = action.payload;
      const isCategoryChecked = state.checkedCategorys.some(b => b._id === category._id);

      if (isCategoryChecked) {
        state.checkedCategorys = state.checkedCategorys.filter(b => b._id !== category._id);
      } else {
        state.checkedCategorys.push(category);
      }
    },
    signIn: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = action.payload.Customer_ID;
      toast.success(`Welcome ${action.payload.Customer_fullname}`);
    },
    signOut: (state) => {
      state.userInfo = null;
      state.isAuthenticated = -1;
      toast.success("Successfully signed out");
    },
    AccountUpdated: (state) => {
      toast.success("Successfully Account Updated");
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity, 
  deleteItem,
  resetCart,
  togglePriceRange,
  toggleCategory,
  signIn,
  signOut,
  AccountUpdated,
} = orebiSlice.actions;

export default orebiSlice.reducer;
