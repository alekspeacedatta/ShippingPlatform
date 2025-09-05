import mongoose from "mongoose";
const ParcelSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    companyId: { type: String, required: true },
    shippingType: { type: [String], enum: ["SEA", "ROAD", "RAILWAY", "AIR"], required: true },
    parcel: {
        weightKg: { type: Number, required: true },
        lengthCm: { type: Number, required: true },
        widthCm: { type: Number, required: true },
        heightCm: { type: Number, required: true },
        kind: { type: String, required: true },
        fragiale: { type: Boolean, required: false },
    },
    
})