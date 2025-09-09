export const BASE_URL = 'http://localhost:5000';
export type Role = 'USER' | 'COMPANY_ADMIN';
export type ShippingType = 'SEA' | 'RAILWAY' | 'ROAD' | 'AIR';
export const EuCountries = [
  'austria',
  'belgium',
  'bulgaria',
  'croatia',
  'cyprus',
  'czechia',
  'denmark',
  'estonia',
  'finland',
  'france',
  'germany',
  'greece',
  'georgia',
  'hungary',
  'ireland',
  'italy',
  'latvia',
  'lithuania',
  'luxembourg',
  'malta',
  'netherlands',
  'poland',
  'portugal',
  'romania',
  'slovakia',
  'slovenia',
  'spain',
  'sweden',
];
export const AsiaCountries = [
  'afghanistan',
  'armenia',
  'azerbaijan',
  'bahrain',
  'bangladesh',
  'bhutan',
  'brunei',
  'cambodia',
  'china',
  'cyprus',
  'india',
  'indonesia',
  'iran',
  'iraq',
  'israel',
  'japan',
  'jordan',
  'kazakhstan',
  'kuwait',
  'kyrgyzstan',
  'laos',
  'lebanon',
  'malaysia',
  'maldives',
  'mongolia',
  'myanmar',
  'nepal',
  'north korea',
  'oman',
  'pakistan',
  'palestine',
  'philippines',
  'qatar',
  'saudi arabia',
  'singapore',
  'south korea',
  'sri lanka',
  'syria',
  'tajikistan',
  'thailand',
  'timor-leste',
  'turkey',
  'turkmenistan',
  'united arab emirates',
  'uzbekistan',
  'vietnam',
  'yemen',
];
export interface Pricing {
  basePrice: Number;
  pricePerKg: Number;
  fuelPct: Number;
  insurancePct: Number;
  typeMultipliers: {
    SEA: Number;
    RAILWAY: Number;
    ROAD: Number;
    AIR: Number;
  };
  remoteAreaPct: Number;
}
export const REQUEST_STATUS = [
  'PENDING_REVIEW',
  'AWAITING_COMPANY_CONFIRMATION',
  'ACCEPTED',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'REJECTED',
] as const;

export type RequestStatus = (typeof REQUEST_STATUS)[number];

export const statusColors: Record<RequestStatus, string> = {
  PENDING_REVIEW: 'bg-orange-400',
  AWAITING_COMPANY_CONFIRMATION: 'bg-yellow-400',
  ACCEPTED: 'bg-green-500',
  IN_TRANSIT: 'bg-blue-500',
  OUT_FOR_DELIVERY: 'bg-purple-500',
  DELIVERED: 'bg-teal-500',
  REJECTED: 'bg-red-500',
};
export interface Address {
  country: string;
  city: string;
  line1: string;
  postalCode: string;
}
export interface Location {
  country: string;
  city: string;
}
export interface User {
  _id: string;
  email: string;
  fullName: string;
  password: string;
  phone?: string;
  addresses: Address[];
  role: 'USER';
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
export type CompanyCreate = Omit<Company, 'role'> & { _id?: string };
export interface CompanyPricing {
  basePrice: number; // base in currency units
  pricePerKg: number;
  fuelPct: number; // 0.10 = 10%
  insurancePct: number; // 0.01 = 1%
  typeMultipliers: Record<ShippingType, number>;
  remoteAreaPct: number;
}
export interface ParcelRequest {
  // _id: string;
  userId: string;
  companyId?: string; // set after acceptance
  shippingType: ShippingType;
  parcel: {
    weightKg: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    kind: 'DOCUMENTS' | 'GOODS';
    declaredValue: number;
    fragile?: boolean;
  };
  route: {
    origin: Location;
    destination: Location;
    pickupAddress: Address;
    deliveryAddress: Address;
  };
  priceEstimate: number;
  status: RequestStatus;
  timeline: { status: RequestStatus; at: string; note?: string }[];
  trackingId?: string;
  messages: { from: 'USER' | 'COMPANY'; text: string; at: string }[];
}
