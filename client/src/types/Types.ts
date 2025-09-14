export const BASE_URL = 'http://localhost:5000';
export type Role = 'USER' | 'COMPANY_ADMIN';
export type ShippingType = 'SEA' | 'RAILWAY' | 'ROAD' | 'AIR';
export const EU_COUNTRIES = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
];

export const AFRICA_COUNTRIES = [
  'DZ',
  'AO',
  'BJ',
  'BW',
  'BF',
  'BI',
  'CV',
  'CM',
  'CF',
  'TD',
  'KM',
  'CD',
  'CG',
  'CI',
  'DJ',
  'EG',
  'GQ',
  'ER',
  'ET',
  'GA',
  'GM',
  'GH',
  'GN',
  'GW',
  'KE',
  'LS',
  'LR',
  'LY',
  'MG',
  'MW',
  'ML',
  'MR',
  'MU',
  'MA',
  'MZ',
  'NA',
  'NE',
  'NG',
  'RW',
  'ST',
  'SN',
  'SC',
  'SL',
  'SO',
  'ZA',
  'SS',
  'SD',
  'SZ',
  'TZ',
  'TG',
  'TN',
  'UG',
  'ZM',
  'ZW',
];

export const ASIA_COUNTRIES = [
  'AF',
  'AM',
  'AZ',
  'BH',
  'BD',
  'BT',
  'BN',
  'KH',
  'CN',
  'CY',
  'IN',
  'ID',
  'IR',
  'IQ',
  'IL',
  'JP',
  'JO',
  'KZ',
  'KW',
  'KG',
  'LA',
  'LB',
  'MY',
  'MV',
  'MN',
  'MM',
  'NP',
  'KP',
  'OM',
  'PK',
  'PS',
  'PH',
  'QA',
  'SA',
  'SG',
  'KR',
  'LK',
  'SY',
  'TJ',
  'TH',
  'TL',
  'TR',
  'TM',
  'AE',
  'UZ',
  'VN',
  'YE',
];

export const ARAB_COUNTRIES = [
  'BH',
  'DJ',
  'EG',
  'IQ',
  'JO',
  'KW',
  'LB',
  'LY',
  'MR',
  'MA',
  'OM',
  'PS',
  'QA',
  'SA',
  'SO',
  'SD',
  'SY',
  'TN',
  'AE',
  'YE',
];

export const NORTH_AMERICA_COUNTRIES = [
  'CA',
  'US',
  'MX',
  'GT',
  'BZ',
  'SV',
  'HN',
  'NI',
  'CR',
  'PA',
  'CU',
  'DO',
  'HT',
  'JM',
  'TT',
  'BB',
  'BS',
  'GD',
  'LC',
  'VC',
];

export const SOUTH_AMERICA_COUNTRIES = ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE'];

export const OCEANIA_COUNTRIES = ['AU', 'NZ', 'FJ', 'PG', 'SB', 'VU', 'WS', 'TO', 'TV', 'KI', 'MH', 'FM', 'PW', 'NR'];
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

export const ISO2_COUNTRY_CODES = [
  'AD',
  'AE',
  'AF',
  'AG',
  'AI',
  'AL',
  'AM',
  'AO',
  'AQ',
  'AR',
  'AS',
  'AT',
  'AU',
  'AW',
  'AX',
  'AZ',
  'BA',
  'BB',
  'BD',
  'BE',
  'BF',
  'BG',
  'BH',
  'BI',
  'BJ',
  'BL',
  'BM',
  'BN',
  'BO',
  'BQ',
  'BR',
  'BS',
  'BT',
  'BV',
  'BW',
  'BY',
  'BZ',
  'CA',
  'CC',
  'CD',
  'CF',
  'CG',
  'CH',
  'CI',
  'CK',
  'CL',
  'CM',
  'CN',
  'CO',
  'CR',
  'CU',
  'CV',
  'CW',
  'CX',
  'CY',
  'CZ',
  'DE',
  'DJ',
  'DK',
  'DM',
  'DO',
  'DZ',
  'EC',
  'EE',
  'EG',
  'EH',
  'ER',
  'ES',
  'ET',
  'FI',
  'FJ',
  'FK',
  'FM',
  'FO',
  'FR',
  'GA',
  'GB',
  'GD',
  'GE',
  'GF',
  'GG',
  'GH',
  'GI',
  'GL',
  'GM',
  'GN',
  'GP',
  'GQ',
  'GR',
  'GS',
  'GT',
  'GU',
  'GW',
  'GY',
  'HK',
  'HM',
  'HN',
  'HR',
  'HT',
  'HU',
  'ID',
  'IE',
  'IL',
  'IM',
  'IN',
  'IO',
  'IQ',
  'IR',
  'IS',
  'IT',
  'JE',
  'JM',
  'JO',
  'JP',
  'KE',
  'KG',
  'KH',
  'KI',
  'KM',
  'KN',
  'KP',
  'KR',
  'KW',
  'KY',
  'KZ',
  'LA',
  'LB',
  'LC',
  'LI',
  'LK',
  'LR',
  'LS',
  'LT',
  'LU',
  'LV',
  'LY',
  'MA',
  'MC',
  'MD',
  'ME',
  'MF',
  'MG',
  'MH',
  'MK',
  'ML',
  'MM',
  'MN',
  'MO',
  'MP',
  'MQ',
  'MR',
  'MS',
  'MT',
  'MU',
  'MV',
  'MW',
  'MX',
  'MY',
  'MZ',
  'NA',
  'NC',
  'NE',
  'NF',
  'NG',
  'NI',
  'NL',
  'NO',
  'NP',
  'NR',
  'NU',
  'NZ',
  'OM',
  'PA',
  'PE',
  'PF',
  'PG',
  'PH',
  'PK',
  'PL',
  'PM',
  'PN',
  'PR',
  'PS',
  'PT',
  'PW',
  'PY',
  'QA',
  'RE',
  'RO',
  'RS',
  'RU',
  'RW',
  'SA',
  'SB',
  'SC',
  'SD',
  'SE',
  'SG',
  'SH',
  'SI',
  'SJ',
  'SK',
  'SL',
  'SM',
  'SN',
  'SO',
  'SR',
  'SS',
  'ST',
  'SV',
  'SX',
  'SY',
  'SZ',
  'TC',
  'TD',
  'TF',
  'TG',
  'TH',
  'TJ',
  'TK',
  'TL',
  'TM',
  'TN',
  'TO',
  'TR',
  'TT',
  'TV',
  'TW',
  'TZ',
  'UA',
  'UG',
  'UM',
  'US',
  'UY',
  'UZ',
  'VA',
  'VC',
  'VE',
  'VG',
  'VI',
  'VN',
  'VU',
  'WF',
  'WS',
  'YE',
  'YT',
  'ZA',
  'ZM',
  'ZW',
] as const;
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
