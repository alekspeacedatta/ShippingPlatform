import { useRef } from 'react';
import { Input } from '../commons/Input';
import { Select, Option } from '../commons/Select';
import type { CompanyCreate, ShippingType } from '../../types/Types';
import { toNumOrNull } from '../../utils/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

type Volumetric = { width: number | null; height: number | null; length: number | null };
type LocFrom = {
  origin: { country: string; city: string };
  pickUp: { country: string; city: string; line1: string; postalcode: number };
};
type LocTo = {
  destination: { country: string; city: string };
  deliveryAddress: { country: string; city: string; line1: string; postalcode: number };
};

type FieldErrors = Partial<{
  weightKg: string;
  kind: string;
  width: string;
  height: string;
  length: string;
  declaredValue: string;
  originCountry: string;
  originCity: string;
  pickupCountry: string;
  pickupCity: string;
  pickupLine1: string;
  pickupPostal: string;
  destCountry: string;
  destCity: string;
  deliveryCountry: string;
  deliveryCity: string;
  deliveryLine1: string;
  deliveryPostal: string;
  shippingType: string;
}>;

const errorClass = 'ring-2 ring-red-300 border-red-300';
const help = (m?: string) => (m ? <p className="mt-1 text-xs sm:text-sm text-red-600">{m}</p> : null);

