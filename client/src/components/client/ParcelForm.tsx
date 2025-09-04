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
  const [ declearedValue, setDeclearedValue ] = useState<number>(0);
  const [ shippingType, setShippingType ] = useState<ShippingType>('SEA');
  const [ weightKg, setWeightKg ] = useState<number>(0);
  const [ volumetricData, setVolumetricData ] = useState<{width: number, height: number, length: number}>({
    width: 0,
    height: 0,
    length: 0,
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

  const {  data: companies } = useGetCompanies();
  const [ companyData ] = useState<CompanyCreate[]>(companies);
  const [ selectedCompany, setSelectedCompany ] = useState<CompanyCreate | null>(null);
  
  const searchCompany = (companyName: string) => {
    const filteredCompany = companyData.filter(c => c.name === companyName);
    setSelectedCompany(filteredCompany[0]);
  }
  useEffect(() => {
    setVolumetricWeight(PricingService.volumetricWeight(volumetricData));
    setChargableWeight(PricingService.chargableWeight({weight: weightKg, volumetricWeight: volumetricWeight}));
    setTypeMultipliers(PricingService.typeMultiplier(shippingType, {sea: selectedCompany?.pricing.typeMultipliers.SEA, railway: selectedCompany?.pricing.typeMultipliers.RAILWAY, road: selectedCompany?.pricing.typeMultipliers.ROAD, air: selectedCompany?.pricing.typeMultipliers.AIR}))
    setBase(PricingService.base(selectedCompany?.pricing.basePrice, selectedCompany?.pricing.pricePerKg, chargableWeight));
    setFuelSurcharge(PricingService.fuelSurcharge(base, selectedCompany?.pricing.fuelPct));
    setRemoteSurcharge(PricingService.remoteSurcharge(base, selectedCompany?.pricing.remoteAreaPct));
    setSurcharges( remoteSurcharge + fuelSurcharge );
    setIncurance(PricingService.insurance(declearedValue, selectedCompany?.pricing.insurancePct));
    setTotal(PricingService.total(base, typeMultiplier, 32, surcharges, incurance ))
  }, [volumetricData, weightKg, chargableWeight, selectedCompany, base, declearedValue, shippingType, typeMultiplier])
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
                  <Input onChange={e => setWeightKg(Number(e.target.value))} type="number" placeholder="kg" />
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
                  <Input onChange={e => setVolumetricData({...volumetricData, width: Number(e.target.value)})} type="number" placeholder="width = 23" />
                </section>
                <section className="flex flex-col gap-2">
                  <label>Height in cm:</label>
                  <Input onChange={e => setVolumetricData({...volumetricData, height: Number(e.target.value)})} type="text" placeholder="height = 5" />
                </section>
                <section className="flex flex-col gap-2">
                  <label>Length in cm:</label>
                  <Input onChange={e => setVolumetricData({...volumetricData, length: Number(e.target.value)})} type="text" placeholder="length = 132" />
                </section>
              </section>

              <section className="flex flex-col ">
                <label htmlFor="">Decleared Value</label>
                <Input onChange={e => setDeclearedValue(Number(e.target.value))} type="text" placeholder="30$"/>
              </section>
            </section>
          )}

          {step === 1 && (
            <section className="p-4 border rounded-xl min-h-28 bg-white flex flex-col justify-center gap-3 mx-auto py-10 px-5 rounded-xl">
              <h2 className="text-2xl font-semibold">Route:</h2>
              <section className="grid grid-cols-2 gap-2 items-center">
                <section className="flex flex-col gap-2">
                  <label className=" text-lg ">Origin</label>
                  <Input placeholder="country"/>
                  <Input placeholder="city"/>
                </section>
                <section className="flex flex-col gap-2">
                  <label className=" text-lg ">Pickup address</label>
                  <section className="grid grid-cols-2 gap-3">
                    <Input placeholder="country"/>
                    <Input placeholder="city"/>
                    <Input placeholder="line1"/>
                    <Input placeholder="postalcode"/>
                  </section>
                </section>
                
              </section>
              <section className="grid grid-cols-2 gap-2 items-center">
                <section className="flex flex-col gap-2">
                  <label className="text-lg">Destination</label>
                  <Input placeholder="country"/>
                  <Input placeholder="city"/>
                </section>
                <section className="flex flex-col gap-2">
                  <label className=" text-lg ">delivery address</label>
                  <section className="grid grid-cols-2 gap-3">
                    <Input placeholder="country"/>
                    <Input placeholder="city"/>
                    <Input placeholder="line1"/>
                    <Input placeholder="postalcode"/>
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