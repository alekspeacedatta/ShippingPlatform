import { useEffect, useMemo, useRef, useState } from 'react';
import type { CompanyCreate, ShippingType } from '../../types/Types';
import { cn } from '../../utils/utils';
import { PricingService } from '../../services/PricingService';

type Props = {
  companies: CompanyCreate[];
  value: CompanyCreate | null;
  onChange: (c: CompanyCreate | null) => void;

 
  shippingType?: ShippingType | string;
  weightKg?: number | null;
  size?: { w?: number | null; h?: number | null; l?: number | null };
  declaredValue?: number | null;
  fromCountry?: string;
  toCountry?: string;
};


const money = (n: number) => `$${n.toFixed(2)}`;
const asPct = (v: number) => (v > 1 ? v / 100 : v); 
const pctStr = (v: number) => `${(asPct(v) * 100).toFixed(0)}%`;
const nearEq = (a: number, b: number) => Math.abs(a - b) < 1e-9;


function estimatePrice(
  c: CompanyCreate,
  opts: {
    shippingType?: string;
    weightKg?: number | null;
    size?: { w?: number | null; h?: number | null; l?: number | null };
    declaredValue?: number | null;
    fromCountry?: string;
    toCountry?: string;
  },
) {
  const { shippingType, weightKg, size, declaredValue, fromCountry = '', toCountry = '' } = opts;

  const weight = typeof weightKg === 'number' && weightKg > 0 ? weightKg : 1;
  const volumetric =
    size?.w && size?.h && size?.l
      ? PricingService.volumetricWeight({
          width: Number(size.w),
          height: Number(size.h),
          length: Number(size.l),
        })
      : 0;

  const chargeable = PricingService.chargableWeight({ weight, volumetricWeight: volumetric });

  const base = PricingService.base(c.pricing.basePrice, c.pricing.pricePerKg, chargeable);
  const fuel = PricingService.fuelSurcharge(base, c.pricing.fuelPct);
  const remote = PricingService.remoteSurcharge(base, c.pricing.remoteAreaPct);
  const surcharges = fuel + remote;
  const distance = PricingService.distanceFactor(fromCountry, toCountry);
  const insurance = PricingService.insurance(Number(declaredValue ?? 0), c.pricing.insurancePct);

  const totalFor = (t: ShippingType) =>
    Number((base * (c.pricing.typeMultipliers[t] || 1) * distance + surcharges + insurance).toFixed(2));

  if (shippingType && c.supportedTypes.includes(shippingType as ShippingType)) {
    return { total: totalFor(shippingType as ShippingType), usedType: shippingType as ShippingType };
  }

  
  let best: { total: number; usedType: ShippingType | null } = {
    total: Number.POSITIVE_INFINITY,
    usedType: null,
  };

  (c.supportedTypes as ShippingType[]).forEach((t) => {
    const val = totalFor(t);
    if (val < best.total) best = { total: val, usedType: t };
  });

  
  if (!best.usedType) best = { total: Number((base + surcharges + insurance).toFixed(2)), usedType: null };

  return best;
}

