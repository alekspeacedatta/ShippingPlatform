import mongoose, { Document } from "mongoose";
import { Company } from "../types/types";
import { AddressSchema, CompanyPricingSchema } from "./defaults";

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactEmail: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    hqAddress: { type: AddressSchema, required: true },
    regions: { type: [String], required: true },
    supportedTypes: { type: [String], enum: ["SEA", "ROAD", "RAILWAY", "AIR"], required: true },
    pricing: { type: CompanyPricingSchema, required: true },
    role: { type: String, required: true },
    logoUrl: { type: String, required: false }
})

export interface CompanyDocument extends Company, Document {};

export const ComapnyModel = mongoose.model<CompanyDocument>('Company', CompanySchema)