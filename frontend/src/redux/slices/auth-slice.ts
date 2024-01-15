import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { chatHttpApi } from "../../utils/api";
import { AsyncStatus } from "./utils";

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
  "auth.login",
  async (data: AuthLoginDataType, thunkAPI) => {
    const api = chatHttpApi();
    const response = await api.post("/auth/login", data);
    console.log("🚀 login action ~ data:-->", data);

    return response.data;
    console.log("here");
  }
);

export const logoutAction = createAsyncThunk(
  "user.logout",
  async (data: undefined, thunkAPI) => {
    try {
      const api = chatHttpApi();
      const response = await api.post("/user/logout", data);
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }
);

export const getUserMeInfoAction = createAsyncThunk(
  "user.me",
  async (thunkAPI) => {
    try {
      const api = chatHttpApi();
      const response = await api.get("/user/me");
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
      console.log("🚀 ~ builder.addCase ~ action:", action.payload);

      if (action.payload.status === "error") {
        state.errorMessage = action.payload.errorMessage;
        state.requestStatus = "fulfilled";
        return;
      }

      const receivedToken = action.payload.data.token;
      localStorage.setItem("token", receivedToken);

      state.token = receivedToken;
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
      state.errorMessage = null;

      //
    });
    //! get user info action
    builder.addCase(getUserMeInfoAction.pending, (state, action) => {
      state.requestStatus = "pending";
      state.errorMessage = null;
    });
    builder.addCase(getUserMeInfoAction.rejected, (state, action) => {
      state.requestStatus = "rejected";
      state.token = null;
      state.user = null;
      state.errorMessage = null;
    });
    builder.addCase(getUserMeInfoAction.fulfilled, (state, action) => {
      if (action.payload.status === "success") {
        state.user = action.payload.data.user;
      } else {
        localStorage.removeItem("token");
        state.token = null;
        state.user = null;
        state.errorMessage = action.payload.errorMessage;
      }
      state.requestStatus = "fulfilled";
    });
    //! logout action
    builder.addCase(logoutAction.pending, (state, action) => {
      (state.requestStatus = "pending"), (state.errorMessage = null);
    });
    builder.addCase(logoutAction.rejected, (state, action) => {
      (state.requestStatus = "rejected"), (state.errorMessage = null);
    });
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      if (action.payload.status === "success") {
        state.user = action.payload.data.user;
      } else {
        localStorage.removeItem("token");
        state.token = null;
        state.user = null;
        state.errorMessage = action.payload.errorMessage;
      }

      state.requestStatus = "fulfilled";
    });
  },
});

export const {} = authSlice.actions;
export default authSlice.reducer;
