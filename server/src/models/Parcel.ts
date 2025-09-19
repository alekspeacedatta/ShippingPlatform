import mongoose, { Document } from 'mongoose'
import { type ParcelRequest } from '../types/types'
import { REQUEST_STATUS } from '../types/types'
import { LocationSchema, AddressSchema } from './defaults'
export const ParcelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  companyId: { type: String },
  shippingType: { type: String, enum: ['SEA', 'ROAD', 'RAILWAY', 'AIR'], required: true },
  parcel: {
    weightKg: { type: Number, required: true },
    lengthCm: { type: Number, required: true },
    widthCm: { type: Number, required: true },
    heightCm: { type: Number, required: true },
    kind: { type: String, required: true },
    fragile: { type: Boolean, required: false },
    declaredValue: { type: Number, required: true },
  },
  route: {
    origin: LocationSchema,
    destination: LocationSchema,
    pickupAddress: AddressSchema,
    deliveryAddress: AddressSchema,
  },
  priceEstimate: { type: Number, required: true },
  status: {
    type: String,
    enum: REQUEST_STATUS,
    required: true,
    default: 'PENDING_REVIEW',
  },
  timeline: [
    {
      status: { type: String, enum: REQUEST_STATUS, required: true },
      at: { type: Date, default: Date.now, required: true },
      note: { type: String },
    },
  ],
  trackingId: { type: String },
  messages: {
    type: [
      {
        from: { type: String, required: true },
        text: { type: String, required: true },
        at: { type: Date, required: true, default: Date.now },
      },
    ],
    default: [],
  },
})
export interface ParcelDocument extends ParcelRequest, Document {}

export const ParcelModel = mongoose.model<ParcelDocument>('Parcel', ParcelSchema)
