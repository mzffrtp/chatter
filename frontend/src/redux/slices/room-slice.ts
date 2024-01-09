import { ChatApiResponseType } from "./../../utils/api";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncStatus } from "./utils";
import { chatHttpApi } from "../../utils/api";
import { appDispatch } from "../store";
import { showSwal } from "../../utils/functions";

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

export async function creatRoomService(value: CreateRoomDataType) {
  const response = await chatHttpApi().post<
    ChatApiResponseType<{ room: RoomType }>
  >("/room/createRoom", value);
  console.log("🚀 ~ creatRoomService ~ value:", value);

  if (response.data.status === "success") {
    console.log("🚀 ~ creatRoomService ~ response:", response.data.data.room);

    appDispatch(createRoom(response.data.data.room));
    showSwal("success", "Room created successfully");
    appDispatch(getLastRoomsAction());

    return response.data.data.room;
  } else {
    const swalErrorMessage = response.data.errorMessage.details[0].message;
    showSwal("error", swalErrorMessage);
  }
}

export const createRoomAsyncAction = createAsyncThunk(
  "room.createRoom",
  async (data: CreateRoomDataType, thunkAPI) => {
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
