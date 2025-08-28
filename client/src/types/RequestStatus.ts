export type ShippingType = 'SEA' | 'RAILWAY' | 'ROAD' | 'AIR';  
export type Role = 'USER' | 'COMPANY_ADMIN';
export type RequestStatus =
| 'PENDING_REVIEW'
| 'AWAITING_COMPANY_CONFIRMATION'
| 'ACCEPTED'
| 'IN_TRANSIT'
| 'OUT_FOR_DELIVERY'
| 'DELIVERED'
| 'REJECTED';