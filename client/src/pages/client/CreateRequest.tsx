// pages/client/CreateRequest.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCompanies } from "../../api/useCompany";
import { useCreateParcelRequest } from "../../api/useParcel";
import { useAuthStore } from "../../store/useAuthStore";
import Stepper from "../../components/commons/Stepper";
import ParcelForm from "../../components/client/ParcelForm";
import Calculator, { type CalcResult } from "../../components/client/Calculator";
import { Button } from "../../components/commons/Button";
import type { CompanyCreate, ShippingType } from "../../types/Types";
import { Select, Option } from "../../components/commons/Select";
import { n } from "../../utils/utils";

const steps = ['Parcel Details', 'Route', 'Shipping Type', 'Calculator', 'Summary & Submit'];

const CreateRequest = () => {
  const navigate = useNavigate();
  const { data: companies = [], isLoading, isError, error } = useGetCompanies();
  const [step, setStep] = useState(0);
  const back = () => setStep(s => Math.max(0, s - 1));
  const next = () => setStep(s => Math.min(steps.length, s + 1));

  const [ parcelErr, setParcelErr ] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyCreate | null>(null);
  const [shippingType, setShippingType] = useState<ShippingType | string>('');
  const [kind, setKind] = useState<string>('');
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [declaredValue, setDeclaredValue] = useState<number | null>(null);
  const [volumetricData, setVolumetricData] = useState<{ width: number | null; height: number | null; length: number | null }>({ width: null, height: null, length: null });

  const [fromLocation, setFromLocation] = useState<{ origin: { country: string, city: string }, pickUp: { country: string, city: string, line1: string, postalcode: number } }>({
    origin: { country: '', city: '' },
    pickUp: { country: '', city: '', line1: '', postalcode: 0 },
  });
  const [toLocation, setToLocation] = useState<{ destination: { country: string, city: string }, deliveryAddress: { country: string, city: string, line1: string, postalcode: number } }>({
    destination: { country: '', city: '' },
    deliveryAddress: { country: '', city: '', line1: '', postalcode: 0 },
  });

  const [calc, setCalc] = useState<CalcResult | null>(null);

  const userId = useAuthStore(s => s.authInfo?.userId);
  const { mutate } = useCreateParcelRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calc?.total ?? 0;

    mutate({
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
        destination: { country: toLocation.destination.country, city: toLocation.destination.city },
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
    },{ onError: () => { setParcelErr(true) }, onSuccess: () => { setParcelErr(false) }  }) 
  };

  return (
    <div className="max-w-3xl md:max-w-5xl mx-auto p-6 gap-5 min-h-screen flex justify-center flex-col">
      <div className="flex items-center gap-2">
        <p className="cursor-pointer hover:underline hover:underline-offset-4 hover:font-semibold" onClick={() => navigate(-1)}>Dashboard</p>
        <span>→</span>
        <p className="cursor-pointer underline transition-all duration-200 underline-offset-4 font-semibold text-indigo-500">Create Request</p>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error: {error?.message}</p>
      ) : (
        <>
          <div className="flex flex-col gap-2 my-4">
            <h1 className="text-2xl font-semibold">select company for transfer</h1>
            <Select
              onChange={(e) => {
                const found = companies.find((c: CompanyCreate) => c.name === e.target.value) || null;
                setSelectedCompany(found);
              }}
              value={selectedCompany?.name ?? ""}
            >
              {!selectedCompany && <option value="">select company</option>}
              {companies.map((c: CompanyCreate) => (
                <Option key={c.contactEmail} value={c.name}>{c.name}</Option>
              ))}
            </Select>
          </div>

          <Stepper steps={steps} current={step} />

          <form onSubmit={handleSubmit} className="p-4 border rounded-xl min-h-28 flex flex-col justify-center">
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

            <div style={{ display: step === 3 ? "block" : "none" }}>
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
              <div className="p-4 border rounded-xl min-h-28 flex flex-col gap-4 overflow-y-scroll h-[50vh] bg-white">
                <h2 className="text-xl font-semibold">Summary & Submit</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                  <div className="bg-white rounded-lg p-4 border">
                    <h3 className="font-semibold mb-2">Company & Shipping</h3>
                    <p><span className="text-gray-500">Company:</span> {selectedCompany?.name ?? '—'}</p>
                    <p><span className="text-gray-500">Shipping type:</span> {shippingType || '—'}</p>
                    <p><span className="text-gray-500">Type multiplier:</span> {(calc?.typeMultiplier ?? 1).toFixed(2)}x</p>
                    <p><span className="text-gray-500">Distance factor:</span> {(calc?.distanceFactor ?? 1).toFixed(2)}x</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <h3 className="font-semibold mb-2">Parcel</h3>
                    <p><span className="text-gray-500">Kind:</span> {String(kind) || '—'}</p>
                    <p><span className="text-gray-500">Weight:</span> {weightKg ?? '—'} kg</p>
                    <p>
                      <span className="text-gray-500">Size (W×H×L):</span>{" "}
                      {(volumetricData.width ?? '—')}×{(volumetricData.height ?? '—')}×{(volumetricData.length ?? '—')} cm
                    </p>
                    <p><span className="text-gray-500">Declared value:</span> ${declaredValue ?? '—'}</p>
                    <p><span className="text-gray-500">Volumetric weight:</span> {(calc?.volumetricWeight ?? 0).toFixed(2)} kg</p>
                    <p><span className="text-gray-500">Chargeable weight:</span> {(calc?.chargableWeight ?? 0).toFixed(2)} kg</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <h3 className="font-semibold mb-2">Route</h3>
                    <p className="text-sm"><span className="text-gray-500">Origin:</span> {fromLocation.origin.country}, {fromLocation.origin.city}</p>
                    <p className="text-sm"><span className="text-gray-500">Destination:</span> {toLocation.destination.country}, {toLocation.destination.city}</p>

                    <div className="mt-3">
                      <p className="text-gray-500 text-sm">Pickup address</p>
                      <p className="text-sm">{fromLocation.pickUp.country}, {fromLocation.pickUp.city}</p>
                      <p className="text-sm">
                        {fromLocation.pickUp.line1}
                        {fromLocation.pickUp.postalcode ? `, ${fromLocation.pickUp.postalcode}` : ''}
                      </p>
                    </div>

                    <div className="mt-3">
                      <p className="text-gray-500 text-sm">Delivery address</p>
                      <p className="text-sm">{toLocation.deliveryAddress.country}, {toLocation.deliveryAddress.city}</p>
                      <p className="text-sm">
                        {toLocation.deliveryAddress.line1}
                        {toLocation.deliveryAddress.postalcode ? `, ${toLocation.deliveryAddress.postalcode}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <h3 className="font-semibold mb-2">Pricing breakdown</h3>
                    <p><span className="text-gray-500">Base:</span> ${Number(calc?.base ?? 0).toFixed(2)}</p>
                    <p><span className="text-gray-500">Fuel surcharge:</span> ${Number(calc?.fuelSurcharge ?? 0).toFixed(2)}</p>
                    <p><span className="text-gray-500">Remote surcharge:</span> ${Number(calc?.remoteSurcharge ?? 0).toFixed(2)}</p>
                    <p><span className="text-gray-500">Insurance:</span> ${Number(calc?.insurance ?? 0).toFixed(2)}</p>
                    <p><span className="text-gray-500">Surcharges total:</span> ${Number(calc?.surcharges ?? 0).toFixed(2)}</p>
                  </div>
                </div>

                <div className="text-2xl font-semibold text-right border-t pt-4">
                  Total: ${Number(calc?.total ?? 0).toFixed(2)}
                </div>
              </div>
            )}
            {step === 5 && (
              !parcelErr ? (
                <div className="p-14 border rounded-xl min-h-max items-center justify-center flex flex-col gap-4 overflow-y-scroll bg-white items-center ">
                  <div className="flex items-center gap-4">
                    <span className="p-3 text-2xl text-white rounded-full bg-green-600">✓</span>    
                    <h1>Congratulations you request Created Succesfuly</h1>
                  </div>
                  <p className="underline cursor-pointer " onClick={() => { navigate('/client/requests') } }> see the request </p>
                </div>
              ) : (
                <div className="p-14 border rounded-xl min-h-max items-center justify-center flex gap-4 overflow-y-scroll bg-white items-center ">
                  <span className="p-3 text-2xl text-white rounded-full bg-red-600">✓</span>    
                  <h1>failed to Create request</h1>
                </div>
              )
            )
            }

            <div className="mt-6 flex justify-between">
              <Button onClick={back} disabled={step === 0 || (step === 5 && !parcelErr)}  type="button" className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50">
                back
              </Button>
              <Button onClick={step === steps.length ? undefined : next} type={step === steps.length? "submit" : "button"}>
                {step === steps.length - 1 ? "Submit" : "next"}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default CreateRequest;
