// pages/client/CreateRequest.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCompanies } from '../../api/useCompany';
import { useCreateParcelRequest } from '../../api/useParcel';
import { useAuthStore } from '../../store/useAuthStore';
import Stepper from '../../components/commons/Stepper';
import ParcelForm from '../../components/client/ParcelForm';
import Calculator, { type CalcResult } from '../../components/client/Calculator';
import { Button } from '../../components/commons/Button';
import type { CompanyCreate, ShippingType } from '../../types/Types';
import { Select, Option } from '../../components/commons/Select';
import { n } from '../../utils/utils';

const steps = ['Parcel Details', 'Route', 'Shipping Type', 'Calculator', 'Summary & Submit'];

const CreateRequest = () => {
  const navigate = useNavigate();
  const { data: companies = [], isLoading, isError, error } = useGetCompanies();
  const [step, setStep] = useState(0);
  const back = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(steps.length, s + 1));

  const [parcelErr, setParcelErr] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyCreate | null>(null);
  const [shippingType, setShippingType] = useState<ShippingType | string>('');
  const [kind, setKind] = useState<string>('');
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [declaredValue, setDeclaredValue] = useState<number | null>(null);
  const [volumetricData, setVolumetricData] = useState<{
    width: number | null;
    height: number | null;
    length: number | null;
  }>({ width: null, height: null, length: null });

  const [fromLocation, setFromLocation] = useState<{
    origin: { country: string; city: string };
    pickUp: { country: string; city: string; line1: string; postalcode: number };
  }>({
    origin: { country: '', city: '' },
    pickUp: { country: '', city: '', line1: '', postalcode: 0 },
  });
  const [toLocation, setToLocation] = useState<{
    destination: { country: string; city: string };
    deliveryAddress: { country: string; city: string; line1: string; postalcode: number };
  }>({
    destination: { country: '', city: '' },
    deliveryAddress: { country: '', city: '', line1: '', postalcode: 0 },
  });

  const [calc, setCalc] = useState<CalcResult | null>(null);

  const userId = useAuthStore((s) => s.authInfo?.userId);
  const { mutate } = useCreateParcelRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calc?.total ?? 0;

    mutate(
      {
        userId: userId!,
        companyId: (selectedCompany as any)?._id,
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
          origin: { country: fromLocation.origin.country, city: fromLocation.origin.city },
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
        status: 'AWAITING_COMPANY_CONFIRMATION',
        timeline: [{ status: 'AWAITING_COMPANY_CONFIRMATION', at: new Date().toISOString() }],
        trackingId: 'dsds',
        messages: [],
      },
      {
        onError: () => {
          setParcelErr(true);
        },
        onSuccess: () => {
          setParcelErr(false);
        },
      },
    );
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-5 p-6 md:max-w-5xl">
      <div className="flex items-center gap-2">
        <p
          className="cursor-pointer hover:font-semibold hover:underline hover:underline-offset-4"
          onClick={() => navigate(-1)}
        >
          Dashboard
        </p>
        <span>→</span>
        <p className="cursor-pointer font-semibold text-indigo-500 underline underline-offset-4 transition-all duration-200">
          Create Request
        </p>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error: {error?.message}</p>
      ) : (
        <>
          <div className="my-4 flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">select company for transfer</h1>
            <Select
              onChange={(e) => {
                const found =
                  companies.find((c: CompanyCreate) => c.name === e.target.value) || null;
                setSelectedCompany(found);
              }}
              value={selectedCompany?.name ?? ''}
            >
              {!selectedCompany && <option value="">select company</option>}
              {companies.map((c: CompanyCreate) => (
                <Option key={c.contactEmail} value={c.name}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </div>

          <Stepper steps={steps} current={step} />

          <form
            onSubmit={handleSubmit}
            className="flex min-h-28 flex-col justify-center rounded-xl border p-4"
          >
            <ParcelForm
              step={step}
              selectedCompany={selectedCompany}
              shippingType={shippingType}
              setShippingType={(v) => setShippingType(v)}
              kind={kind}
              setKind={setKind}
              weightKg={weightKg}
              setWeightKg={setWeightKg}
              volumetricData={volumetricData}
              setVolumetricData={setVolumetricData}
              declaredValue={declaredValue}
              setDeclaredValue={setDeclaredValue}
              fromLocation={fromLocation}
              setFromLocation={setFromLocation}
              toLocation={toLocation}
              setToLocation={setToLocation}
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
                onChange={setCalc}
              />
            </div>

            {step === 4 && (
              <div className="flex h-[50vh] min-h-28 flex-col gap-4 overflow-y-scroll rounded-xl border bg-white p-4">
                <h2 className="text-xl font-semibold">Summary & Submit</h2>

                <div className="grid grid-cols-1 gap-4 bg-white md:grid-cols-2">
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
                      <span className="text-gray-500">Size (W×H×L):</span>{' '}
                      {volumetricData.width ?? '—'}×{volumetricData.height ?? '—'}×
                      {volumetricData.length ?? '—'} cm
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
                      <span className="text-gray-500">Destination:</span>{' '}
                      {toLocation.destination.country}, {toLocation.destination.city}
                    </p>

                    <div className="mt-3">
                      <p className="text-sm text-gray-500">Pickup address</p>
                      <p className="text-sm">
                        {fromLocation.pickUp.country}, {fromLocation.pickUp.city}
                      </p>
                      <p className="text-sm">
                        {fromLocation.pickUp.line1}
                        {fromLocation.pickUp.postalcode
                          ? `, ${fromLocation.pickUp.postalcode}`
                          : ''}
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
                      <span className="text-gray-500">Base:</span> $
                      {Number(calc?.base ?? 0).toFixed(2)}
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

                <div className="border-t pt-4 text-right text-2xl font-semibold">
                  Total: ${Number(calc?.total ?? 0).toFixed(2)}
                </div>
              </div>
            )}
            {step === 5 &&
              (!parcelErr ? (
                <div className="flex min-h-max flex-col items-center justify-center gap-4 overflow-y-scroll rounded-xl border bg-white p-14">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3">
                      <h1 className="text-xl text-green-500">
                        {' '}
                        Congratulations you request Created Succesfuly{' '}
                      </h1>
                    </div>
                    <p className="text-sm text-green-500">✓ payment success ✓</p>
                  </div>
                  <p
                    className="cursor-pointer underline"
                    onClick={() => {
                      navigate('/client/requests');
                    }}
                  >
                    {' '}
                    see the request{' '}
                  </p>
                </div>
              ) : (
                <div className="flex min-h-max items-center justify-center gap-4 overflow-y-scroll rounded-xl border bg-white p-14">
                  <h1 className='text-xl text-red-500 font-semibold'>failed to Create request</h1>
                </div>
              ))}

            <div className="mt-6 flex justify-between">
              <Button
                onClick={back}
                disabled={step === 0 || (step === 5 && !parcelErr)}
                type="button"
                className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
              >
                back
              </Button>
              <Button
                onClick={step === steps.length ? undefined : next}
                type={step === steps.length ? 'submit' : 'button'}
              >
                {step === steps.length - 1 ? 'Submit' : 'next'}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default CreateRequest;
