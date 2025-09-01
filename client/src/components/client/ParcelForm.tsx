import { useEffect, useRef, useState } from "react";
import { Button } from "../commons/Button";
import Stepper from "../commons/Stepper";
import { Input } from "../commons/Input";
import { PricingService } from "../../services/PricingService";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Select, Option } from "../commons/Select";
import type { ParcelRequest, Address, ShippingType, User } from "../../types/Types";
import { useAuthStore } from "../../store/useAuthStore";
import { useCompanyStore } from "../../store/useCompanyStore";

gsap.registerPlugin(useGSAP);
const steps = ['Parcel Details', 'Route', 'Shipping Type', 'Calculator', 'Summary & Submit'];

const emptyAddress: Address = { country: '', city: '', line1: '', postalCode: '' };

const makeInitialParcel = (userId: string): ParcelRequest => ({
  userId,
  companyId: undefined,
  shippingType: 'RAILWAY',
  parcel: { weightKg: 0, lengthCm: 0, widthCm: 0, heightCm: 0, kind: 'DOCUMENTS', declaredValue: 0, fragile: false },
  route: {
    origin: { ...emptyAddress },
    destination: { ...emptyAddress },
    pickupAddress: { ...emptyAddress },
    deliveryAddress: { ...emptyAddress },
  },
  priceEstimate: 0,
  status: 'PENDING_REVIEW',
  timeline: [],
  trackingId: undefined,
  messages: [],
});

