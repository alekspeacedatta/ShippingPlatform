import { useState } from "react";
import { useGetCompany } from "../../api/useCompany"
import { useCompanyStore } from "../../store/useCompanyStore"
import type { Company } from "../../types/Types";
import { Button } from "../commons/Button";
import { Input } from "../commons/Input";

const PricingForm = () => {
    const companyId = useCompanyStore(state => state.companyInfo?.companyId);
    const { data, isLoading, isError, error } = useGetCompany(companyId!)
    if(isLoading) return <p>Loading...</p>
    if(isError) return <p>Error: {error.message}</p>
    if(!data) return <p>parcel does not exsist</p>
    
    const company : Company = data;

    const [ updatedPricing, setUpdatedPricing ] = useState<{
        basePrice: Number, 
        pricePerKg: Number, 
        fuelPct: Number, 
        insurancePct: Number, 
        typeMultipliers: {
          SEA: Number, 
          RAILWAY: Number, 
          ROAD: Number, 
          AIR: Number,
        }
        remoteAreaPct: Number
      }
    >({...company.pricing})
    const handleSubmit = () => {

    }
    return (
      <form onSubmit={handleSubmit} className="border rounded-lg p-4 flex flex-col gap-3 bg-white">
        <section className="grid grid-cols-2 gap-2">
          <section className="flex flex-col">
            <label htmlFor="">Base Price</label>
            <Input value={String(updatedPricing.basePrice)} onChange={e => setUpdatedPricing({ ...updatedPricing, basePrice: Number(e.target.value) })}/>
          </section>
          <section className="flex flex-col">
            <label htmlFor="">Price perKg</label>
            <Input value={String(updatedPricing.pricePerKg)} onChange={e => setUpdatedPricing({ ...updatedPricing, pricePerKg: Number(e.target.value) })} />
          </section>
        </section>
        <section className="flex flex-col">
          <label htmlFor="">Fuel Ptc</label>
          <Input value={String(updatedPricing.fuelPct)} onChange={e => setUpdatedPricing({ ...updatedPricing, fuelPct: Number(e.target.value) })}/>
        </section>
        <h2 className="text-xl font-semibold">type multipliers</h2>
        <section className="grid grid-cols-2 gap-2">
          <section className="flex flex-col">
            <label htmlFor="">SEA</label>
            <Input value={String(updatedPricing.typeMultipliers.SEA)} onChange={e => setUpdatedPricing({ ...updatedPricing, typeMultipliers: {...updatedPricing.typeMultipliers, SEA:  Number(e.target.value)} })}/>
          </section>
          <section className="flex flex-col">
            <label htmlFor="">AIR</label>
            <Input value={String(updatedPricing.typeMultipliers.AIR)} onChange={e => setUpdatedPricing({ ...updatedPricing, typeMultipliers: {...updatedPricing.typeMultipliers, AIR:  Number(e.target.value)} })}/>
          </section>
          <section className="flex flex-col">
            <label htmlFor="">RailWay</label>
            <Input value={String(updatedPricing.typeMultipliers.RAILWAY)} onChange={e => setUpdatedPricing({ ...updatedPricing, typeMultipliers: {...updatedPricing.typeMultipliers, RAILWAY:  Number(e.target.value)} })}/>
          </section>
          <section className="flex flex-col">
            <label htmlFor="">Road</label>
            <Input value={String(updatedPricing.typeMultipliers.ROAD)} onChange={e => setUpdatedPricing({ ...updatedPricing, typeMultipliers: {...updatedPricing.typeMultipliers, ROAD:  Number(e.target.value)} })}/>
          </section>
        </section>
          <section className="flex flex-col">
            <label htmlFor="">incurance</label>
            <Input value={String(updatedPricing.insurancePct)} onChange={e => setUpdatedPricing({ ...updatedPricing, insurancePct: Number(e.target.value) })}/>
          </section>
          <section className="flex flex-col">
            <label htmlFor="">remote area ptc</label>
            
            <Input value={String(updatedPricing.remoteAreaPct)} onChange={e => setUpdatedPricing({ ...updatedPricing, remoteAreaPct: Number(e.target.value) })}/>
          </section>
          <Button className="mt-3" type="submit">save</Button>
      </form>
    )
}
export default PricingForm