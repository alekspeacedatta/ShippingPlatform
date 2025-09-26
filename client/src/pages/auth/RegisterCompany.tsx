import { Button } from '../../components/commons/Button';
import { Input } from '../../components/commons/Input';
import { Link } from 'react-router-dom';
import { ISO2_COUNTRY_CODES, type CompanyCreate, type ShippingType } from '../../types/Types';
import { useRegisterCompany } from '../../api/useAuth';
import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const RegisterCompany = () => {
  const formRef = useRef<HTMLDivElement | null>(null);
  gsap.registerPlugin(useGSAP);
  useGSAP(
    () => {
      if (!formRef.current) return;
      gsap.from(formRef.current, { opacity: 0, y: 8, duration: 0.2, ease: 'power2.out' });
    },
    { scope: formRef },
  );

  const { mutate, isError, error } = useRegisterCompany();

  const [shippingType, setShippingTypes] = useState<ShippingType[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  const toggleShippingType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    const typedValue = value as ShippingType;
    setShippingTypes((prev) => (checked ? [...prev, typedValue] : prev.filter((v) => v !== typedValue)));
  };

  const toggleRegions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    if (value === 'ALL') {
      setRegions(checked ? [...ISO2_COUNTRY_CODES] : []);
    } else {
      setRegions((prev) => (checked ? [...prev, value] : prev.filter((v) => v !== value)));
    }
  };

  const [companyInfo, setCompanyInfo] = useState<CompanyCreate>({
    _id: '',
    name: '',
    contactEmail: '',
    password: '',
    phone: '',
    hqAddress: { country: '', city: '', line1: '', postalCode: '' },
    regions: regions,
    supportedTypes: shippingType,
    pricing: {
      basePrice: 0,
      pricePerKg: 0,
      fuelPct: 0,
      insurancePct: 0,
      typeMultipliers: { SEA: 0, RAILWAY: 0, ROAD: 0, AIR: 0 },
      remoteAreaPct: 0,
    },
    logoUrl: '',
  });

  const handelCompanyRegister = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ ...companyInfo, regions, supportedTypes: shippingType });
  };

  return (
    // FIX 1: Lock page to viewport height and prevent outer growth
    <div className="h-screen overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-gray-50">
      {/* FIX 2: Make the left column a scroll container if needed */}
      <div className="flex h-screen items-center justify-center px-4 py-8 sm:px-6 md:px-8 overflow-auto overscroll-contain">
        <section
          ref={formRef}
          className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-3xl bg-white p-5 sm:p-7 shadow-2xl ring-1 ring-black/5"
        >
          <form className="flex flex-col gap-4" onSubmit={handelCompanyRegister}>
            <h1 className="mb-1 text-2xl sm:text-3xl font-semibold">Company Registration</h1>
            {isError && <p className="text-sm sm:text-base text-red-700">{error.message}</p>}

            {/* Optional: keep inner scroll area contained */}
            <section className="max-h-[65vh] overflow-y-auto overscroll-contain pr-1 sm:pr-2">
              <section className="flex flex-col gap-3 rounded-md">
                <h2 className="text-lg sm:text-xl">Main info</h2>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-medium">Contact Email</label>
                    <Input
                      onChange={(e) => setCompanyInfo({ ...companyInfo, contactEmail: e.target.value })}
                      type="email"
                      placeholder="enter your email"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      onChange={(e) => setCompanyInfo({ ...companyInfo, password: e.target.value })}
                      type="password"
                      placeholder="enter your password"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <Input
                      onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                      type="text"
                      placeholder="enter your company name"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                      type="text"
                      placeholder="+(country) xxx xx xx xx"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Logo URL</label>
                    <Input
                      onChange={(e) => setCompanyInfo({ ...companyInfo, logoUrl: e.target.value })}
                      type="text"
                      placeholder="https://…"
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-medium">Regions</label>
                    {/* FIX 3: Keep the chip list strictly contained & no horizontal overflow */}
                    <div className="max-h-56 md:max-h-72 w-full overflow-y-auto overflow-x-hidden overscroll-contain rounded-md border-2 border-indigo-200 bg-white p-2 flex flex-wrap gap-1">
                      <label className="flex cursor-pointer select-none items-center">
                        <input
                          onChange={toggleRegions}
                          type="checkbox"
                          value="ALL"
                          checked={regions.length === ISO2_COUNTRY_CODES.length}
                          className="peer sr-only"
                        />
                        <span className="rounded-[28px] border-2 border-[#aab0ff] px-3 py-2 text-[12px] sm:text-[14px] text-[#777] peer-checked:bg-[#aab0ff] peer-checked:text-white">
                          All
                        </span>
                      </label>
                      {ISO2_COUNTRY_CODES.map((reg) => (
                        <label key={reg} className="flex cursor-pointer select-none items-center">
                          <input onChange={toggleRegions} type="checkbox" value={reg} className="peer sr-only" />
                          <span className="rounded-[28px] border-2 border-[#aab0ff] px-3 py-2 text-[12px] sm:text-[14px] text-[#777] peer-checked:bg-[#aab0ff] peer-checked:text-white">
                            {reg}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-medium">Shipping types</label>
                    <div className="flex flex-wrap gap-2 rounded-md border-2 border-indigo-200 bg-white p-2">
                      {(['RAILWAY', 'ROAD', 'AIR', 'SEA'] as const).map((t) => (
                        <label key={t} className="flex cursor-pointer select-none items-center">
                          <input type="checkbox" value={t} onChange={toggleShippingType} className="peer sr-only" />
                          <span className="rounded-[28px] border-2 border-[#aab0ff] px-3 py-2 text-[12px] sm:text-[14px] text-[#777] peer-checked:bg-[#aab0ff] peer-checked:text-white">
                            {t.charAt(0) + t.slice(1).toLowerCase()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </section>
              </section>

              <section className="mt-5 flex flex-col gap-3 rounded-md">
                <h2 className="text-lg sm:text-xl">Headquarter address</h2>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Country</label>
                    <Input
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          hqAddress: { ...companyInfo.hqAddress, country: e.target.value },
                        })
                      }
                      type="text"
                      placeholder="enter your country"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">City</label>
                    <Input
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          hqAddress: { ...companyInfo.hqAddress, city: e.target.value },
                        })
                      }
                      type="text"
                      placeholder="enter your city"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium">Line 1</label>
                    <Input
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          hqAddress: { ...companyInfo.hqAddress, line1: e.target.value },
                        })
                      }
                      type="text"
                      placeholder="Street, building, apt"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium">Postal code</label>
                    <Input
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          hqAddress: { ...companyInfo.hqAddress, postalCode: e.target.value },
                        })
                      }
                      type="text"
                      placeholder="0105"
                    />
                  </div>
                </section>
              </section>

              <section className="mt-5 flex flex-col gap-3 rounded-md">
                <h2 className="text-lg sm:text-xl">Pricing</h2>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-medium">Base price</label>
                    <Input
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          pricing: { ...companyInfo.pricing, basePrice: Number(e.target.value) },
                        })
                      }
                      type="float"
                      placeholder="enter your base price"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Price per Kg</label>
                    <Input
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          pricing: { ...companyInfo.pricing, pricePerKg: Number(e.target.value) },
                        })
                      }
                      type="float"
                      placeholder="enter your per-kg price"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Fuel %</label>
                    <Input
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          pricing: { ...companyInfo.pricing, fuelPct: Number(e.target.value) },
                        })
                      }
                      type="float"
                      placeholder="0.10 = 10%"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Insurance %</label>
                    <Input
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          pricing: { ...companyInfo.pricing, insurancePct: Number(e.target.value) },
                        })
                      }
                      type="float"
                      placeholder="0.01 = 1%"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Remote area %</label>
                    <Input
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          pricing: { ...companyInfo.pricing, remoteAreaPct: Number(e.target.value) },
                        })
                      }
                      type="float"
                      placeholder="enter your remote area %"
                    />
                  </div>
                </section>

                <section className="mt-2">
                  <h3 className="text-base sm:text-lg mb-2">Type Multipliers</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Sea</label>
                      <Input
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            pricing: {
                              ...companyInfo.pricing,
                              typeMultipliers: { ...companyInfo.pricing.typeMultipliers, SEA: Number(e.target.value) },
                            },
                          })
                        }
                        type="float"
                        placeholder="1.2x"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Road</label>
                      <Input
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            pricing: {
                              ...companyInfo.pricing,
                              typeMultipliers: { ...companyInfo.pricing.typeMultipliers, ROAD: Number(e.target.value) },
                            },
                          })
                        }
                        type="float"
                        placeholder="1.3x"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Railway</label>
                      <Input
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            pricing: {
                              ...companyInfo.pricing,
                              typeMultipliers: {
                                ...companyInfo.pricing.typeMultipliers,
                                RAILWAY: Number(e.target.value),
                              },
                            },
                          })
                        }
                        type="float"
                        placeholder="1.1x"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Air</label>
                      <Input
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            pricing: {
                              ...companyInfo.pricing,
                              typeMultipliers: { ...companyInfo.pricing.typeMultipliers, AIR: Number(e.target.value) },
                            },
                          })
                        }
                        type="float"
                        placeholder="1.5x"
                      />
                    </div>
                  </div>
                </section>
              </section>
            </section>

            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Button type="submit" className="w-full sm:w-[30%]">
                Register
              </Button>
              <div className="text-sm text-center sm:text-left">
                <span>
                  Already have an account?{' '}
                  <Link to="/login" className="text-indigo-600 underline">
                    Login
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </section>
      </div>

      <aside className="hidden md:flex items-center justify-start bg-blue-600 text-white">
        <div className="mx-8 md:mx-10 lg:mx-16 flex flex-col items-start gap-5 md:gap-7">
          <h1 className="text-4xl lg:text-6xl leading-tight">International</h1>
          <h1 className="text-4xl lg:text-6xl leading-tight">Cargo</h1>
          <h1 className="text-4xl lg:text-6xl leading-tight">Shipping</h1>
          <h1 className="text-4xl lg:text-6xl leading-tight">Platform</h1>
        </div>
      </aside>
    </div>
  );
};

export default RegisterCompany;