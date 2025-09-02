export const BASE_URL = 'http://localhost:5000';
export type Role = 'USER' | 'COMPANY_ADMIN';
export type ShippingType = 'SEA' | 'RAILWAY' | 'ROAD' | 'AIR';
export type RequestStatus =
| 'PENDING_REVIEW'
| 'AWAITING_COMPANY_CONFIRMATION'
| 'ACCEPTED'
| 'IN_TRANSIT'
| 'OUT_FOR_DELIVERY'
| 'DELIVERED'
| 'REJECTED';
export interface Address {
    country: string;
    city: string;
    line1: string;
    postalCode: string;
}
export interface User {
    _id: string;
    email: string;
    fullName: string;
    password: string;
    phone?: string;
    companyId?: string | null;
    addresses: Address[];
    role: Role;
}
export interface Company {
    _id: string;
    name: string;
    contactEmail: string;
    password: string;
    phone?: string;
    hqAddress: Address;
    regions: string[]; // ISO2 codes
    supportedTypes: ShippingType[];
    pricing: CompanyPricing;
    role: 'COMPANY_ADMIN';
    logoUrl?: string;
}
export interface CompanyPricing {
    basePrice: number; // base in currency units
    pricePerKg: number;
    fuelPct: number; // 0.10 = 10%
    insurancePct: number; // 0.01 = 1%
    typeMultipliers: Record<ShippingType, number>;
    remoteAreaPct: number;
}
export interface ParcelRequest {
    id: string;
    userId: string;
    companyId?: string; // set after acceptance
    shippingType: ShippingType;
    parcel: { weightKg: number; lengthCm: number; widthCm: number;
    heightCm: number; kind: 'DOCUMENTS'|'GOODS'; declaredValue: number;
    fragile?: boolean; };
    route: { origin: Address; destination: Address; pickupAddress:
    Address; deliveryAddress: Address; };
    priceEstimate: number;
    status: RequestStatus;
    timeline: { status: RequestStatus; at: string; note?: string }[];
    trackingId?: string;
    messages: { from: 'USER'|'COMPANY'; text: string; at: string }[];
}