import mongoose, { Document } from "mongoose";
import { AddressSchema } from "./defaults";
import { User } from "../types/types";


const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addresses: { type: [AddressSchema], required: true },
    role: { type: String, required: true }
});

export interface UserDocument extends User, Document {}
export const UserModel = mongoose.model<UserDocument>('Client', UserSchema);