export default function CompanyPicker({
  companies,
  value,
  onChange,
  shippingType,
  weightKg,
  size,
  declaredValue,
  fromCountry,
  toCountry,
}: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  
  const rows = useMemo(() => {
    const r = companies.map((c) => {
      const est = estimatePrice(c, {
        shippingType,
        weightKg,
        size,
        declaredValue,
        fromCountry,
        toCountry,
      });
      return { company: c, estimate: est.total, usedType: est.usedType };
    });
    r.sort((a, b) => a.estimate - b.estimate);
    return r;
  }, [companies, shippingType, weightKg, size?.w, size?.h, size?.l, declaredValue, fromCountry, toCountry]);

  
  const mins = useMemo(() => {
    const m = {
      basePrice: Number.POSITIVE_INFINITY,
      pricePerKg: Number.POSITIVE_INFINITY,
      fuelPct: Number.POSITIVE_INFINITY,
      insurancePct: Number.POSITIVE_INFINITY,
      remoteAreaPct: Number.POSITIVE_INFINITY,
      SEA: Number.POSITIVE_INFINITY,
      ROAD: Number.POSITIVE_INFINITY,
      RAILWAY: Number.POSITIVE_INFINITY,
      AIR: Number.POSITIVE_INFINITY,
    };

    companies.forEach((c) => {
      const p = c.pricing;
      m.basePrice = Math.min(m.basePrice, p.basePrice);
      m.pricePerKg = Math.min(m.pricePerKg, p.pricePerKg);
      m.fuelPct = Math.min(m.fuelPct, p.fuelPct);
      m.insurancePct = Math.min(m.insurancePct, p.insurancePct);
      m.remoteAreaPct = Math.min(m.remoteAreaPct, p.remoteAreaPct);
      m.SEA = Math.min(m.SEA, p.typeMultipliers.SEA ?? m.SEA);
      m.ROAD = Math.min(m.ROAD, p.typeMultipliers.ROAD ?? m.ROAD);
      m.RAILWAY = Math.min(m.RAILWAY, p.typeMultipliers.RAILWAY ?? m.RAILWAY);
      m.AIR = Math.min(m.AIR, p.typeMultipliers.AIR ?? m.AIR);
    });

    return m;
  }, [companies]);

  
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (popRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const selected = value ? rows.find((r) => r.company._id === value._id) ?? null : null;

  return (
    <div className="relative w-full">
      {/* Trigger */}
      <button
        ref={btnRef}
        type="button"
        className={cn('w-full rounded-md border bg-white px-3 py-2 text-left shadow-sm', 'flex items-center justify-between gap-3')}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="min-w-0">
          <div className="truncate font-medium">{selected ? selected.company.name : 'Select company'}</div>
          <div className="truncate text-xs text-gray-500">
            {selected
              ? `Cheapest est: ${money(selected.estimate)}${selected.usedType ? ` · ${selected.usedType}` : ''}`
              : 'Pick a company to view pricing'}
          </div>
        </div>

        <svg className={cn('h-5 w-5 shrink-0 transition-transform', open ? 'rotate-180' : '')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={popRef}
          className="absolute left-0 right-0 z-20 mt-2 max-h-96 overflow-auto rounded-md border bg-white p-1 shadow-lg"
          role="listbox"
          tabIndex={-1}
        >
          {rows.length === 0 && <div className="px-3 py-2 text-sm text-gray-500">No companies</div>}

          {rows.map(({ company, estimate, usedType }) => {
            const p = company.pricing;
            const active = value?._id === company._id;

            const isMin = {
              basePrice: nearEq(p.basePrice, mins.basePrice),
              pricePerKg: nearEq(p.pricePerKg, mins.pricePerKg),
              fuelPct: nearEq(p.fuelPct, mins.fuelPct),
              insurancePct: nearEq(p.insurancePct, mins.insurancePct),
              remoteAreaPct: nearEq(p.remoteAreaPct, mins.remoteAreaPct),
              SEA: nearEq(p.typeMultipliers.SEA, mins.SEA),
              ROAD: nearEq(p.typeMultipliers.ROAD, mins.ROAD),
              RAILWAY: nearEq(p.typeMultipliers.RAILWAY, mins.RAILWAY),
              AIR: nearEq(p.typeMultipliers.AIR, mins.AIR),
            };

            const badge = (label: string, val: string | number, green: boolean) => (
              <div
                className={cn(
                  'rounded-md border px-2 py-1 text-[11px] sm:text-xs',
                  green ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-700',
                )}
              >
                <span className="mr-1 opacity-70">{label}</span>
                <span className="font-semibold">{val}</span>
              </div>
            );

            const chip = (t: ShippingType, supported: boolean, green: boolean) => (
              <div
                key={t}
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[10px] uppercase',
                  supported ? 'text-gray-600' : 'opacity-40',
                  green ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50',
                )}
                title={`${t} ×${p.typeMultipliers[t]}${supported ? '' : ' (unsupported)'}`}
              >
                {t} ×{p.typeMultipliers[t]}
              </div>
            );

            return (
              <button
                key={company._id || company.contactEmail || company.name}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(company);
                  setOpen(false);
                }}
                className={cn(
                  'w-full text-left rounded-md px-3 py-2',
                  'hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none',
                  active ? 'ring-1 ring-indigo-300 bg-indigo-50' : '',
                )}
              >
                {/* Header: name + quick estimate */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{company.name}</div>
                    {company.contactEmail && (
                      <div className="mt-0.5 truncate text-[11px] text-gray-500">{company.contactEmail}</div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-semibold">{money(estimate)}</div>
                    <div className="text-[11px] text-gray-500">{usedType ? `via ${usedType}` : '—'}</div>
                  </div>
                </div>

                {/* Supported types */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {(['SEA', 'ROAD', 'RAILWAY', 'AIR'] as const).map((t) =>
                    chip(t, company.supportedTypes.includes(t), isMin[t]),
                  )}
                </div>

                {/* Full pricing object */}
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {badge('Base', money(p.basePrice), isMin.basePrice)}
                  {badge('Per Kg', money(p.pricePerKg), isMin.pricePerKg)}
                  {badge('Fuel', pctStr(p.fuelPct), isMin.fuelPct)}
                  {badge('Insurance', pctStr(p.insurancePct), isMin.insurancePct)}
                  {badge('Remote', pctStr(p.remoteAreaPct), isMin.remoteAreaPct)}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
