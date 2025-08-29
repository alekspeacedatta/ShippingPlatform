import mongoose from "mongoose";
import { CompanyPricing, Address } from "../types/types";

export const CompanyPricingSchema = new mongoose.Schema<CompanyPricing>({
    basePrice: { type: Number, required: true, min: 0 },
    pricePerKg: { type: Number, required: true, min: 0 },
    fuelPct: { type: Number, required: true, min: 0 },
    insurancePct: { type: Number, required: true, min: 0 },
    typeMultipliers: { 
        SEA: { type: Number, default: 1, min: 0},
        RAILWAY: { type: Number, default: 1, min: 0},
        ROAD: { type: Number, default: 1, min: 0},
        AIR: { type: Number, default: 1, min: 0},
    },
    remoteAreaPct: { type: Number, required: true, min: 0 },
});
export const AddressSchema = new mongoose.Schema<Address>({
    country: { type: String, required: true },
    city: { type: String, required: true },
    line1: { type: String, required: true },
    postalCode: { type: String, required: true },
})