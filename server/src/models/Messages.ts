import mongoose from "mongoose";

export const MessageSchema = new mongoose.Schema({
    companyId: { type: String, required: true },
    userId: { type: String, required: false },
    message: { type: String, required: true },
    date: { type: Date, required: true  }
})
export const MessageModel = mongoose.model('messages', MessageSchema);