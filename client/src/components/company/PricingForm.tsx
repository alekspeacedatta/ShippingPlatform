import { useEffect, useMemo, useState } from 'react';
import { useGetCompany, usePricingUpdate } from '../../api/useCompany';
import { useCompanyStore } from '../../store/useCompanyStore';
import type { Company, Pricing } from '../../types/Types';
import { Button } from '../commons/Button';
import { Input } from '../commons/Input';

const EMPTY_PRICING: Pricing = {
  basePrice: 0,
  pricePerKg: 0,
  fuelPct: 0,
  insurancePct: 0,
  typeMultipliers: { SEA: 1, RAILWAY: 1, ROAD: 1, AIR: 1 },
  remoteAreaPct: 0,
};

export type Banner = { type: 'success' | 'error'; text: string };

type Props = { onResult?: (b: Banner | null) => void };

type FieldErrors = Partial<{
  basePrice: string;
  pricePerKg: string;
  fuelPct: string;
  insurancePct: string;
  remoteAreaPct: string;
  SEA: string;
  AIR: string;
  RAILWAY: string;
  ROAD: string;
}>;

const PricingForm = ({ onResult }: Props) => {
  const companyId = useCompanyStore((s) => s.companyInfo?.companyId);
  const { data, isLoading, isError, error } = useGetCompany(companyId ?? '');
  const { mutate, isPending } = usePricingUpdate();

  const [updatedPricing, setUpdatedPricing] = useState<Pricing>(EMPTY_PRICING);
  const [initialPricing, setInitialPricing] = useState<Pricing>(EMPTY_PRICING);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (data) {
      const company = data as Company;
      setUpdatedPricing(company.pricing);
      setInitialPricing(company.pricing);
      setErrors({});
    }
  }, [data]);

  const isDirty = useMemo(() => {
    const p = updatedPricing,
      i = initialPricing;
    return (
      p.basePrice !== i.basePrice ||
      p.pricePerKg !== i.pricePerKg ||
      p.fuelPct !== i.fuelPct ||
      p.insurancePct !== i.insurancePct ||
      p.remoteAreaPct !== i.remoteAreaPct ||
      p.typeMultipliers.SEA !== i.typeMultipliers.SEA ||
      p.typeMultipliers.AIR !== i.typeMultipliers.AIR ||
      p.typeMultipliers.RAILWAY !== i.typeMultipliers.RAILWAY ||
      p.typeMultipliers.ROAD !== i.typeMultipliers.ROAD
    );
  }, [updatedPricing, initialPricing]);

  const validate = (p: Pricing): FieldErrors => {
    const e: FieldErrors = {};
    const isFiniteNum = (n: number) => Number.isFinite(n);
    if (!isFiniteNum(p.basePrice) || p.basePrice < 0) e.basePrice = 'Must be ≥ 0';
    if (!isFiniteNum(p.pricePerKg) || p.pricePerKg <= 0) e.pricePerKg = 'Must be > 0';
    const pctBad = (v: number) => !isFiniteNum(v) || v < 0 || v > 100;
    if (pctBad(p.fuelPct)) e.fuelPct = '0–100';
    if (pctBad(p.insurancePct)) e.insurancePct = '0–100';
    if (pctBad(p.remoteAreaPct)) e.remoteAreaPct = '0–100';
    const multBad = (v: number) => !isFiniteNum(v) || v <= 0;
    if (multBad(p.typeMultipliers.SEA)) e.SEA = 'Must be > 0';
    if (multBad(p.typeMultipliers.AIR)) e.AIR = 'Must be > 0';
    if (multBad(p.typeMultipliers.RAILWAY)) e.RAILWAY = 'Must be > 0';
    if (multBad(p.typeMultipliers.ROAD)) e.ROAD = 'Must be > 0';
    return e;
  };

  const setField = <K extends keyof Pricing>(key: K, value: Pricing[K]) => {
    setUpdatedPricing((prev) => ({ ...prev, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    onResult?.(null);
  };

  const setMultiplier = (key: keyof Pricing['typeMultipliers'], value: number) => {
    setUpdatedPricing((prev) => ({
      ...prev,
      typeMultipliers: { ...prev.typeMultipliers, [key]: value },
    }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    onResult?.(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isDirty) return;

    const v = validate(updatedPricing);
    if (Object.keys(v).length) {
      setErrors(v);
      onResult?.({ type: 'error', text: 'Please fix the highlighted fields.' });
      return;
    }
    if (!companyId) {
      onResult?.({ type: 'error', text: 'Company not found.' });
      return;
    }

    mutate(
      { companyId, pricing: updatedPricing },
      {
        onSuccess: () => {
          setInitialPricing(updatedPricing);
          setErrors({});
          onResult?.({ type: 'success', text: 'Pricing updated successfully.' });
        },
        onError: (err) => {
          // @ts-expect-error
          const serverErrors: Record<string, string> | undefined = err?.response?.data?.errors;
          if (serverErrors && typeof serverErrors === 'object') {
            const next: FieldErrors = {};
            Object.entries(serverErrors).forEach(([k, msg]) => {
              if (k.endsWith('basePrice')) next.basePrice = String(msg);
              else if (k.endsWith('pricePerKg')) next.pricePerKg = String(msg);
              else if (k.endsWith('fuelPct')) next.fuelPct = String(msg);
              else if (k.endsWith('insurancePct')) next.insurancePct = String(msg);
              else if (k.endsWith('remoteAreaPct')) next.remoteAreaPct = String(msg);
              else if (k.endsWith('typeMultipliers.SEA') || k.endsWith('SEA')) next.SEA = String(msg);
              else if (k.endsWith('typeMultipliers.AIR') || k.endsWith('AIR')) next.AIR = String(msg);
              else if (k.endsWith('typeMultipliers.RAILWAY') || k.endsWith('RAILWAY')) next.RAILWAY = String(msg);
              else if (k.endsWith('typeMultipliers.ROAD') || k.endsWith('ROAD')) next.ROAD = String(msg);
            });
            if (Object.keys(next).length) setErrors(next);
          }
          // @ts-expect-error
          const msg = err?.response?.data?.message || err?.message || 'Failed to update pricing. Please try again.';
          onResult?.({ type: 'error', text: msg });
        },
      },
    );
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message}</p>;
  if (!data) return <p>Company not found.</p>;

  const errorClass = 'ring-2 ring-red-300 border-red-300';
  const help = (m?: string) => (m ? <p className="mt-1 text-xs sm:text-sm text-red-600">{m}</p> : null);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border bg-white p-4 sm:p-5">
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col min-w-0">
          <label className="text-sm font-medium">Base Price</label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={String(updatedPricing.basePrice)}
            onChange={(e) => setField('basePrice', Number(e.target.value))}
            className={`w-full ${errors.basePrice ? errorClass : ''}`}
            aria-invalid={!!errors.basePrice}
          />
          {help(errors.basePrice)}
        </div>
        <div className="flex flex-col min-w-0">
          <label className="text-sm font-medium">Price per Kg</label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={String(updatedPricing.pricePerKg)}
            onChange={(e) => setField('pricePerKg', Number(e.target.value))}
            className={`w-full ${errors.pricePerKg ? errorClass : ''}`}
            aria-invalid={!!errors.pricePerKg}
          />
          {help(errors.pricePerKg)}
        </div>
      </section>

      <div className="flex flex-col min-w-0">
        <label className="text-sm font-medium">Fuel %</label>
        <Input
          type="number"
          min={0}
          max={100}
          step="0.01"
          value={String(updatedPricing.fuelPct)}
          onChange={(e) => setField('fuelPct', Number(e.target.value))}
          className={`w-full ${errors.fuelPct ? errorClass : ''}`}
          aria-invalid={!!errors.fuelPct}
        />
        {help(errors.fuelPct)}
      </div>

      <h2 className="text-lg sm:text-xl font-semibold">Type multipliers</h2>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['SEA', 'AIR', 'RAILWAY', 'ROAD'] as const).map((key) => (
          <div key={key} className="flex flex-col min-w-0">
            <label className="text-sm font-medium">{key}</label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={String(updatedPricing.typeMultipliers[key])}
              onChange={(e) => setMultiplier(key, Number(e.target.value))}
              className={`w-full ${errors[key] ? errorClass : ''}`}
              aria-invalid={!!errors[key]}
            />
            {help(errors[key])}
          </div>
        ))}
      </section>

      <div className="flex flex-col min-w-0">
        <label className="text-sm font-medium">Insurance %</label>
        <Input
          type="number"
          min={0}
          max={100}
          step="0.01"
          value={String(updatedPricing.insurancePct)}
          onChange={(e) => setField('insurancePct', Number(e.target.value))}
          className={`w-full ${errors.insurancePct ? errorClass : ''}`}
          aria-invalid={!!errors.insurancePct}
        />
        {help(errors.insurancePct)}
      </div>

      <div className="flex flex-col min-w-0">
        <label className="text-sm font-medium">Remote area %</label>
        <Input
          type="number"
          min={0}
          max={100}
          step="0.01"
          value={String(updatedPricing.remoteAreaPct)}
          onChange={(e) => setField('remoteAreaPct', Number(e.target.value))}
          className={`w-full ${errors.remoteAreaPct ? errorClass : ''}`}
          aria-invalid={!!errors.remoteAreaPct}
        />
        {help(errors.remoteAreaPct)}
      </div>

      <Button className="mt-2 w-full sm:w-auto" type="submit" disabled={isPending || !isDirty}>
        {isPending ? 'Saving…' : 'Save'}
      </Button>
    </form>
  );
};

export default PricingForm;
