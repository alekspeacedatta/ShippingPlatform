// services/PricingService.ts
import type { Address, Company, ShippingType } from "../types/Types";
import { DistanceService } from "./DistanceService";


export type PriceInput = {
  shippingType: ShippingType;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  origin: Address;
  destination: Address;
  declaredValue: number;
  pricing: Company["pricing"];          // company.basePrice, pricePerKg, fuelPct, insurancePct, typeMultipliers, remoteAreaPct?
  includeInsurance?: boolean;           // default true
  extraSurcharges?: number;             // any manual/extra fees you want to add on top
};

export type PriceBreakdown = {
  volumetricWeight: number;
  chargeableWeight: number;
  distanceFactor: number;
  typeMultiplier: number;
  base: number;
  fuelSurcharge: number;
  remoteSurcharge: number;
  insurance: number;
  total: number;
};

export class PricingService {
  // By spec
  static readonly typeMultipliers: Record<ShippingType, number> = {
    SEA: 0.7,
    RAILWAY: 0.85,
    ROAD: 1.0,
    AIR: 1.6,
  };

  static volumetricWeight(L: number, W: number, H: number) {
    // cm rule of thumb
    return (L * W * H) / 5000;
  }

  static round(n: number) {
    return Math.round(n * 100) / 100;
  }

  static getBreakdown(input: PriceInput): PriceBreakdown {
    const {
      shippingType,
      weightKg,
      lengthCm,
      widthCm,
      heightCm,
      origin,
      destination,
      declaredValue,
      pricing,
      includeInsurance = true,
      extraSurcharges = 0,
    } = input;

    const vol = this.volumetricWeight(lengthCm, widthCm, heightCm);
    const chargeableWeight = Math.max(weightKg, vol);

    // mocked region factor + remotePct
    const { factor: distanceFactor, remotePct } = DistanceService.getFactor(origin, destination);

    const typeMultiplier =
      PricingService.typeMultipliers[shippingType] ??
      pricing.typeMultipliers?.[shippingType] ??
      1;

    // base = company.basePrice + (chargeableWeight * company.pricePerKg)
    const base = pricing.basePrice + chargeableWeight * pricing.pricePerKg;

    // surcharges
    const fuelSurcharge = base * (pricing.fuelPct / 100);
    const remoteSurcharge = base * (remotePct ?? 0); // or pricing.remoteAreaPct if you want from company
    const insurance = includeInsurance ? declaredValue * (pricing.insurancePct / 100) : 0;

    // Total = (base * typeMultiplier * distanceFactor) + surcharges + insurance
    const core = base * typeMultiplier * distanceFactor;
    const total = PricingService.round(core + fuelSurcharge + remoteSurcharge + insurance + extraSurcharges);

    return {
      volumetricWeight: this.round(vol),
      chargeableWeight: this.round(chargeableWeight),
      distanceFactor: this.round(distanceFactor),
      typeMultiplier: this.round(typeMultiplier),
      base: this.round(base),
      fuelSurcharge: this.round(fuelSurcharge),
      remoteSurcharge: this.round(remoteSurcharge),
      insurance: this.round(insurance),
      total,
    };
  }
}
