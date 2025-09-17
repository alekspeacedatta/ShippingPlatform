import { useEffect, useMemo, useRef, useState } from 'react';
import type { CompanyCreate, ShippingType } from '../../types/Types';
import { cn } from '../../utils/utils'; // if you don't have a cn helper, replace cn(...) with template string joins

type Props = {
  companies: CompanyCreate[];
  value: CompanyCreate | null;
  onChange: (c: CompanyCreate | null) => void;

  // Use current inputs to estimate price more meaningfully
  shippingType?: ShippingType | string;
  weightKg?: number | null;
  size?: { w?: number | null; h?: number | null; l?: number | null };
  declaredValue?: number | null;
};

const money = (n: number) => `$${n.toFixed(2)}`;
const asPct = (v: number) => (v > 1 ? v / 100 : v); // accepts 10 or 0.10

function estimatePrice(
  c: CompanyCreate,
  opts: { shippingType?: string; weightKg?: number | null; size?: { w?: number | null; h?: number | null; l?: number | null }; declaredValue?: number | null }
) {
  const { shippingType, weightKg, size, declaredValue } = opts;

  const { basePrice, pricePerKg, fuelPct, insurancePct, remoteAreaPct, typeMultipliers } = c.pricing;

  const w = typeof weightKg === 'number' && weightKg > 0 ? weightKg : 1;
  const vol =
    size?.w && size?.h && size?.l
      ? (Number(size.w) * Number(size.h) * Number(size.l)) / 5000 // generic divisor
      : 0;
  const chargeable = Math.max(w, vol || 0);

  const base = basePrice + pricePerKg * chargeable;
  const fuel = base * asPct(fuelPct);
  const remote = base * asPct(remoteAreaPct);
  const ins = (declaredValue ?? 0) * asPct(insurancePct);
  const subtotal = base + fuel + remote + ins;

  const applyType = (t: ShippingType) => subtotal * (c.pricing.typeMultipliers[t] || 1);

  if (shippingType && c.supportedTypes.includes(shippingType as ShippingType)) {
    return { total: applyType(shippingType as ShippingType), usedType: shippingType as ShippingType };
  }

  // If no shipping type chosen yet, show the best the company can offer
  let best: { total: number; usedType: ShippingType | null } = { total: Number.POSITIVE_INFINITY, usedType: null };
  (c.supportedTypes as ShippingType[]).forEach((t) => {
    const tTotal = applyType(t);
    if (tTotal < best.total) best = { total: tTotal, usedType: t };
  });
  if (!best.usedType) best = { total: subtotal, usedType: null };

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
}: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  // Precompute estimates and sort
  const enriched = useMemo(() => {
    const rows = companies.map((c) => {
      const est = estimatePrice(c, { shippingType, weightKg, size, declaredValue });
      return { company: c, estimate: est.total, usedType: est.usedType };
    });
    rows.sort((a, b) => a.estimate - b.estimate);
    const bestPrice = rows.length ? rows[0].estimate : Infinity;
    return { rows, bestPrice };
  }, [companies, shippingType, weightKg, size?.w, size?.h, size?.l, declaredValue]);

  // Close on outside click
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

  const selected = value
    ? enriched.rows.find((r) => r.company._id === value._id) ?? null
    : null;

  return (
    <div className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        className={cn(
          'w-full rounded-md border bg-white px-3 py-2 text-left shadow-sm',
          'flex items-center justify-between gap-3'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="min-w-0">
          <div className="truncate font-medium">
            {selected ? selected.company.name : 'Select company'}
          </div>
          <div className="truncate text-xs text-gray-500">
            {selected
              ? `Estimated: ${money(selected.estimate)}${selected.usedType ? ` · ${selected.usedType}` : ''}`
              : 'Pick a company to see pricing'}
          </div>
        </div>

        <svg
          className={cn('h-5 w-5 shrink-0 transition-transform', open ? 'rotate-180' : '')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          ref={popRef}
          className="absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-auto rounded-md border bg-white p-1 shadow-lg"
          role="listbox"
          tabIndex={-1}
        >
          {enriched.rows.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">No companies</div>
          )}

          {enriched.rows.map(({ company, estimate, usedType }) => {
            const isBest = estimate === enriched.bestPrice;
            const active = value?._id === company._id;

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
                  active ? 'ring-1 ring-indigo-300 bg-indigo-50' : ''
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{company.name}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1">
                      {company.supportedTypes.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase text-gray-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    {company.contactEmail && (
                      <div className="mt-0.5 text-xs text-gray-500 truncate">{company.contactEmail}</div>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <div className={cn('text-sm font-semibold', isBest ? 'text-green-600' : 'text-gray-900')}>
                      {money(estimate)}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {usedType ? `via ${usedType}` : '—'}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
