import mongoose, { Document } from "mongoose";
import { User, Address } from "../types/types";

const AddressSchema = new mongoose.Schema<Address>({
    country: { type: String, required: true },
    city: { type: String, required: true },
    line1: { type: String, required: true },
    postalCode: { type: String, required: true },
})
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
// ტიპების დაცვა