import mongoose from "mongoose";

export const MessageSchema = new mongoose.Schema({
    id: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true  }
})
export const MessageModel = mongoose.model('messages', MessageSchema);