export default function StepperDemo() {
  // Cast so we can use _id that comes from backend
  const user = useAuthStore(s => s.user) as (User & { _id: string }) | null;
  const company = useCompanyStore(s => s.company);

  const [parcelInfo, setParcelInfo] = useState<ParcelRequest | null>(null);

  // init when user appears
  useEffect(() => {
    if (user?._id && !parcelInfo) setParcelInfo(makeInitialParcel(user._id));
  }, [user?._id, parcelInfo]);

  const [step, setStep] = useState(0);
  const back = () => setStep(s => Math.max(0, s - 1));
  const next = () => setStep(s => Math.min(steps.length - 1, s + 1));

  const secRef = useRef<HTMLDivElement | null>(null);
  useGSAP(() => {
    const el = secRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.fromTo(el, { autoAlpha: 0, y: 8, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" });
  }, { dependencies: [step], scope: secRef });

  // ---- pricing breakdown (call service) ----
  const companyPricing = company?.pricing;
  const breakdown = (() => {
    if (!companyPricing || !parcelInfo) {
      return {
        volumetricWeight: 0,
        chargeableWeight: 0,
        distanceFactor: 1,
        typeMultiplier: 1,
        base: 0,
        fuelSurcharge: 0,
        remoteSurcharge: 0,
        insurance: 0,
        total: 0,
      };
    }
    return PricingService.getBreakdown({
      shippingType: parcelInfo.shippingType,
      weightKg: parcelInfo.parcel.weightKg,
      lengthCm: parcelInfo.parcel.lengthCm,
      widthCm: parcelInfo.parcel.widthCm,
      heightCm: parcelInfo.parcel.heightCm,
      origin: parcelInfo.route.origin,
      destination: parcelInfo.route.destination,
      declaredValue: parcelInfo.parcel.declaredValue,
      pricing: companyPricing,
      includeInsurance: true,
      extraSurcharges: 0,
    });
  })();

  // keep hooks order stable; just guard inside
  useEffect(() => {
    if (!parcelInfo) return;
    setParcelInfo(p => ({ ...p!, priceEstimate: breakdown.total }));
  }, [breakdown.total, parcelInfo]);

  // early return AFTER all hooks
  if (!parcelInfo) {
    return (
      <div className="max-w-3xl md:max-w-5xl mx-auto p-6 gap-5 min-h-screen flex justify-center flex-col">
        <Stepper steps={steps} current={step} />
        <div className="p-4 border rounded-xl min-h-28 flex flex-col justify-center">
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  // ---- helpers & handlers ----
  const setParcelField = <
    K extends keyof ParcelRequest['parcel']
  >(key: K, value: ParcelRequest['parcel'][K]) => {
    setParcelInfo(p => ({ ...p!, parcel: { ...p!.parcel, [key]: value } }));
  };

  const setRouteField = (
    section: keyof ParcelRequest['route'],
    key: keyof Address,
    value: string
  ) => {
    setParcelInfo(p => ({ ...p!, route: { ...p!.route, [section]: { ...p!.route[section], [key]: value } } }));
  };

  const setShippingType = (type: ShippingType) => {
    setParcelInfo(p => ({ ...p!, shippingType: type }));
  };

  const handleSubmit = async () => {
    const toSend: ParcelRequest = {
      ...parcelInfo,
      status: 'PENDING_REVIEW',
      timeline: [
        ...parcelInfo.timeline,
        { status: 'PENDING_REVIEW', at: new Date().toISOString(), note: 'Created from UI' },
      ],
    };
    console.log('Submitting ParcelRequest:', toSend);
    // await api.createParcelRequest(toSend)
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (step < steps.length - 1) next(); else handleSubmit();
  };

  return (
    <div className="max-w-3xl md:max-w-5xl mx-auto p-6 gap-5 min-h-screen flex justify-center flex-col">
      <Stepper steps={steps} current={step} />

      <form className="p-4 border rounded-xl min-h-28 flex flex-col justify-center" onSubmit={onSubmit}>
        <div ref={secRef} key={step} className="w-full">
          {step === 0 && (
            <section className="bg-white flex flex-col justify-center gap-3 mx-auto py-10 px-5 rounded-xl min-h-28">
              <h2 className="text-2xl font-semibold">Details:</h2>

              <section className="grid-cols-2 grid gap-2">
                <section className="flex flex-col gap-2 ">
                  <label>Parcel Weight</label>
                  <Input
                    placeholder="kg"
                    type="number"
                    value={parcelInfo.parcel.weightKg}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setParcelField('weightKg', Number(e.target.value))}
                  />
                </section>
                <section className="flex flex-col gap-2">
                  <label>Parcel Type</label>
                  <Select
                    value={parcelInfo.parcel.kind}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setParcelField('kind', e.target.value as ParcelRequest['parcel']['kind'])
                    }
                  >
                    <Option value="DOCUMENTS">DOCUMENTS</Option>
                    <Option value="GOODS">GOODS</Option>
                  </Select>
                </section>
              </section>

              <section className="grid grid-cols-2 gap-2">
                <section className="flex flex-col col-span-2 gap-2">
                  <label>Width in cm:</label>
                  <Input
                    type="number"
                    placeholder="width = 123"
                    value={parcelInfo.parcel.widthCm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setParcelField('widthCm', Number(e.target.value))}
                  />
                </section>
                <section className="flex flex-col gap-2">
                  <label>Length in cm:</label>
                  <Input
                    type="number"
                    placeholder="length = 132"
                    value={parcelInfo.parcel.lengthCm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setParcelField('lengthCm', Number(e.target.value))}
                  />
                </section>
                <section className="flex flex-col gap-2">
                  <label>Height in cm:</label>
                  <Input
                    type="number"
                    placeholder="height = 5"
                    value={parcelInfo.parcel.heightCm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setParcelField('heightCm', Number(e.target.value))}
                  />
                </section>
              </section>

              <section className="flex flex-col ">
                <label>Decleared Value</label>
                <Input
                  type="number"
                  placeholder="30$"
                  value={parcelInfo.parcel.declaredValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setParcelField('declaredValue', Number(e.target.value))}
                />
              </section>
            </section>
          )}

          {step === 1 && (
            <section className="p-4 border rounded-xl min-h-28 bg-white flex flex-col justify-center gap-3 mx-auto py-10 px-5 rounded-xl">
              <h2 className="text-2xl font-semibold">Route:</h2>
              <section className="grid grid-cols-2 gap-2">
                <section className="flex flex-col gap-2">
                  <label className=" text-lg ">Origin</label>
                  <Input
                    placeholder="country"
                    value={parcelInfo.route.origin.country}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteField('origin', 'country', e.target.value)}
                  />
                  <Input
                    placeholder="city"
                    value={parcelInfo.route.origin.city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteField('origin', 'city', e.target.value)}
                  />
                </section>
                <section className="flex flex-col gap-2">
                  <label className=" text-lg ">Pickup address</label>
                  <section className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="country"
                      value={parcelInfo.route.pickupAddress.country}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteField('pickupAddress', 'country', e.target.value)}
                    />
                    <Input
                      placeholder="city"
                      value={parcelInfo.route.pickupAddress.city}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteField('pickupAddress', 'city', e.target.value)}
                    />
                    <Input
                      placeholder="line1"
                      value={parcelInfo.route.pickupAddress.line1}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteField('pickupAddress', 'line1', e.target.value)}
                    />
                    <Input
                      placeholder="postalcode"
                      value={parcelInfo.route.pickupAddress.postalCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteField('pickupAddress', 'postalCode', e.target.value)}
                    />
                  </section>
                </section>
              </section>

              <section className="grid grid-cols-2 gap-2">
                <section className="flex flex-col gap-2">
                  <label className="text-lg">Destination</label>
                  <Input
                    placeholder="country"
                    value={parcelInfo.route.destination.country}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteField('destination', 'country', e.target.value)}
                  />
                  <Input
                    placeholder="city"
                    value={parcelInfo.route.destination.city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteField('destination', 'city', e.target.value)}
                  />
                </section>
                <section className="flex flex-col gap-2">
                  <label className=" text-lg ">delivery address</label>
                  <section className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="country"
                      value={parcelInfo.route.deliveryAddress.country}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteField('deliveryAddress', 'country', e.target.value)}
                    />
                    <Input
                      placeholder="city"
                      value={parcelInfo.route.deliveryAddress.city}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteField('deliveryAddress', 'city', e.target.value)}
                    />
                    <Input
                      placeholder="line1"
                      value={parcelInfo.route.deliveryAddress.line1}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteField('deliveryAddress', 'line1', e.target.value)}
                    />
                    <Input
                      placeholder="postalcode"
                      value={parcelInfo.route.deliveryAddress.postalCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteField('deliveryAddress', 'postalCode', e.target.value)}
                    />
                  </section>
                </section>
              </section>
            </section>
          )}

          {step === 2 && (
            <section className="bg-white flex flex-col justify-center gap-6 mx-auto py-10 px-5 rounded-xl min-h-28">
              <h2 className="text-2xl font-semibold">Shipping Type</h2>

              <section className="flex justify-between">
                <section className="flex items-center gap-2">
                  <h3 className="text-xl">Sea</h3>
                  <input
                    type="radio" name="shippingType" value="SEA"
                    checked={parcelInfo.shippingType === 'SEA'}
                    onChange={() => setShippingType('SEA')}
                  />
                </section>
                <section>
                  <h3 className="text-xl">type multiplier</h3>
                  <p>0.7x</p>
                </section>
              </section>

              <section className="flex justify-between">
                <section className="flex items-center gap-2">
                  <h3 className="text-xl">Road</h3>
                  <input
                    type="radio" name="shippingType" value="ROAD"
                    checked={parcelInfo.shippingType === 'ROAD'}
                    onChange={() => setShippingType('ROAD')}
                  />
                </section>
                <section>
                  <h3 className="text-xl">type multiplier</h3>
                  <p>1.0x</p>
                </section>
              </section>

              <section className="flex justify-between">
                <section className="flex items-center gap-2">
                  <h3 className="text-xl">RailWay</h3>
                  <input
                    type="radio" name="shippingType" value="RAILWAY"
                    checked={parcelInfo.shippingType === 'RAILWAY'}
                    onChange={() => setShippingType('RAILWAY')}
                  />
                </section>
                <section>
                  <h3 className="text-xl">type multiplier</h3>
                  <p>0.85x</p>
                </section>
              </section>

              <section className="flex justify-between">
                <section className="flex items-center gap-2">
                  <h3 className="text-xl">Air</h3>
                  <input
                    type="radio" name="shippingType" value="AIR"
                    checked={parcelInfo.shippingType === 'AIR'}
                    onChange={() => setShippingType('AIR')}
                  />
                </section>
                <section>
                  <h3 className="text-xl">type multiplier</h3>
                  <p>1.6x</p>
                </section>
              </section>
            </section>
          )}

          {step === 3 && (
            <div className="p-4 border rounded-xl min-h-28">
              <h2 className="text-lg font-semibold mb-2">Calculator</h2>

              <input
                readOnly
                value={`Volumetric ${breakdown.volumetricWeight}kg → Chargeable ${breakdown.chargeableWeight}kg; Base = ${breakdown.base.toFixed(2)}`}
                className="border p-2 w-full mb-2"
              />
              <input
                readOnly
                value={`× Type (${parcelInfo.shippingType}=${breakdown.typeMultiplier}) × Distance (${breakdown.distanceFactor})`}
                className="border p-2 w-full mb-2"
              />
              <input
                readOnly
                value={`Fuel = ${breakdown.fuelSurcharge.toFixed(2)}; Remote = ${breakdown.remoteSurcharge.toFixed(2)}; Insurance = ${breakdown.insurance.toFixed(2)}`}
                className="border p-2 w-full mb-2"
              />
              <input
                readOnly
                value={`TOTAL = ${breakdown.total.toFixed(2)}`}
                className="border p-2 w-full"
              />
            </div>
          )}

          {step === 4 && (
            <div className="p-4 border rounded-xl min-h-28">
              <h2 className="text-lg font-semibold mb-2">Summary & Submit</h2>
              <input
                readOnly
                value={`Type: ${parcelInfo.parcel.kind}, ${parcelInfo.parcel.weightKg}kg, ${parcelInfo.parcel.lengthCm}×${parcelInfo.parcel.widthCm}×${parcelInfo.parcel.heightCm}cm, Declared $${parcelInfo.parcel.declaredValue}`}
                className="border p-2 w-full mb-2"
              />
              <input
                readOnly
                value={`Route: ${parcelInfo.route.origin.country}/${parcelInfo.route.origin.city} → ${parcelInfo.route.destination.country}/${parcelInfo.route.destination.city}`}
                className="border p-2 w-full mb-2"
              />
              <input
                readOnly
                value={`Shipping: ${parcelInfo.shippingType} | Estimate: $${parcelInfo.priceEstimate.toFixed(2)}`}
                className="border p-2 w-full"
              />
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button
              onClick={back}
              disabled={step === 0}
              className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
              type="button"
            >
              back
            </Button>
            <Button type="submit">
              {step === steps.length - 1 ? "Submit" : "next"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
