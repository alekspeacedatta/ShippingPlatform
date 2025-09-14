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
        <section className="mx-auto flex min-h-28 flex-col justify-center gap-3 rounded-xl bg-white px-5 py-10">
          <h2 className="text-2xl font-semibold">Details:</h2>

          <section className="grid grid-cols-2 gap-2">
            <section className="flex flex-col gap-2">
              <label>Parcel Weight</label>
              <Input
                value={weightKg ?? ''}
                onChange={(e) => setWeightKg(toNumOrNull(e.target.value))}
                type="number"
                placeholder="kg"
              />
            </section>
            <section className="flex flex-col gap-2">
              <label>Parcel Type</label>
              <Select onChange={(e) => setKind(e.target.value)}>
                {kind === '' && <option>select parcel kind</option>}
                <Option value="DOCUMENTS">DOCUMENTS</Option>
                <Option value="GOODS">GOODS</Option>
              </Select>
            </section>
          </section>

          <section className="grid grid-cols-2 gap-2">
            <section className="col-span-2 flex flex-col gap-2">
              <label>Width in cm:</label>
              <Input
                value={volumetricData.width ?? ''}
                onChange={(e) =>
                  setVolumetricData({ ...volumetricData, width: toNumOrNull(e.target.value) })
                }
                type="number"
                placeholder="width = 23"
              />
            </section>
            <section className="flex flex-col gap-2">
              <label>Height in cm:</label>
              <Input
                value={volumetricData.height ?? ''}
                onChange={(e) =>
                  setVolumetricData({ ...volumetricData, height: toNumOrNull(e.target.value) })
                }
                type="text"
                placeholder="height = 5"
              />
            </section>
            <section className="flex flex-col gap-2">
              <label>Length in cm:</label>
              <Input
                value={volumetricData.length ?? ''}
                onChange={(e) =>
                  setVolumetricData({ ...volumetricData, length: toNumOrNull(e.target.value) })
                }
                type="text"
                placeholder="length = 132"
              />
            </section>
          </section>

          <section className="flex flex-col">
            <label htmlFor="">Decleared Value</label>
            <Input
              value={declaredValue ?? ''}
              onChange={(e) => setDeclaredValue(toNumOrNull(e.target.value))}
              type="text"
              placeholder="30$"
            />
          </section>
        </section>
      )}

      {step === 1 && (
        <section className="mx-auto flex min-h-28 flex-col justify-center gap-3 rounded-xl border bg-white p-4 px-5 py-10">
          <h2 className="text-2xl font-semibold">Route:</h2>
          <section className="grid grid-cols-2 items-center gap-2">
            <section className="flex flex-col gap-2">
              <label className="text-lg font-semibold">Origin</label>
              <Select onChange={(e) => setFromLocation((p) => ({ ...p, origin: { ...p.origin, country: e.target.value } }))}>
                {selectedCompany?.regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </Select>
              <Input
                value={fromLocation.origin.city}
                onChange={(e) =>
                  setFromLocation((p) => ({ ...p, origin: { ...p.origin, city: e.target.value } }))
                }
                placeholder="city"
              />
            </section>
            <section className="flex flex-col gap-2">
              <label className="text-lg">Pickup address</label>
              <section className="grid grid-cols-2 gap-3">
                <Select onChange={(e) => setFromLocation((p) => ({ ...p, pickUp: { ...p.pickUp, country: e.target.value } }))}>
                  {selectedCompany?.regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </Select>
                <Input
                  value={fromLocation.pickUp.city}
                  onChange={(e) =>
                    setFromLocation((p) => ({
                      ...p,
                      pickUp: { ...p.pickUp, city: e.target.value },
                    }))
                  }
                  placeholder="city"
                />
                <Input
                  value={fromLocation.pickUp.line1}
                  onChange={(e) =>
                    setFromLocation((p) => ({
                      ...p,
                      pickUp: { ...p.pickUp, line1: e.target.value },
                    }))
                  }
                  placeholder="line1"
                />
                <Input
                  value={fromLocation.pickUp.postalcode}
                  onChange={(e) =>
                    setFromLocation((p) => ({
                      ...p,
                      pickUp: { ...p.pickUp, postalcode: Number(e.target.value) },
                    }))
                  }
                  placeholder="postalcode"
                />
              </section>
            </section>
          </section>

          <section className="grid grid-cols-2 items-center gap-2">
            <section className="flex flex-col gap-2">
              <label className="text-lg font-semibold">Destination</label>
              <Select onChange={(e) => setToLocation((p) => ({ ...p, destination: { ...p.destination, country: e.target.value } }))}>
                  {selectedCompany?.regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </Select>
              <Input
                value={toLocation.destination.city}
                onChange={(e) =>
                  setToLocation((p) => ({
                    ...p,
                    destination: { ...p.destination, city: e.target.value },
                  }))
                }
                placeholder="city"
              />
            </section>
            <section className="flex flex-col gap-2">
              <label className="text-lg">delivery address</label>
              <section className="grid grid-cols-2 gap-3">
                <Select onChange={(e) => setToLocation((p) => ({ ...p, deliveryAddress: { ...p.deliveryAddress, country: e.target.value } }))}>
                  {selectedCompany?.regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </Select>
                <Input
                  value={toLocation.deliveryAddress.city}
                  onChange={(e) =>
                    setToLocation((p) => ({
                      ...p,
                      deliveryAddress: { ...p.deliveryAddress, city: e.target.value },
                    }))
                  }
                  placeholder="city"
                />
                <Input
                  value={toLocation.deliveryAddress.line1}
                  onChange={(e) =>
                    setToLocation((p) => ({
                      ...p,
                      deliveryAddress: { ...p.deliveryAddress, line1: e.target.value },
                    }))
                  }
                  placeholder="line1"
                />
                <Input
                  value={toLocation.deliveryAddress.postalcode}
                  onChange={(e) =>
                    setToLocation((p) => ({
                      ...p,
                      deliveryAddress: { ...p.deliveryAddress, postalcode: Number(e.target.value) },
                    }))
                  }
                  placeholder="postalcode"
                />
              </section>
            </section>
          </section>
        </section>
      )}

      {step === 2 && (
        <section className="mx-auto flex min-h-28 flex-col justify-center gap-6 rounded-xl bg-white px-5 py-10">
          <h2 className="text-2xl font-semibold">Shipping Type</h2>

          {(['SEA', 'ROAD', 'RAILWAY', 'AIR'] as const).map((t) => {
            const supported = selectedCompany?.supportedTypes.includes(t);
            return (
              <section key={t} className="flex justify-between">
                {supported ? (
                  <>
                    <section className="flex items-center gap-2">
                      <h3 className="text-lg">{t}</h3>
                      <input
                        onChange={(e) => setShippingType(e.target.value as any)}
                        checked={shippingType === t}
                        type="radio"
                        name="shippingType"
                        value={t}
                      />
                    </section>
                    <section className="flex items-center gap-2">
                      <h3 className="">type multiplier:</h3>
                      <p>{selectedCompany?.pricing.typeMultipliers[t]}x</p>
                    </section>
                  </>
                ) : (
                  <>
                    <section className="flex items-center gap-2">
                      <h3 className="text-xl opacity-50">{t}</h3>
                      <input type="radio" name="shippingType" value={t} disabled />
                    </section>
                    <section className="flex items-center gap-2">
                      <h3 className="">type multiplier:</h3>
                      <p>none</p>
                    </section>
                  </>
                )}
              </section>
            );
          })}
        </section>
      )}
    </div>
  );
}
