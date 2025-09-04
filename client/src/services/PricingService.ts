import type { ShippingType } from "../types/Types";

export class PricingService {
    static volumetricWeight (p : {width: number, height: number, length: number}) : number {
        return (p.width * p.height * p.length) / 5000;
    };
    static chargableWeight (p: { weight: number, volumetricWeight: number }) : number {
        return Math.max(p.weight, p.volumetricWeight);
    }
    static distanceFactor () : number {
        return 1
    };
    static typeMultiplier (type: ShippingType, typeMultiplier: { sea: number | undefined, air: number | undefined, road: number | undefined, railway: number | undefined }) : number | undefined {
        switch (type) {
            case 'SEA': return typeMultiplier.sea;
            case 'RAILWAY': return typeMultiplier.railway
            case 'ROAD': return typeMultiplier.railway
            case 'AIR': return typeMultiplier.railway
        }
    };
    static base (basePrice: number, pricePerKg: number, chargableWeight: number) : number {
        return basePrice + ( chargableWeight * pricePerKg );
    };
    static fuelSurcharge (base: number, fuelPtc: number) : number {
        return base * fuelPtc;
    };
    static remoteSurcharge (base: number, remotePct: number) : number {
        return base * remotePct;
    };
    static insurance (declaredValue: number, insurancePct: number) : number {
        return declaredValue * insurancePct;
    };
    static total (base: number, typeMultiplier: number, distanceFactor: number, surcharges: number, insurance: number) : number {
        return ( base * typeMultiplier * distanceFactor ) + surcharges + insurance
    };
}