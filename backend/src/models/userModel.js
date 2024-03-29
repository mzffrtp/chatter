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
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    gender: {
        type: String,
        enum: ["male", "female", "prefer not to say"],
        default: "prefer not to say"

    }
}, { timestamps: true })

export const User = mongoose.model("User", userSchema)
