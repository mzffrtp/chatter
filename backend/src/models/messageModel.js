import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, "UserID cannot be blank"]
    },
    roomId: {
        type: Schema.ObjectId,
        ref: "Room",
        required: [true, "RoomId cannot be blank"]
    },
    type: {
        type: String,
        enum: ["text", "media"],
        default: "public"
    },
    text: {
        type: String
    },
    mediaUrl: {
        type: String
    }
}, { timestamps: true })

export default mongoose.model("Message", messageSchema)