import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncStatus } from "./utils";
import { chatHttpApi } from "../../utils/api";

export type RoomType = {
  _id: string;
  userId: string;
  name: string;
  visibility: "public" | "private";
  maxClient: number;
  peers?: string[];
};

export type CreateRoomDataType = {
  name: string;
  visibility: "public" | "private";
  maxClient: number;
};

//TODO is createRoomAsyncAction needed?
export const createRoomAsyncAction = createAsyncThunk(
  "room.create",
  async (data: CreateRoomDataType, thunkApi) => {
    const api = chatHttpApi();
    const response = await api.post("/room/createRoom", data);

    return response.data;
  }
);

export const getLastRoomsAction = createAsyncThunk(
  "room.getLastRoom",
  async (data: undefined, thunkApi) => {
    const api = chatHttpApi();
    const response = await api.get("/public/room/lastRooms");

    return response.data;
  }
);

export interface RoomStateType {
  lastRooms: RoomType[];
  lastRoomInitialized: boolean;

  userRooms: RoomType[];
  userRoomsInitializied: boolean;

  requestStatus: AsyncStatus;
  errorMessage: string | null;
}

const initialState: RoomStateType = {
  lastRooms: [],
  lastRoomInitialized: false,

  userRooms: [],
  userRoomsInitializied: false,

  requestStatus: "idle",
  errorMessage: null,
};
export const roomSlice = createSlice({
  initialState,
  name: "roomState",
  reducers: {
    createRoom(state, action: PayloadAction<RoomType>) {
      console.log(">> 🚀 file: roomSlice.ts:76 🚀 action:", action);
      console.log(">> 🚀 file: roomSlice.ts:76 🚀 state:", state);
    },
  },
  extraReducers: (builder) => {
    //! create room action
    builder.addCase(createRoomAsyncAction.pending, (state, action) => {
      (state.requestStatus = "pending"), (state.errorMessage = null);
    });
    builder.addCase(createRoomAsyncAction.rejected, (state, action) => {
      (state.requestStatus = "rejected"), (state.errorMessage = null);
    });
    builder.addCase(createRoomAsyncAction.fulfilled, (state, action) => {
      console.log(">> 🚀 file: authSlice.ts:56 🚀 action:", action.payload);
      if (action.payload.status === "error") {
        state.errorMessage = action.payload.errorMessage.details[0].message;
        console.log(
          ">> 🚀 file: authSlice.ts:58 🚀 state.errorMessage:",
          state.errorMessage
        );
        state.requestStatus = "fulfilled";
        return;
      }
      state.errorMessage = null;
      state.requestStatus = "fulfilled";
    });
    //! last room list action
    builder.addCase(getLastRoomsAction.fulfilled, (state, action) => {
      state.lastRooms = action.payload.data.lastRooms;
      state.lastRoomInitialized = true;
    });

    //! user room list action
  },
});

export const { createRoom } = roomSlice.actions;
export default roomSlice.reducer;
