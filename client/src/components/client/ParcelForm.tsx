import { useEffect, useRef, useState } from "react";
import { Button } from "../commons/Button";
import Stepper from "../commons/Stepper";
import { Input } from "../commons/Input";
import { useGSAP } from "@gsap/react";
import { PricingService } from "../../services/PricingService";
import gsap from "gsap";
import { Select, Option } from "../commons/Select";
import { useGetCompanies } from "../../api/useCompany";
import type { CompanyCreate, ShippingType } from "../../types/Types";
import { toNumOrNull, n } from "../../utils/utils";
const steps = ['Parcel Details', 'Route', 'Shipping Type', 'Calculator', 'Summary & Submit'];



const ParcelForm = () => {
  
  gsap.registerPlugin(useGSAP);
  const [step, setStep] = useState(0);
  const back = () => {setStep(s => Math.max(0, s - 1))}
  const next = () => {setStep(s => Math.min(steps.length - 1, s + 1))}
  const secRef = useRef<HTMLDivElement | null>(null);
  useGSAP(
    () => {
      const el = secRef.current;
      if (!el) return;

      gsap.killTweensOf(el);

      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 8, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    },
    { dependencies: [step], scope: secRef }
  );
  const [ declearedValue, setDeclearedValue ] = useState<number | null>(null);
  const [ shippingType, setShippingType ] = useState<ShippingType | string>('');
  const [ weightKg, setWeightKg ] = useState<number | null>(null);
  const [ volumetricData, setVolumetricData ] = useState<{width: number | null, height: number | null, length: number | null}>({
    width: null,
    height: null,
    length: null,
  });

  const [ volumetricWeight, setVolumetricWeight ] = useState<number>(0);
  const [ chargableWeight, setChargableWeight ] = useState<number>(0)
  const [ typeMultiplier, setTypeMultipliers ] = useState<number>(0);
  const [ base, setBase ] = useState<number>(0);
  const [ fuelSurcharge, setFuelSurcharge ] = useState<number>(0);
  const [ remoteSurcharge, setRemoteSurcharge ] = useState<number>(0);
  const [ incurance, setIncurance ] = useState<number>(0);
  const [ total, setTotal ] = useState<number>(0);
  const [ surcharges, setSurcharges ] = useState<number>(0);
  const [ distanceFactor, setDistanceFactor ] = useState<number>(0);

  const [ fromLocation, setFromLocation ] = useState<{ origin: { country: string, city: string }, pickUp: { country: string, city: string, line1: string, postalcode: number }}>({
    origin: { country: '', city: '' },
    pickUp: { country: '', city: '', line1: '', postalcode: 0 }
  });
  const [ toLocation, setToLocation ] = useState<{ origin: { country: string, city: string }, pickUp: { country: string, city: string, line1: string, postalcode: number }}>({
    origin: { country: '', city: '' },
    pickUp: { country: '', city: '', line1: '', postalcode: 0 }
  });

  const {  data: companies } = useGetCompanies();
  const [ companyData ] = useState<CompanyCreate[]>(companies);
  const [ selectedCompany, setSelectedCompany ] = useState<CompanyCreate | null>(null);
  
  const searchCompany = (companyName: string) => {
    const filteredCompany = companyData.filter(c => c.name === companyName);
    setSelectedCompany(filteredCompany[0]);
  }
  // useEffect(() => {
  //   setVolumetricWeight(
  //     PricingService.volumetricWeight({
  //       width: n(volumetricData.width),
  //       height: n(volumetricData.height),
  //       length: n(volumetricData.length),
  //     })
  //   );
  //   setChargableWeight(PricingService.chargableWeight({weight: n(weightKg), volumetricWeight: volumetricWeight}));
  //   setTypeMultipliers(
  //     PricingService.typeMultiplier(
  //       shippingType as ShippingType,
  //       {
  //         sea: selectedCompany?.pricing.typeMultipliers.SEA ?? 1,
  //         railway: selectedCompany?.pricing.typeMultipliers.RAILWAY ?? 1,
  //         road: selectedCompany?.pricing.typeMultipliers.ROAD ?? 1,
  //         air: selectedCompany?.pricing.typeMultipliers.AIR ?? 1,
  //       }
  //     ) ?? 1
  //   );
  //   setBase(
  //     PricingService.base(
  //       selectedCompany?.pricing.basePrice ?? 0,
  //       selectedCompany?.pricing.pricePerKg ?? 0,
  //       chargableWeight
  //     )
  //   );
  //   setFuelSurcharge( PricingService.fuelSurcharge(base, selectedCompany?.pricing.fuelPct ?? 0));
  //   setRemoteSurcharge( PricingService.remoteSurcharge(base, selectedCompany?.pricing.remoteAreaPct ?? 0) );
  //   setSurcharges( remoteSurcharge + fuelSurcharge );
  //   setDistanceFactor(PricingService.distanceFactor(fromLocation.origin.country, toLocation.origin.country));
  //   setIncurance( PricingService.insurance(n(declearedValue), selectedCompany?.pricing.insurancePct ?? 0) );
  //   setTotal(PricingService.total(base, typeMultiplier, distanceFactor, surcharges, incurance ))
  // }, [volumetricData, weightKg, chargableWeight, selectedCompany, base, declearedValue, shippingType, typeMultiplier])
    useEffect(() => {
    const width = n(volumetricData.width);
    const height = n(volumetricData.height);
    const length = n(volumetricData.length);
    const weight = n(weightKg);
    const declared = n(declearedValue);

    const volW = PricingService.volumetricWeight({ width, height, length });
    const chW = PricingService.chargableWeight({ weight, volumetricWeight: volW });

    const tm =
      PricingService.typeMultiplier(shippingType as ShippingType, {
        sea: selectedCompany?.pricing.typeMultipliers.SEA ?? 1,
        railway: selectedCompany?.pricing.typeMultipliers.RAILWAY ?? 1,
        road: selectedCompany?.pricing.typeMultipliers.ROAD ?? 1,
        air: selectedCompany?.pricing.typeMultipliers.AIR ?? 1,
      }) ?? 1;

    const baseLocal = PricingService.base(
      selectedCompany?.pricing.basePrice ?? 0,
      selectedCompany?.pricing.pricePerKg ?? 0,
      chW
    );

    const fuel = PricingService.fuelSurcharge(
      baseLocal,
      selectedCompany?.pricing.fuelPct ?? 0
    );
    const remote = PricingService.remoteSurcharge(
      baseLocal,
      selectedCompany?.pricing.remoteAreaPct ?? 0
    );
    const sur = fuel + remote;

    const df = PricingService.distanceFactor(
      fromLocation.origin.country,
      toLocation.origin.country
    );

    const ins = PricingService.insurance(
      declared,
      selectedCompany?.pricing.insurancePct ?? 0
    );

    const totalLocal = PricingService.total(baseLocal, tm, df, sur, ins);
    
    setVolumetricWeight(volW);
    setChargableWeight(chW);
    setTypeMultipliers(tm);
    setBase(baseLocal);
    setFuelSurcharge(fuel);
    setRemoteSurcharge(remote);
    setSurcharges(sur);
    setDistanceFactor(df);
    setIncurance(ins);
    setTotal(totalLocal);
  }, [
    volumetricData,
    weightKg,
    declearedValue,
    shippingType,
    selectedCompany,
    fromLocation.origin.country,
    toLocation.origin.country,
  ]);

  const handeCreateRequest = () => {
    
  }
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl fonst-semibold">select company for transfer</h1>
        <Select  onChange={e => searchCompany(e.target.value)}>
          { !selectedCompany && (<option>select company</option>)}
          {companies.map((c : CompanyCreate) => (
            <option key={c.contactEmail} value={c.name}> {c.name} </option>
          ))}
        </Select>
      </div>
      <Stepper steps={steps} current={step} />
      <form onSubmit={handeCreateRequest} className="p-4 border rounded-xl min-h-28 flex flex-col justify-center">
        <div ref={secRef} key={step} className="w-full">
          {step === 0 && (
            <section className="bg-white flex flex-col justify-center gap-3 mx-auto py-10 px-5 rounded-xl min-h-28">
              <h2 className="text-2xl font-semibold">Details:</h2>

              <section className="grid-cols-2 grid gap-2">
                <section className="flex flex-col gap-2 ">
                  <label>Parcel Weight</label>
                  <Input value={weightKg ?? ''} onChange={e => setWeightKg(toNumOrNull(e.target.value))} type="number" placeholder="kg" />
                </section>
                <section className="flex flex-col gap-2">
                  <label>Parcel Type</label>
                  <Select>
                    <Option>DOCUMENTS</Option>
                    <Option>GOODS</Option>
                  </Select>
                </section>
              </section>

              <section className="grid grid-cols-2 gap-2">
                <section className="flex flex-col col-span-2 gap-2">
                  <label>Width in cm:</label>
                  <Input value={volumetricData.width ?? ''} onChange={e => setVolumetricData({...volumetricData, width: toNumOrNull(e.target.value)})} type="number" placeholder="width = 23" />
                </section>
                <section className="flex flex-col gap-2">
                  <label>Height in cm:</label>
                  <Input value={volumetricData.height ?? ''} onChange={e => setVolumetricData({...volumetricData, height: toNumOrNull(e.target.value)})} type="text" placeholder="height = 5" />
                </section>
                <section className="flex flex-col gap-2">
                  <label>Length in cm:</label>
                  <Input value={volumetricData.length ?? ''} onChange={e => setVolumetricData({...volumetricData, length: toNumOrNull(e.target.value)})} type="text" placeholder="length = 132" />
                </section>
              </section>

              <section className="flex flex-col ">
                <label htmlFor="">Decleared Value</label>
                <Input value={declearedValue ?? ''} onChange={e => setDeclearedValue(toNumOrNull(e.target.value))} type="text" placeholder="30$"/>
              </section>
            </section>
          )}

          {step === 1 && (
            <section className="p-4 border rounded-xl min-h-28 bg-white flex flex-col justify-center gap-3 mx-auto py-10 px-5 rounded-xl">
              <h2 className="text-2xl font-semibold">Route:</h2>
              <section className="grid grid-cols-2 gap-2 items-center">
                <section className="flex flex-col gap-2">
                  <label className=" text-lg ">Origin</label>
                  <Input value={fromLocation.origin.country} onChange={e => setFromLocation(p => ({...p, origin: {...p.origin, country: e.target.value}}))} placeholder="country"/>
                  <Input value={fromLocation.origin.city} onChange={e => setFromLocation(p => ({...p, origin: {...p.origin, city: e.target.value}}))} placeholder="city"/>
                </section>
                <section className="flex flex-col gap-2">
                  <label className=" text-lg ">Pickup address</label>
                  <section className="grid grid-cols-2 gap-3">
                    <Input value={fromLocation.pickUp.country} onChange={e => setFromLocation(p => ({...p, pickUp: {...p.pickUp, country: e.target.value}}))} placeholder="country"/>
                    <Input value={fromLocation.pickUp.city} onChange={e => setFromLocation(p => ({...p, pickUp: {...p.pickUp, city: e.target.value}}))} placeholder="city"/>
                    <Input value={fromLocation.pickUp.line1} onChange={e => setFromLocation(p => ({...p, pickUp: {...p.pickUp, line1: e.target.value}}))} placeholder="line1"/>
                    <Input value={fromLocation.pickUp.postalcode} onChange={e => setFromLocation(p => ({...p, pickUp: {...p.pickUp, postalcode: Number(e.target.value)}}))} placeholder="postalcode"/>
                  </section>
                </section>
                
              </section>
              <section className="grid grid-cols-2 gap-2 items-center">
                <section className="flex flex-col gap-2">
                  <label className="text-lg">Destination</label>
                  <Input value={toLocation.origin.country} onChange={e => setToLocation(p => ({...p, origin: {...p.origin, country: e.target.value}}))} placeholder="country"/>
                  <Input value={toLocation.origin.city} onChange={e => setToLocation(p => ({...p, origin: {...p.origin, city: e.target.value}}))} placeholder="city"/>
                </section>
                <section className="flex flex-col gap-2">
                  <label className=" text-lg ">delivery address</label>
                  <section className="grid grid-cols-2 gap-3">
                    <Input value={toLocation.pickUp.country} onChange={e => setToLocation(p => ({...p, pickUp: {...p.pickUp, country: e.target.value}}))} placeholder="country"/>
                    <Input value={toLocation.pickUp.city} onChange={e => setToLocation(p => ({...p, pickUp: {...p.pickUp, city: e.target.value}}))} placeholder="city"/>
                    <Input value={toLocation.pickUp.line1} onChange={e => setToLocation(p => ({...p, pickUp: {...p.pickUp, line1: e.target.value}}))} placeholder="line1"/>
                    <Input value={toLocation.pickUp.postalcode} onChange={e => setToLocation(p => ({...p, pickUp: {...p.pickUp, postalcode: Number(e.target.value)}}))} placeholder="postalcode"/>
                  </section>
                </section>
              </section>
            </section>
          )}

          {step === 2 && (
            <section className="bg-white flex flex-col justify-center gap-6 mx-auto py-10 px-5 rounded-xl min-h-28">
              <h2 className="text-2xl font-semibold">Shipping Type</h2>

              <section className="flex justify-between">
                {selectedCompany?.supportedTypes.includes('SEA') ? (
                  <>
                    <section className="flex items-center gap-2">
                      <h3 className="text-lg">SEA</h3>
                      <input onChange={e => setShippingType(e.target.value as ShippingType)} checked={shippingType === 'SEA'} type="radio" name="shippingType" value="SEA" />
                    </section>
                    <section className="flex gap-2 items-center">
                      <h3 className="">type multiplier:</h3>
                      <p>{selectedCompany?.pricing.typeMultipliers.SEA}x</p>
                    </section>
                  </>
                    
                  ) : (
                    <>
                      <section className="flex items-center gap-2">
                        <h3 className="text-xl opacity-50">SEA</h3>
                        <input type="radio" name="shippingType" value="SEA" disabled />
                      </section>
                      <section className="flex gap-2 items-center">
                        <h3 className="">type multiplier:</h3>
                        <p>none</p>
                      </section>
                    </>
                )}
              </section>

              <section className="flex justify-between">
                {selectedCompany?.supportedTypes.includes('ROAD') ? (
                  <>
                    <section className="flex items-center gap-2">
                      <h3 className="text-lg">ROAD</h3>
                      <input onChange={e => setShippingType(e.target.value as ShippingType)} checked={shippingType === 'ROAD'} type="radio" name="shippingType" value="ROAD" />
                    </section>
                    <section className="flex gap-2 items-center">
                      <h3 className="">type multiplier:</h3>
                      <p>{selectedCompany?.pricing.typeMultipliers.ROAD}x</p>
                    </section>
                  </>
                  ) : (
                    <>
                      <section className="flex items-center gap-2">
                        <h3 className="text-xl opacity-50">ROAD</h3>
                        <input type="radio" name="shippingType" value="ROAD" disabled />
                      </section>
                      <section className="flex gap-2 items-center">
                        <h3 className="">type multiplier:</h3>
                        <p>none</p>
                      </section>
                    </>
                    
                )}
              </section>

              <section className="flex justify-between">
                {selectedCompany?.supportedTypes.includes('RAILWAY') ? (
                  <>
                    <section className="flex items-center gap-2">
                      <h3 className="text-lg">RAILWAY</h3>
                      <input onChange={e => setShippingType(e.target.value as ShippingType)} checked={shippingType === 'RAILWAY'} type="radio" name="shippingType" value="RAILWAY" />
                    </section>
                    <section className="flex gap-2 items-center">
                      <h3 className="">type multiplier:</h3>
                      <p>{selectedCompany?.pricing.typeMultipliers.RAILWAY}x</p>
                    </section>
                  </>
                  ) : (
                    <>
                      <section className="flex items-center gap-2">
                        <h3 className="text-xl opacity-50">RAILWAY</h3>
                        <input type="radio" name="shippingType" value="RAILWAY" disabled />
                      </section>
                      <section className="flex gap-2 items-center">
                        <h3 className="">type multiplier:</h3>
                        <p>none</p>
                      </section>
                    </>
                )}
                
              </section>

              <section className="flex justify-between">
                {selectedCompany?.supportedTypes.includes('AIR') ? (
                  <>
                    <section className="flex items-center gap-2">
                      <h3 className="text-lg">AIR</h3>
                      <input onChange={e => setShippingType(e.target.value as ShippingType)} checked={shippingType === 'AIR'} type="radio" name="shippingType" value="AIR" />
                    </section>
                    <section className="flex gap-2 items-center">
                      <h3 className="">type multiplier:</h3>
                      <p>{selectedCompany?.pricing.typeMultipliers.AIR}x</p>
                    </section>
                  </>
                  ) : (
                    <>
                      <section className="flex items-center gap-2">
                        <h3 className="text-xl opacity-50">AIR</h3>
                        <input type="radio" name="shippingType" value="AIR" disabled />
                      </section>
                      <section className="flex gap-2 items-center">
                        <h3 className="">type multiplier:</h3>
                        <p>none</p>
                      </section>
                    </>
                )}
              </section>
            </section>
          )}

          {step === 3 && (
            <div className="p-4 border rounded-xl min-h-28 flex flex-col gap-5">
              <h2 className="text-2xl font-semibold mb-2">Calculator</h2>
              <section>
                <p>volumetricWeight = {volumetricWeight} kg</p>
                <p>chargableWeight = {chargableWeight} kg</p>
                <p>distance factor = {distanceFactor}x</p>
                <p>type multiplier = {shippingType} - {typeMultiplier}x</p>
                <p>base = {base}$</p>
                <p>fuelSurcharge = {fuelSurcharge}$</p>
                <p>remoteSurcharge = {remoteSurcharge}$</p>
                <p>incurance = {incurance}$</p>
              </section>
              <p className="text-2xl font-semibold">total = {total}$</p>
            </div>
          )}

          {step === 4 && (
            <div className="p-4 border rounded-xl min-h-28">
              <h2 className="text-lg font-semibold mb-2">Summary & Submit</h2>
              <input placeholder="Review details…" className="border p-2 w-full mb-2" />
              <input placeholder="Notes" className="border p-2 w-full" />
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <Button
              onClick={back}
              disabled={step === 0}
              className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              back
            </Button>
            <Button onClick={next} type="submit">
              {step === steps.length - 1 ? "Submit" : "next"}
            </Button>
          </div>
        </div>
      </form>
    </>

    
  );
}
export default ParcelForm