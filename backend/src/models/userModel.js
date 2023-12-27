import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a user name!"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"]
    },
    email: {
        type: String,
        required: [true, "Please provide an e-mail!"]

    },
    gender: {
        type: String,
        enum: ["male", "female", "prefer not to say"],
        default: "prefer not to say"

    }
})

export default mongoose.model("User", userSchema)
