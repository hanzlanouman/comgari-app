/* eslint-disable prettier/prettier */
import { createSlice } from "@reduxjs/toolkit";

type AppSlice = {
  isloading: boolean;
  loadingArray: string[];
  isOnline: boolean;
  notificationTokenSent: boolean;
};

const initialState: AppSlice = {
  isloading: false,
  loadingArray: [],
  isOnline: true,
  notificationTokenSent: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isloading = true;
      state.loadingArray = [...state.loadingArray, action.payload];
    },
    stopLoading(state, action) {
      const filetered = state.loadingArray.filter(
        (item) => item !== action.payload
      );
      state.loadingArray = filetered;
      if (state.loadingArray.length === 0) {
        state.isloading = false;
      }
    },
    setOnline(state, action) {
      state.isOnline = action.payload;
    },
    setNotificationTokenSent(state, action) {
      state.notificationTokenSent = action.payload;
    },
  },
});

export const { setLoading, stopLoading, setOnline, setNotificationTokenSent } =
  appSlice.actions;

export default appSlice;
