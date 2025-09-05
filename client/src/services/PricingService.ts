import { AsiaCountries, EuCountries, type ShippingType } from "../types/Types";

export class PricingService {
    static volumetricWeight (p : {width: number, height: number, length: number}) : number {
        return (p.width * p.height * p.length) / 5000;
    };
    static chargableWeight (p: { weight: number, volumetricWeight: number }) : number {
        return Math.max(p.weight, p.volumetricWeight);
    }
    static distanceFactor (fromCountry: string, toCountry: string) : number {
        let distanceFactor = 0
        if(EuCountries.includes(fromCountry.toLocaleLowerCase()) && EuCountries.includes(toCountry.toLocaleLowerCase())){
            distanceFactor = 1;
        } 
        else if(EuCountries.includes(fromCountry.toLocaleLowerCase()) || AsiaCountries.includes(fromCountry.toLocaleLowerCase()) && EuCountries.includes(toCountry.toLocaleLowerCase()) || AsiaCountries.includes(toCountry.toLocaleLowerCase())){ 
            distanceFactor = 1.3;
        }
        else if(!EuCountries.includes(fromCountry.toLocaleLowerCase()) || !AsiaCountries.includes(fromCountry.toLocaleLowerCase()) && !EuCountries.includes(toCountry.toLocaleLowerCase()) || !AsiaCountries.includes(toCountry.toLocaleLowerCase())){ 
            distanceFactor = 1.6;
        }
        return distanceFactor;
    };
    static typeMultiplier (type: ShippingType, typeMultiplier: { sea: number | undefined, air: number | undefined, road: number | undefined, railway: number | undefined }) : number | undefined {
        switch (type) {
            case 'AIR': return typeMultiplier.air
            case 'ROAD': return typeMultiplier.road
            case 'RAILWAY': return typeMultiplier.railway
            case 'SEA': return typeMultiplier.sea;
        }
    };
    static base (basePrice: number, pricePerKg: number, chargableWeight: number) : number {
        return Number((basePrice + ( chargableWeight * pricePerKg )).toFixed(2));
    };
    static fuelSurcharge (base: number, fuelPtc: number) : number {
        return base * fuelPtc;
    };
    static remoteSurcharge (base: number, remotePct: number) : number {
        return Number((base * remotePct).toFixed(2));
    };
    static insurance (declaredValue: number, insurancePct: number) : number {
        return declaredValue * insurancePct;
    };
    static total (base: number, typeMultiplier: number, distanceFactor: number, surcharges: number, insurance: number) : number {
        return ( base * typeMultiplier * distanceFactor ) + surcharges + insurance
    };
}