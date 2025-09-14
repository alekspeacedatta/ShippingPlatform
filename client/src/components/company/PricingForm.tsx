import { useEffect, useState } from 'react'
import { useGetCompany, usePricingUpdate } from '../../api/useCompany'
import { useCompanyStore } from '../../store/useCompanyStore'
import type { Company, Pricing } from '../../types/Types'
import { Button } from '../commons/Button'
import { Input } from '../commons/Input'

const EMPTY_PRICING: Pricing = {
  basePrice: 0,
  pricePerKg: 0,
  fuelPct: 0,
  insurancePct: 0,
  typeMultipliers: { SEA: 1, RAILWAY: 1, ROAD: 1, AIR: 1 },
  remoteAreaPct: 0,
}

const PricingForm = () => {
  const companyId = useCompanyStore((s) => s.companyInfo?.companyId)

  const { data, isLoading, isError, error } = useGetCompany(companyId ?? '')
  const { mutate, isPending } = usePricingUpdate()

  const [updatedPricing, setUpdatedPricing] = useState<Pricing>(EMPTY_PRICING)

  useEffect(() => {
    if (data) {
      const company = data as Company
      setUpdatedPricing(company.pricing)
    }
  }, [data])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!companyId) return
    mutate({ companyId, pricing: updatedPricing })
  }

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error: {error?.message}</p>
  if (!data) return <p>Company not found.</p>

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-3 rounded-lg border bg-white p-4'>
      <section className='grid grid-cols-2 gap-2'>
        <div className='flex flex-col'>
          <label>Base Price</label>
          <Input
            type='number'
            value={String(updatedPricing.basePrice)}
            onChange={(e) => setUpdatedPricing((p) => ({ ...p, basePrice: Number(e.target.value) }))}
          />
        </div>
        <div className='flex flex-col'>
          <label>Price per Kg</label>
          <Input
            type='number'
            value={String(updatedPricing.pricePerKg)}
            onChange={(e) => setUpdatedPricing((p) => ({ ...p, pricePerKg: Number(e.target.value) }))}
          />
        </div>
      </section>

      <div className='flex flex-col'>
        <label>Fuel %</label>
        <Input
          type='number'
          step='0.01'
          value={String(updatedPricing.fuelPct)}
          onChange={(e) => setUpdatedPricing((p) => ({ ...p, fuelPct: Number(e.target.value) }))}
        />
      </div>

      <h2 className='text-xl font-semibold'>Type multipliers</h2>
      <section className='grid grid-cols-2 gap-2'>
        <div className='flex flex-col'>
          <label>SEA</label>
          <Input
            type='number'
            step='0.01'
            value={String(updatedPricing.typeMultipliers.SEA)}
            onChange={(e) =>
              setUpdatedPricing((p) => ({
                ...p,
                typeMultipliers: { ...p.typeMultipliers, SEA: Number(e.target.value) },
              }))
            }
          />
        </div>
        <div className='flex flex-col'>
          <label>AIR</label>
          <Input
            type='number'
            step='0.01'
            value={String(updatedPricing.typeMultipliers.AIR)}
            onChange={(e) =>
              setUpdatedPricing((p) => ({
                ...p,
                typeMultipliers: { ...p.typeMultipliers, AIR: Number(e.target.value) },
              }))
            }
          />
        </div>
        <div className='flex flex-col'>
          <label>RAILWAY</label>
          <Input
            type='number'
            step='0.01'
            value={String(updatedPricing.typeMultipliers.RAILWAY)}
            onChange={(e) =>
              setUpdatedPricing((p) => ({
                ...p,
                typeMultipliers: { ...p.typeMultipliers, RAILWAY: Number(e.target.value) },
              }))
            }
          />
        </div>
        <div className='flex flex-col'>
          <label>ROAD</label>
          <Input
            type='number'
            step='0.01'
            value={String(updatedPricing.typeMultipliers.ROAD)}
            onChange={(e) =>
              setUpdatedPricing((p) => ({
                ...p,
                typeMultipliers: { ...p.typeMultipliers, ROAD: Number(e.target.value) },
              }))
            }
          />
        </div>
      </section>

      <div className='flex flex-col'>
        <label>Insurance %</label>
        <Input
          type='number'
          step='0.01'
          value={String(updatedPricing.insurancePct)}
          onChange={(e) => setUpdatedPricing((p) => ({ ...p, insurancePct: Number(e.target.value) }))}
        />
      </div>

      <div className='flex flex-col'>
        <label>Remote area %</label>
        <Input
          type='number'
          step='0.01'
          value={String(updatedPricing.remoteAreaPct)}
          onChange={(e) => setUpdatedPricing((p) => ({ ...p, remoteAreaPct: Number(e.target.value) }))}
        />
      </div>

      <Button className='mt-3' type='submit' disabled={isPending}>
        {isPending ? 'Saving…' : 'Save'}
      </Button>
    </form>
  )
}

export default PricingForm
