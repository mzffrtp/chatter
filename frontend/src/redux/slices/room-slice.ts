import { createRoomAsyncAction } from "./room-slice";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncStatus } from "./utils";
import { chatHttpApi } from "../../utils/api";

export type RoomType = {
  _id: string;
  userId: string;
  name: string;
  visibility: "public" | "private";
  maxClient: number;
  peers: string[];
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
    const response = await api.post("/room/create", data);

    return response.data;
  }
);
export interface RoomStateType {
  requestStatus: AsyncStatus;
  errorMessage: string | null;
}
const initialState: RoomStateType = {
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
    builder.addCase(createRoomAsyncAction.pending, (state, action) => {
      (state.requestStatus = "pending"), (state.errorMessage = null);
    });
    builder.addCase(createRoomAsyncAction.rejected, (state, action) => {
      (state.requestStatus = "rejected"), (state.errorMessage = null);
    });
    builder.addCase(createRoomAsyncAction.fulfilled, (state, action) => {
      console.log(">> 🚀 file: authSlice.ts:56 🚀 action:", action.payload);
      if (action.payload.status === "error") {
        state.errorMessage = action.payload.errorMessage;
        state.requestStatus = "fulfilled";
        return;
      }

      state.errorMessage = null;
      state.requestStatus = "fulfilled";
    });
  },
});

export const { createRoom } = roomSlice.actions;
export default roomSlice.reducer;
