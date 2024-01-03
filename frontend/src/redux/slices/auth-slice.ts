import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { chatHttpApi } from "../../utils/api";

export type AsyncStatus = "idle" | "pending" | "fulfilled" | "rejected";

export type UserType = {
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
  gender: string;
};
export type AuthRegisterDataType = {
  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  gender: "male" | "female" | "prefer not to say";
};
export const registerAction = createAsyncThunk(
  "auth/register",
  async (data: AuthRegisterDataType, thunkAPI) => {
    try {
      const api = chatHttpApi();
      const response = await api.post("/auth/register", data);
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }
);
export type AuthLoginDataType = {
  username: string;
  password: string;
};

export interface AuthStateType {
  token: string | null;
}

export const loginAction = createAsyncThunk(
  "auth/login",
  async (data: AuthLoginDataType, thunkAPI) => {
    try {
      const api = chatHttpApi();
      const response = await api.post("/auth/login", data);
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }
);

export interface AuthStateType {
  token: string | null;
  requestStatus: AsyncStatus;
  user: UserType | null;
  errorMessage: string | null;
}

const initialState: AuthStateType = {
  token: localStorage.getItem("token"),
  requestStatus: "idle",
  user: null,
  errorMessage: null,
};

export const authSlice = createSlice({
  initialState,
  name: "authSlice",
  reducers: {},
  extraReducers: (builder) => {
    //! login action
    builder.addCase(loginAction.pending, (state, action) => {
      state.token = null;
      state.requestStatus = "pending";
      state.errorMessage = null;
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.token = null;
      state.requestStatus = "rejected";
      state.errorMessage = null;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      console.log(
        ">> 🚀 file: index.tsx:69 🚀 action.payload.data",
        action.payload.data.data
      );
      localStorage.setItem("token", action.payload.data.data);
      state.token = action.payload.data.data;
      state.user = action.payload.data.user;
      state.requestStatus = "fulfilled";
      state.errorMessage = null;
    });
    //! register action
    builder.addCase(registerAction.pending, (state, action) => {
      state.token = null;
      state.requestStatus = "pending";
      state.errorMessage = null;
    });
    builder.addCase(registerAction.rejected, (state, action) => {
      state.token = null;
      state.requestStatus = "rejected";
      state.errorMessage = null;
    });
    builder.addCase(registerAction.fulfilled, (state, action) => {
      //
    });
  },
});

export const {} = authSlice.actions;
export default authSlice.reducer;
