/* eslint-disable prettier/prettier */
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authSlice from "./auth-slice";
import appSlice from "./app-slice";

const appReducer = combineReducers({
  auth: authSlice.reducer,
  app: appSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["app"],
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
