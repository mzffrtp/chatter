import mongoose, { Schema } from "mongoose";

const roomSchema = new mongoose.Schema({
    userId: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, "UserId cannot be blank"]
    },
    name: {
        type: String,
        required: [true, "Room name cannot be blank"],
        //unique: [true, "Room name should be uniq!"],
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },
    maxClient: {
        type: Number,
        default: 0
    },
    peers: {
        type: [Schema.ObjectId],
        ref: "User",
        default: []

    }

})

export const Room = mongoose.model("Room", roomSchema)
