import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    userId: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, "UserID cannot be blank"]
    },
    name: {
        type: String,
        required: true
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },
    maxClient: {
        type: Number,
        default: 0
    }

})

export default mongoose.model("Room", roomSchema)
