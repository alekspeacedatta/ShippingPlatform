import mongoose, { Document, Schema } from "mongoose";
import { AddressSchema } from "./defaults";
import { User } from "../types/types";


const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: false },
    addresses: { type: [AddressSchema], required: true },
    role: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", default: null },
});

export interface UserDocument extends User, Document {}
export const UserModel = mongoose.model<UserDocument>('Client', UserSchema);