export default function ParcelForm({
  step,
  selectedCompany,
  shippingType,
  setShippingType,
  kind,
  setKind,
  weightKg,
  setWeightKg,
  volumetricData,
  setVolumetricData,
  declaredValue,
  setDeclaredValue,
  fromLocation,
  setFromLocation,
  toLocation,
  setToLocation,
  errors,
}: {
  step: number;
  selectedCompany: CompanyCreate | null;

  shippingType: ShippingType | string;
  setShippingType: (v: ShippingType) => void;

  kind: string;
  setKind: (v: string) => void;

  weightKg: number | null;
  setWeightKg: (v: number | null) => void;

  volumetricData: Volumetric;
  setVolumetricData: (v: Volumetric) => void;

  declaredValue: number | null;
  setDeclaredValue: (v: number | null) => void;

  fromLocation: LocFrom;
  setFromLocation: React.Dispatch<React.SetStateAction<LocFrom>>;

  toLocation: LocTo;
  setToLocation: React.Dispatch<React.SetStateAction<LocTo>>;

  errors: FieldErrors;
}) {
  gsap.registerPlugin(useGSAP);
  const secRef = useRef<HTMLDivElement | null>(null);
  useGSAP(
    () => {
      const el = secRef.current;
      if (!el) return;
      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 8, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' },
      );
    },
    { dependencies: [step], scope: secRef },
  );

  return (
    <div ref={secRef} key={step} className="w-full">
      {step === 0 && (
        <section className="mx-auto flex min-h-28 flex-col justify-center gap-4 rounded-xl bg-white p-4 sm:p-5">
          <h2 className="text-xl sm:text-2xl font-semibold">Details</h2>

          {/* weight + kind */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2 min-w-0">
              <label className="text-sm font-medium">Parcel Weight</label>
              <Input
                value={weightKg ?? ''}
                onChange={(e) => setWeightKg(toNumOrNull(e.target.value))}
                type="number"
                placeholder="kg"
                className={errors.weightKg ? errorClass : ''}
                aria-invalid={!!errors.weightKg}
              />
              {help(errors.weightKg)}
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <label className="text-sm font-medium">Parcel Type</label>
              <Select value={kind} onChange={(e) => setKind(e.target.value)}>
                {kind === '' && <option value="">select parcel kind</option>}
                <Option value="DOCUMENTS">DOCUMENTS</Option>
                <Option value="GOODS">GOODS</Option>
              </Select>
              {help(errors.kind)}
            </div>
          </section>

          {/* volumetric */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="col-span-1 sm:col-span-2 flex flex-col gap-2 min-w-0">
              <label className="text-sm font-medium">Width (cm)</label>
              <Input
                value={volumetricData.width ?? ''}
                onChange={(e) => setVolumetricData({ ...volumetricData, width: toNumOrNull(e.target.value) })}
                type="number"
                placeholder="width = 23"
                className={errors.width ? errorClass : ''}
                aria-invalid={!!errors.width}
              />
              {help(errors.width)}
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <label className="text-sm font-medium">Height (cm)</label>
              <Input
                value={volumetricData.height ?? ''}
                onChange={(e) => setVolumetricData({ ...volumetricData, height: toNumOrNull(e.target.value) })}
                type="number"
                placeholder="height = 5"
                className={errors.height ? errorClass : ''}
                aria-invalid={!!errors.height}
              />
              {help(errors.height)}
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <label className="text-sm font-medium">Length (cm)</label>
              <Input
                value={volumetricData.length ?? ''}
                onChange={(e) => setVolumetricData({ ...volumetricData, length: toNumOrNull(e.target.value) })}
                type="number"
                placeholder="length = 132"
                className={errors.length ? errorClass : ''}
                aria-invalid={!!errors.length}
              />
              {help(errors.length)}
            </div>
          </section>

          <section className="flex flex-col min-w-0">
            <label className="text-sm font-medium">Declared Value</label>
            <Input
              value={declaredValue ?? ''}
              onChange={(e) => setDeclaredValue(toNumOrNull(e.target.value))}
              type="number"
              placeholder="30$"
              className={errors.declaredValue ? errorClass : ''}
              aria-invalid={!!errors.declaredValue}
            />
            {help(errors.declaredValue)}
          </section>
        </section>
      )}

      {step === 1 && (
        <section className="mx-auto flex min-h-28 flex-col justify-center gap-4 rounded-xl border bg-white p-4 sm:p-5">
          <h2 className="text-xl sm:text-2xl font-semibold">Route</h2>

          {/* origin + pickup */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-semibold">Origin</label>
              <Select
                value={fromLocation.origin.country}
                onChange={(e) => setFromLocation((p) => ({ ...p, origin: { ...p.origin, country: e.target.value } }))}
                className={errors.originCountry ? errorClass : ''}
                aria-invalid={!!errors.originCountry}
              >
                <option value="">Select country</option>
                {selectedCompany?.regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </Select>
              {help(errors.originCountry)}
              <Input
                value={fromLocation.origin.city}
                onChange={(e) => setFromLocation((p) => ({ ...p, origin: { ...p.origin, city: e.target.value } }))}
                placeholder="city"
                className={errors.originCity ? errorClass : ''}
                aria-invalid={!!errors.originCity}
              />
              {help(errors.originCity)}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-medium">Pickup address</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  value={fromLocation.pickUp.country}
                  onChange={(e) => setFromLocation((p) => ({ ...p, pickUp: { ...p.pickUp, country: e.target.value } }))}
                  className={errors.pickupCountry ? errorClass : ''}
                  aria-invalid={!!errors.pickupCountry}
                >
                  <option value="">Select country</option>
                  {selectedCompany?.regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </Select>
                <Input
                  value={fromLocation.pickUp.city}
                  onChange={(e) => setFromLocation((p) => ({ ...p, pickUp: { ...p.pickUp, city: e.target.value } }))}
                  placeholder="city"
                  className={errors.pickupCity ? errorClass : ''}
                  aria-invalid={!!errors.pickupCity}
                />
                {help(errors.pickupCity)}
                <Input
                  value={fromLocation.pickUp.line1}
                  onChange={(e) => setFromLocation((p) => ({ ...p, pickUp: { ...p.pickUp, line1: e.target.value } }))}
                  placeholder="line1"
                  className={errors.pickupLine1 ? errorClass : ''}
                  aria-invalid={!!errors.pickupLine1}
                />
                {help(errors.pickupLine1)}
                <Input
                  value={fromLocation.pickUp.postalcode}
                  onChange={(e) =>
                    setFromLocation((p) => ({ ...p, pickUp: { ...p.pickUp, postalcode: Number(e.target.value) } }))
                  }
                  placeholder="postalcode"
                  type="number"
                  className={errors.pickupPostal ? errorClass : ''}
                  aria-invalid={!!errors.pickupPostal}
                />
                {help(errors.pickupPostal)}
              </div>
            </div>
          </section>

          {/* destination + delivery */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-semibold">Destination</label>
              <Select
                value={toLocation.destination.country}
                onChange={(e) =>
                  setToLocation((p) => ({ ...p, destination: { ...p.destination, country: e.target.value } }))
                }
                className={errors.destCountry ? errorClass : ''}
                aria-invalid={!!errors.destCountry}
              >
                <option value="">Select country</option>
                {selectedCompany?.regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </Select>
              {help(errors.destCountry)}
              <Input
                value={toLocation.destination.city}
                onChange={(e) =>
                  setToLocation((p) => ({ ...p, destination: { ...p.destination, city: e.target.value } }))
                }
                placeholder="city"
                className={errors.destCity ? errorClass : ''}
                aria-invalid={!!errors.destCity}
              />
              {help(errors.destCity)}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-medium">Delivery address</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  value={toLocation.deliveryAddress.country}
                  onChange={(e) =>
                    setToLocation((p) => ({ ...p, deliveryAddress: { ...p.deliveryAddress, country: e.target.value } }))
                  }
                  className={errors.deliveryCountry ? errorClass : ''}
                  aria-invalid={!!errors.deliveryCountry}
                >
                  <option value="">Select country</option>
                  {selectedCompany?.regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </Select>
                <Input
                  value={toLocation.deliveryAddress.city}
                  onChange={(e) =>
                    setToLocation((p) => ({ ...p, deliveryAddress: { ...p.deliveryAddress, city: e.target.value } }))
                  }
                  placeholder="city"
                  className={errors.deliveryCity ? errorClass : ''}
                  aria-invalid={!!errors.deliveryCity}
                />
                {help(errors.deliveryCity)}
                <Input
                  value={toLocation.deliveryAddress.line1}
                  onChange={(e) =>
                    setToLocation((p) => ({ ...p, deliveryAddress: { ...p.deliveryAddress, line1: e.target.value } }))
                  }
                  placeholder="line1"
                  className={errors.deliveryLine1 ? errorClass : ''}
                  aria-invalid={!!errors.deliveryLine1}
                />
                {help(errors.deliveryLine1)}
                <Input
                  value={toLocation.deliveryAddress.postalcode}
                  onChange={(e) =>
                    setToLocation((p) => ({
                      ...p,
                      deliveryAddress: { ...p.deliveryAddress, postalcode: Number(e.target.value) },
                    }))
                  }
                  placeholder="postalcode"
                  type="number"
                  className={errors.deliveryPostal ? errorClass : ''}
                  aria-invalid={!!errors.deliveryPostal}
                />
                {help(errors.deliveryPostal)}
              </div>
            </div>
          </section>
        </section>
      )}

      {step === 2 && (
        <section className="mx-auto flex min-h-28 flex-col justify-center gap-4 rounded-xl bg-white p-4 sm:p-5">
          <h2 className="text-xl sm:text-2xl font-semibold">Shipping Type</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['SEA', 'ROAD', 'RAILWAY', 'AIR'] as const).map((t) => {
              const supported = selectedCompany?.supportedTypes.includes(t);
              return (
                <div
                  key={t}
                  className={`flex items-center justify-between rounded-lg border p-3 ${supported ? '' : 'opacity-60'}`}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg">{t}</h3>
                    <input
                      onChange={(e) => setShippingType(e.target.value as ShippingType)}
                      checked={shippingType === t}
                      type="radio"
                      name="shippingType"
                      value={t}
                      disabled={!supported}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <span>type multiplier:</span>
                    <p>{supported ? `${selectedCompany?.pricing.typeMultipliers[t]}x` : 'none'}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {help(errors.shippingType)}
        </section>
      )}
    </div>
  );
}
