import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";
import roomReducer from "./slices/room-slice";

export const store = configureStore({
  reducer: {
    authState: authReducer,
    roomState: roomReducer,
  },
});

export const appDispatch = store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
