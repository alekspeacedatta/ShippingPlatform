import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetCompanies } from '../../api/useCompany';
import { useCreateParcelRequest } from '../../api/useParcel';

import { useAuthStore } from '../../store/useAuthStore';

import Stepper from '../../components/commons/Stepper';
import ParcelForm from '../../components/client/ParcelForm';
import Calculator, { type CalcResult } from '../../components/client/Calculator';
import { Button } from '../../components/commons/Button';
import ClientHeader from '../../components/client/ClientHeader';
import CompanyPicker from '../../components/client/CompanyPicker';

import type { CompanyCreate, ShippingType } from '../../types/Types';
import { n } from '../../utils/utils';
import { MessageCircle } from 'lucide-react';

const steps = ['Parcel Details', 'Route', 'Shipping Type', 'Calculator', 'Summary & Submit'];

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
  company: string;
  calc: string;
}>;

const help = (m?: string) => (m ? <p className="mt-1 text-xs sm:text-sm text-red-600">{m}</p> : null);

const CreateRequest = () => {
  const navigate = useNavigate();

  // Companies
  const { data: companies = [], isLoading, isError, error } = useGetCompanies();

  // Steps
  const [step, setStep] = useState(0);
  const back = () => setStep((s) => Math.max(0, s - 1));
  const isSubmitStep = step === steps.length - 1;

  // Errors
  const [errors, setErrors] = useState<FieldErrors>({});
  const clearError = (k: keyof FieldErrors) => setErrors((e) => ({ ...e, [k]: undefined }));

  // Form state
  const [parcelErr, setParcelErr] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyCreate | null>(null);
  const [shippingType, setShippingType] = useState<ShippingType | string>('');
  const [kind, setKind] = useState<string>('');
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [declaredValue, setDeclaredValue] = useState<number | null>(null);

  const [volumetricData, setVolumetricData] = useState({
    width: null as number | null,
    height: null as number | null,
    length: null as number | null,
  });

  const [fromLocation, setFromLocation] = useState({
    origin: { country: '', city: '' },
    pickUp: { country: '', city: '', line1: '', postalcode: 0 },
  });

  const [toLocation, setToLocation] = useState({
    destination: { country: '', city: '' },
    deliveryAddress: { country: '', city: '', line1: '', postalcode: 0 },
  });

  const [calc, setCalc] = useState<CalcResult | null>(null);

  // Auth + mutation
  const userId = useAuthStore((s) => s.authInfo?.userId);
  const { mutate } = useCreateParcelRequest();

  // Validation helpers
  const pos = (v: number | null | undefined) => typeof v === 'number' && v > 0;
  const nonNeg = (v: number | null | undefined) => typeof v === 'number' && v >= 0;
  const nonEmpty = (s: string | null | undefined) => !!String(s ?? '').trim();
  const posInt = (v: number | null | undefined) => typeof v === 'number' && Number.isInteger(v) && v > 0;

  const validateStep0 = () => {
    const e: FieldErrors = {};
    if (!pos(weightKg)) e.weightKg = 'Enter weight > 0';
    if (!nonEmpty(kind)) e.kind = 'Choose parcel kind';
    if (!pos(volumetricData.width)) e.width = 'Enter width > 0';
    if (!pos(volumetricData.height)) e.height = 'Enter height > 0';
    if (!pos(volumetricData.length)) e.length = 'Enter length > 0';
    if (!nonNeg(declaredValue)) e.declaredValue = 'Must be ≥ 0';
    setErrors((p) => ({ ...p, ...e }));
    return Object.keys(e).length === 0;
  };

  const validateStep1 = () => {
    const e: FieldErrors = {};
    if (!nonEmpty(fromLocation.origin.country)) e.originCountry = 'Required';
    if (!nonEmpty(fromLocation.origin.city)) e.originCity = 'Required';
    if (!nonEmpty(fromLocation.pickUp.country)) e.pickupCountry = 'Required';
    if (!nonEmpty(fromLocation.pickUp.city)) e.pickupCity = 'Required';
    if (!nonEmpty(fromLocation.pickUp.line1)) e.pickupLine1 = 'Required';
    if (!posInt(fromLocation.pickUp.postalcode)) e.pickupPostal = 'Integer > 0';

    if (!nonEmpty(toLocation.destination.country)) e.destCountry = 'Required';
    if (!nonEmpty(toLocation.destination.city)) e.destCity = 'Required';
    if (!nonEmpty(toLocation.deliveryAddress.country)) e.deliveryCountry = 'Required';
    if (!nonEmpty(toLocation.deliveryAddress.city)) e.deliveryCity = 'Required';
    if (!nonEmpty(toLocation.deliveryAddress.line1)) e.deliveryLine1 = 'Required';
    if (!posInt(toLocation.deliveryAddress.postalcode)) e.deliveryPostal = 'Integer > 0';

    setErrors((p) => ({ ...p, ...e }));
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: FieldErrors = {};
    if (!selectedCompany) e.company = 'Select company';
    if (!nonEmpty(shippingType)) e.shippingType = 'Select shipping type';
    setErrors((p) => ({ ...p, ...e }));
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: FieldErrors = {};
    if (!calc || !(calc.total > 0)) e.calc = 'Calculate price first';
    setErrors((p) => ({ ...p, ...e }));
    return Object.keys(e).length === 0;
  };

  const validateCurrentStep = (s: number) => {
    if (s === 0) return validateStep0();
    if (s === 1) return validateStep1();
    if (s === 2) return validateStep2();
    if (s === 3) return validateStep3();
    return true;
  };

  const handleNext = () => {
    if (!selectedCompany) {
      setErrors((p) => ({ ...p, company: 'Select company' }));
      return;
    }
    if (!validateCurrentStep(step)) return;
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ok0 = validateStep0();
    const ok1 = validateStep1();
    const ok2 = validateStep2();
    const ok3 = validateStep3();
    if (!ok0) setStep(0);
    else if (!ok1) setStep(1);
    else if (!ok2) setStep(2);
    else if (!ok3) setStep(3);
    if (!(ok0 && ok1 && ok2 && ok3)) return;

    const total = calc?.total ?? 0;

    mutate(
      {
        userId: userId!,
        companyId: selectedCompany?._id,
        shippingType: shippingType as ShippingType,
        parcel: {
          weightKg: n(weightKg),
          lengthCm: n(volumetricData.length),
          widthCm: n(volumetricData.width),
          heightCm: n(volumetricData.height),
          declaredValue: n(declaredValue),
          kind: kind as 'DOCUMENTS' | 'GOODS',
        },
        route: {
          origin: {
            country: fromLocation.origin.country,
            city: fromLocation.origin.city,
          },
          destination: {
            country: toLocation.destination.country,
            city: toLocation.destination.city,
          },
          pickupAddress: {
            country: fromLocation.pickUp.country,
            city: fromLocation.pickUp.city,
            line1: fromLocation.pickUp.line1,
            postalCode: String(fromLocation.pickUp.postalcode),
          },
          deliveryAddress: {
            country: toLocation.deliveryAddress.country,
            city: toLocation.deliveryAddress.city,
            line1: toLocation.deliveryAddress.line1,
            postalCode: String(toLocation.deliveryAddress.postalcode),
          },
        },
        priceEstimate: total,
        status: 'PENDING_REVIEW',
        timeline: [{ status: 'PENDING_REVIEW', at: new Date().toISOString() }],
        trackingId: 'dsds',
        messages: [],
      },
      {
        onError: () => {
          setParcelErr(true);
          setStep(5);
        },
        onSuccess: () => {
          setParcelErr(false);
          setStep(5);
        },
      },
    );
  };

  // Mini-chat state
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [sentMessages, setSentMessages] = useState<{ sentMessage: string; date: Date }[]>([]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSentMessages((prev) => [...prev, { sentMessage: message.trim(), date: new Date() }]);
    setMessage('');
  };

  // Auto scroll both desktop and mobile chat bodies (no refs)
  useEffect(() => {
    const nodes = document.querySelectorAll('#chat-scroll');
    nodes.forEach((el) => {
      try {
        el.scrollTo({ top: (el as HTMLElement).scrollHeight, behavior: 'smooth' });
      } catch {
        /* ignore */
      }
    });
  }, [sentMessages, chatOpen]);

  return (
    <>
      <ClientHeader />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        <div className="flex gap-6">
          
          <main className="flex-1">
            <div className="mx-auto w-full max-w-3xl md:max-w-5xl">
              
              <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
                <button
                  className="hover:font-semibold hover:underline underline-offset-4"
                  onClick={() => navigate('/client/dashboard')}
                >
                  Dashboard
                </button>
                <span className="text-gray-400">→</span>
                <span className="font-semibold text-indigo-500 underline underline-offset-4">
                  Create Request
                </span>
              </div>

              
              {isLoading ? (
                <p>Loading...</p>
              ) : isError ? (
                <p>Error: {error?.message}</p>
              ) : (
                <>
                  <div className="my-2 flex flex-col gap-2">
                    <h1 className="text-xl sm:text-2xl font-semibold">Select company for transfer</h1>
                    <CompanyPicker
                      companies={companies}
                      value={selectedCompany}
                      onChange={setSelectedCompany}
                      shippingType={shippingType}
                      weightKg={weightKg}
                      size={{ w: volumetricData.width, h: volumetricData.height, l: volumetricData.length }}
                      declaredValue={declaredValue}
                      fromCountry={fromLocation.origin.country}
                      toCountry={toLocation.destination.country}
                    />
                    {help(errors.company)}
                  </div>

                  <Stepper steps={steps} current={step} />

                  {step === 5 ? (
                    !parcelErr ? (
                      <div className="flex min-h-max flex-col items-center justify-center gap-4 rounded-xl border bg-white p-8 sm:p-12">
                        <div className="flex flex-col items-center gap-3">
                          <h1 className="text-lg sm:text-xl text-green-500">
                            Congratulations! Your request was created successfully.
                          </h1>
                          <p className="text-sm text-green-500">✓ payment success ✓</p>
                        </div>
                        <div className="mt-4">
                          <Button
                            type="button"
                            onClick={() => navigate('/client/requests')}
                            className="w-full sm:w-auto"
                          >
                            see request
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-h-max flex-col items-center justify-center gap-4 rounded-xl border bg-white p-8 sm:p-12">
                        <h1 className="text-lg sm:text-xl font-semibold text-red-500">Failed to create request</h1>
                        <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                          <Button type="button" onClick={() => setStep(0)} className="w-full sm:w-auto">
                            start over
                          </Button>
                          <Button
                            type="button"
                            onClick={() => navigate('/client/requests')}
                            className="w-full sm:w-auto"
                          >
                            go to requests
                          </Button>
                        </div>
                      </div>
                    )
                  ) : (
                    <form
                      ref={formRef}
                      onSubmit={handleSubmit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isSubmitStep) e.preventDefault();
                      }}
                      className="flex min-h-28 flex-col justify-center rounded-xl border bg-white p-4 sm:p-5"
                    >
                      <ParcelForm
                        step={step}
                        selectedCompany={selectedCompany}
                        shippingType={shippingType}
                        setShippingType={(v) => {
                          setShippingType(v);
                          clearError('shippingType');
                        }}
                        kind={kind}
                        setKind={(v) => {
                          setKind(v);
                          clearError('kind');
                        }}
                        weightKg={weightKg}
                        setWeightKg={(v) => {
                          setWeightKg(v);
                          clearError('weightKg');
                        }}
                        volumetricData={volumetricData}
                        setVolumetricData={(v) => {
                          setVolumetricData(v);
                          clearError('width');
                          clearError('height');
                          clearError('length');
                        }}
                        declaredValue={declaredValue}
                        setDeclaredValue={(v) => {
                          setDeclaredValue(v);
                          clearError('declaredValue');
                        }}
                        fromLocation={fromLocation}
                        setFromLocation={(u) => {
                          setFromLocation(u);
                          clearError('originCountry');
                          clearError('originCity');
                          clearError('pickupCountry');
                          clearError('pickupCity');
                          clearError('pickupLine1');
                          clearError('pickupPostal');
                        }}
                        toLocation={toLocation}
                        setToLocation={(u) => {
                          setToLocation(u);
                          clearError('destCountry');
                          clearError('destCity');
                          clearError('deliveryCountry');
                          clearError('deliveryCity');
                          clearError('deliveryLine1');
                          clearError('deliveryPostal');
                        }}
                        errors={errors}
                      />

                      <div style={{ display: step === 3 ? 'block' : 'none' }}>
                        <Calculator
                          volumetricData={volumetricData}
                          weightKg={weightKg}
                          declaredValue={declaredValue}
                          shippingType={shippingType}
                          selectedCompany={selectedCompany}
                          fromLocation={fromLocation}
                          toLocation={toLocation}
                          onChange={(c) => {
                            setCalc(c);
                            if (c && c.total > 0) clearError('calc');
                          }}
                        />
                        {help(errors.calc)}
                      </div>

                      {step === 4 && (
                        <div className="flex h-[55vh] min-h-28 flex-col gap-4 overflow-y-auto rounded-xl border bg-white p-4">
                          <h2 className="text-lg sm:text-xl font-semibold">Summary & Submit</h2>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-lg border bg-white p-4">
                              <h3 className="mb-2 font-semibold">Company & Shipping</h3>
                              <p>
                                <span className="text-gray-500">Company:</span> {selectedCompany?.name ?? '—'}
                              </p>
                              <p>
                                <span className="text-gray-500">Shipping type:</span> {shippingType || '—'}
                              </p>
                              <p>
                                <span className="text-gray-500">Type multiplier:</span>{' '}
                                {(calc?.typeMultiplier ?? 1).toFixed(2)}x
                              </p>
                              <p>
                                <span className="text-gray-500">Distance factor:</span>{' '}
                                {(calc?.distanceFactor ?? 1).toFixed(2)}x
                              </p>
                            </div>

                            <div className="rounded-lg border bg-white p-4">
                              <h3 className="mb-2 font-semibold">Parcel</h3>
                              <p>
                                <span className="text-gray-500">Kind:</span> {String(kind) || '—'}
                              </p>
                              <p>
                                <span className="text-gray-500">Weight:</span> {weightKg ?? '—'} kg
                              </p>
                              <p>
                                <span className="text-gray-500">Size (W×H×L):</span> {volumetricData.width ?? '—'}×
                                {volumetricData.height ?? '—'}×{volumetricData.length ?? '—'} cm
                              </p>
                              <p>
                                <span className="text-gray-500">Declared value:</span> ${declaredValue ?? '—'}
                              </p>
                              <p>
                                <span className="text-gray-500">Volumetric weight:</span>{' '}
                                {(calc?.volumetricWeight ?? 0).toFixed(2)} kg
                              </p>
                              <p>
                                <span className="text-gray-500">Chargeable weight:</span>{' '}
                                {(calc?.chargableWeight ?? 0).toFixed(2)} kg
                              </p>
                            </div>

                            <div className="rounded-lg border bg-white p-4">
                              <h3 className="mb-2 font-semibold">Route</h3>
                              <p className="text-sm">
                                <span className="text-gray-500">Origin:</span> {fromLocation.origin.country},{' '}
                                {fromLocation.origin.city}
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-500">Destination:</span> {toLocation.destination.country},{' '}
                                {toLocation.destination.city}
                              </p>

                              <div className="mt-3">
                                <p className="text-sm text-gray-500">Pickup address</p>
                                <p className="text-sm">
                                  {fromLocation.pickUp.country}, {fromLocation.pickUp.city}
                                </p>
                                <p className="text-sm">
                                  {fromLocation.pickUp.line1}
                                  {fromLocation.pickUp.postalcode ? `, ${fromLocation.pickUp.postalcode}` : ''}
                                </p>
                              </div>

                              <div className="mt-3">
                                <p className="text-sm text-gray-500">Delivery address</p>
                                <p className="text-sm">
                                  {toLocation.deliveryAddress.country}, {toLocation.deliveryAddress.city}
                                </p>
                                <p className="text-sm">
                                  {toLocation.deliveryAddress.line1}
                                  {toLocation.deliveryAddress.postalcode
                                    ? `, ${toLocation.deliveryAddress.postalcode}`
                                    : ''}
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg border bg-white p-4">
                              <h3 className="mb-2 font-semibold">Pricing breakdown</h3>
                              <p>
                                <span className="text-gray-500">Base:</span> ${Number(calc?.base ?? 0).toFixed(2)}
                              </p>
                              <p>
                                <span className="text-gray-500">Fuel surcharge:</span> $
                                {Number(calc?.fuelSurcharge ?? 0).toFixed(2)}
                              </p>
                              <p>
                                <span className="text-gray-500">Remote surcharge:</span> $
                                {Number(calc?.remoteSurcharge ?? 0).toFixed(2)}
                              </p>
                              <p>
                                <span className="text-gray-500">Insurance:</span> $
                                {Number(calc?.insurance ?? 0).toFixed(2)}
                              </p>
                              <p>
                                <span className="text-gray-500">Surcharges total:</span> $
                                {Number(calc?.surcharges ?? 0).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="border-t pt-4 text-right text-xl sm:text-2xl font-semibold">
                            Total: ${Number(calc?.total ?? 0).toFixed(2)}
                          </div>
                        </div>
                      )}

                      
                      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
                        <Button
                          type="button"
                          onClick={back}
                          disabled={step === 0}
                          className="w-full sm:w-auto rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
                        >
                          back
                        </Button>
                        <Button
                          type="button"
                          className="w-full sm:w-auto"
                          onClick={isSubmitStep ? () => formRef.current?.requestSubmit() : handleNext}
                        >
                          {isSubmitStep ? 'Submit' : 'next'}
                        </Button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </main>

          
          <aside className="hidden md:block w-[360px] shrink-0">
            <div className="sticky top-24">
              
              <div className="mb-3 flex items-center justify-end">
                <button
                  onClick={() => setChatOpen((p: boolean) => !p)}
                  className="rounded-xl shadow-sm w-12 h-12 flex items-center justify-center bg-white border transition-all hover:shadow-md"
                  title="Support chat"
                >
                  <MessageCircle size={22} />
                </button>
              </div>

              
              <div
                className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                  chatOpen ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-2'
                }`}
              >
                <div className="rounded-t-2xl bg-gray-100 p-3 text-sm font-semibold">New Chat With Support</div>

                <div id="chat-scroll" className="flex-1 min-h-[280px] max-h-[55vh] overflow-y-auto px-3 py-2">
                  <div className="flex flex-col items-end justify-end gap-2">
                    {sentMessages.map((m, i) => (
                      <div key={i} className="flex w-3/4 items-center justify-between gap-2 rounded-xl bg-indigo-50 p-2">
                        <p className="whitespace-pre-wrap break-words">{m.sentMessage}</p>
                        <p className="text-xs font-semibold text-gray-500">
                          {m.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <form className="p-2" onSubmit={handleChatSubmit}>
                  <div className="flex items-center justify-between gap-2 rounded-xl border p-2">
                    <input
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                      placeholder="New message"
                      className="flex-1 p-1 outline-none"
                    />
                    <button
                      disabled={!message}
                      className="rounded-full bg-indigo-500 px-4 py-2 text-white transition disabled:bg-indigo-200"
                      type="submit"
                    >
                      ↑
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </div>

      
      <button
        onClick={() => setChatOpen((p: boolean) => !p)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 md:hidden"
        title="Support chat"
      >
        <MessageCircle size={26} />
      </button>

      
      <div
        className={`fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md rounded-t-2xl border-t bg-white shadow-2xl transition-transform duration-200 md:hidden ${
          chatOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between rounded-t-2xl bg-gray-100 p-3">
          <span className="text-sm font-semibold">New Chat With Support</span>
          <button onClick={() => setChatOpen(false)} className="text-sm text-gray-600">
            Close
          </button>
        </div>

        <div id="chat-scroll" className="max-h-[45vh] min-h-[240px] overflow-y-auto px-3 py-2">
          <div className="flex flex-col items-end justify-end gap-2">
            {sentMessages.map((m, i) => (
              <div key={i} className="flex w-3/4 items-center justify-between gap-2 rounded-xl bg-indigo-50 p-2">
                <p className="whitespace-pre-wrap break-words">{m.sentMessage}</p>
                <p className="text-xs font-semibold text-gray-500">
                  {m.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </div>

        <form className="p-2" onSubmit={handleChatSubmit}>
          <div className="flex items-center justify-between gap-2 rounded-xl border p-2">
            <input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="New message"
              className="flex-1 p-1 outline-none"
            />
            <button
              disabled={!message}
              className="rounded-full bg-indigo-500 px-4 py-2 text-white transition disabled:bg-indigo-200"
              type="submit"
            >
              ↑
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default CreateRequest;