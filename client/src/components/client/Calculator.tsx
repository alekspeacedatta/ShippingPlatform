import { useEffect, useMemo } from 'react';
import { PricingService } from '../../services/PricingService';
import type { CompanyCreate, ShippingType } from '../../types/Types';

type Volumetric = { width: number | null; height: number | null; length: number | null };
type LocFrom = {
  origin: { country: string; city: string };
  pickUp: { country: string; city: string; line1: string; postalcode: number };
};
type LocTo = {
  destination: { country: string; city: string };
  deliveryAddress: { country: string; city: string; line1: string; postalcode: number };
};

export type CalcResult = {
  volumetricWeight: number;
  chargableWeight: number;
  typeMultiplier: number;
  base: number;
  fuelSurcharge: number;
  remoteSurcharge: number;
  surcharges: number;
  distanceFactor: number;
  insurance: number;
  total: number;
};

export default function Calculator({
  volumetricData,
  weightKg,
  declaredValue,
  shippingType,
  selectedCompany,
  fromLocation,
  toLocation,
  onChange,
}: {
  volumetricData: Volumetric;
  weightKg: number | null;
  declaredValue: number | null;
  shippingType: ShippingType | string;
  selectedCompany: CompanyCreate | null;
  fromLocation: LocFrom;
  toLocation: LocTo;
  onChange?: (r: CalcResult) => void;
}) {
  const width = Number(volumetricData.width ?? 0);
  const height = Number(volumetricData.height ?? 0);
  const length = Number(volumetricData.length ?? 0);
  const weight = Number(weightKg ?? 0);
  const declared = Number(declaredValue ?? 0);

  const result = useMemo<CalcResult>(() => {
    const volW = PricingService.volumetricWeight({ width, height, length });
    const chW = PricingService.chargableWeight({ weight, volumetricWeight: volW });

    // typeMultipliers
    const tm =
      PricingService.typeMultiplier(shippingType as ShippingType, {
        sea: selectedCompany?.pricing.typeMultipliers.SEA ?? 1,
        railway: selectedCompany?.pricing.typeMultipliers.RAILWAY ?? 1,
        road: selectedCompany?.pricing.typeMultipliers.ROAD ?? 1,
        air: selectedCompany?.pricing.typeMultipliers.AIR ?? 1,
      }) ?? 1;

    const base = PricingService.base(
      selectedCompany?.pricing.basePrice ?? 0,
      selectedCompany?.pricing.pricePerKg ?? 0,
      chW,
    );

    const fuel = PricingService.fuelSurcharge(base, selectedCompany?.pricing.fuelPct ?? 0);
    const remote = PricingService.remoteSurcharge(
      base,
      selectedCompany?.pricing.remoteAreaPct ?? 0,
    );
    const sur = fuel + remote;

    const df = PricingService.distanceFactor(
      fromLocation.origin.country,
      toLocation.destination.country,
    );

    const ins = PricingService.insurance(declared, selectedCompany?.pricing.insurancePct ?? 0);
    const total = PricingService.total(base, tm, df, sur, ins);

    return {
      volumetricWeight: volW,
      chargableWeight: chW,
      typeMultiplier: tm,
      base,
      fuelSurcharge: fuel,
      remoteSurcharge: remote,
      surcharges: sur,
      distanceFactor: df,
      insurance: ins,
      total,
    };
  }, [
    width,
    height,
    length,
    weight,
    declared,
    shippingType,
    selectedCompany,
    fromLocation.origin.country,
    toLocation.destination.country,
  ]);

  useEffect(() => {
    onChange?.(result);
  }, [result, onChange]);

  return (
    <div className="flex min-h-28 flex-col gap-5 rounded-xl border bg-white p-4">
      <h2 className="mb-2 text-2xl font-semibold">Calculator</h2>
      <section>
        <p>volumetricWeight = {result.volumetricWeight.toFixed(2)} kg</p>
        <p>chargableWeight = {result.chargableWeight.toFixed(2)} kg</p>
        <p>distance factor = {result.distanceFactor.toFixed(2)}x</p>
        <p>
          type multiplier = {String(shippingType)} - {result.typeMultiplier.toFixed(2)}x
        </p>
        <p>base = {result.base}$</p>
        <p>fuelSurcharge = {result.fuelSurcharge}$</p>
        <p>remoteSurcharge = {result.remoteSurcharge}$</p>
        <p>incurance = {result.insurance}$</p>
      </section>
      <p className="text-2xl font-semibold">total = {result.total}$</p>
    </div>
  );
}
