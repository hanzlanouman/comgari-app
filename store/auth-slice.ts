/* eslint-disable prettier/prettier */
import { TUSER } from "@/repositories/auth/user";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthSlice {
  isAuthenticated: boolean;
  token: string | null;
  user: TUSER | null;
}

export interface LoginPayload {
  access_token: string;
  user: TUSER;
}

interface SetTokenPayload {
  access_token: string;
}

const initialState: AuthSlice = {
  isAuthenticated: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      state.isAuthenticated = true;
      state.token = action.payload.access_token;
      state.user = action.payload.user;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
    setToken(state, action: PayloadAction<SetTokenPayload>) {
      state.token = action.payload.access_token;
    },
    updateUserData(state, action: PayloadAction<TUSER>) {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setToken, updateUserData } = authSlice.actions;

export default authSlice;
