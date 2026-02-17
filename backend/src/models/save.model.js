import mongoose from "mongoose";

const saveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true,
    },
}, { timestamps: true })

export const Save = mongoose.model("Save", saveSchema)