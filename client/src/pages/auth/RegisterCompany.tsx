import { Button } from '../../components/commons/Button';
import { Input } from '../../components/commons/Input';
import { Link } from 'react-router-dom';
import type { CompanyCreate, ShippingType } from '../../types/Types';
import { useRegisterCompany } from '../../api/useAuth';
import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const RegisterCompany = () => {
  const formRef = useRef(null);
  gsap.registerPlugin(useGSAP);
  useGSAP(() => {
    gsap.from(formRef.current, { opacity: 0, scale: 0.95, duration: 0.1 });
  });
  const { mutate, isError, error } = useRegisterCompany();
  const [shippingType, setShippingTypes] = useState<ShippingType[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const toggleShippingType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    const typedValue = value as ShippingType;
    setShippingTypes((prev) =>
      checked ? [...prev, typedValue] : prev.filter((v) => v !== typedValue),
    );
  };
  const toggleRegions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    setRegions((prev) => (checked ? [...prev, value] : prev.filter((v) => v !== value)));
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
    // @ts-ignore
    mutate({ ...companyInfo, regions, supportedTypes: shippingType });
  };
  return (
    <div className="flex h-[100vh] items-stretch">
      <div className="flex shrink-0 basis-full items-center justify-center px-6 py-8 md:basis-[760px]">
        <section
          ref={formRef}
          className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl ring-1 ring-black/5"
        >
          <form className="flex flex-col gap-4" onSubmit={handelCompanyRegister}>
            <h1 className="mb-1 text-2xl font-semibold">Company Registration</h1>
            {isError && <p className="text-red-800">{error.message}</p>}
            <section className="flex max-h-[60vh] flex-col gap-5 overflow-y-auto py-3 pr-2">
              <section className="flex flex-col gap-3 rounded-[8px]">
                <h2 className="text-xl">main info</h2>
                <section className="grid grid-cols-2 gap-4">
                  <section className="col-span-2 flex flex-col gap-[10px]">
                    <label>Contact Email: </label>
                    <Input
                      onChange={(e) =>
                        setCompanyInfo({ ...companyInfo, contactEmail: e.target.value })
                      }
                      type="email"
                      placeholder="enter your email"
                    />
                  </section>
                  <section className="flex flex-col gap-[10px]">
                    <label>password</label>
                    <Input
                      onChange={(e) => setCompanyInfo({ ...companyInfo, password: e.target.value })}
                      type="password"
                      placeholder="enter your password"
                    />
                  </section>
                  <section className="flex flex-col gap-[10px]">
                    <label>Company Name: </label>
                    <Input
                      onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                      type="text"
                      placeholder="enter your company name"
                    />
                  </section>
                  <section className="flex flex-col gap-[10px]">
                    <label>Phone: </label>
                    <Input
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                      type="text"
                      placeholder="enter your password"
                    />
                  </section>
                  <section className="flex flex-col gap-[10px]">
                    <label>logo url: </label>
                    <Input
                      onChange={(e) => setCompanyInfo({ ...companyInfo, logoUrl: e.target.value })}
                      type="text"
                      placeholder="enter your logo url"
                    />
                  </section>
                  <section className="flex flex-col gap-[10px]">
                    <label>Regions: </label>
                    <section className="flex flex-wrap gap-1 rounded-[8px] border-[2px] border-[#d0d4ff] bg-white p-2">
                      <label className="flex cursor-pointer select-none items-center">
                        <input
                          onChange={toggleRegions}
                          type="checkbox"
                          value="AR"
                          className="peer sr-only"
                        />
                        <span className="peer-checked:(bg-[#aab0ff] text-white) rounded-[28px] border-[2px] border-[#aab0ff] px-3 py-2 text-[14px] text-[#aaaaaa]">
                          AR
                        </span>
                      </label>
                      <label className="flex cursor-pointer select-none items-center">
                        <input
                          onChange={toggleRegions}
                          type="checkbox"
                          value="DE"
                          className="peer sr-only"
                        />
                        <span className="peer-checked:(bg-[#aab0ff] text-white) rounded-[28px] border-[2px] border-[#aab0ff] px-3 py-2 text-[14px] text-[#aaaaaa]">
                          DE
                        </span>
                      </label>
                      <label className="flex cursor-pointer select-none items-center">
                        <input
                          onChange={toggleRegions}
                          type="checkbox"
                          value="FR"
                          className="peer sr-only"
                        />
                        <span className="peer-checked:(bg-[#aab0ff] text-white) rounded-[28px] border-[2px] border-[#aab0ff] px-3 py-2 text-[14px] text-[#aaaaaa]">
                          FR
                        </span>
                      </label>
                      <label className="flex cursor-pointer select-none items-center">
                        <input
                          onChange={toggleRegions}
                          type="checkbox"
                          value="IT"
                          className="peer sr-only"
                        />
                        <span className="peer-checked:(bg-[#aab0ff] text-white) rounded-[28px] border-[2px] border-[#aab0ff] px-3 py-2 text-[14px] text-[#aaaaaa]">
                          IT
                        </span>
                      </label>
                      <label className="flex cursor-pointer select-none items-center">
                        <input
                          onChange={toggleRegions}
                          type="checkbox"
                          value="US"
                          className="peer sr-only"
                        />
                        <span className="peer-checked:(bg-[#aab0ff] text-white) rounded-[28px] border-[2px] border-[#aab0ff] px-3 py-2 text-[14px] text-[#aaaaaa]">
                          US
                        </span>
                      </label>
                      <label className="flex cursor-pointer select-none items-center">
                        <input
                          onChange={toggleRegions}
                          type="checkbox"
                          value="UK"
                          className="peer sr-only"
                        />
                        <span className="peer-checked:(bg-[#aab0ff] text-white) rounded-[28px] border-[2px] border-[#aab0ff] px-3 py-2 text-[14px] text-[#aaaaaa]">
                          UK
                        </span>
                      </label>
                      <label className="flex cursor-pointer select-none items-center">
                        <input
                          onChange={toggleRegions}
                          type="checkbox"
                          value="GE"
                          className="peer sr-only"
                        />
                        <span className="peer-checked:(bg-[#aab0ff] text-white) rounded-[28px] border-[2px] border-[#aab0ff] px-3 py-2 text-[14px] text-[#aaaaaa]">
                          GE
                        </span>
                      </label>
                    </section>
                  </section>
                  <section className="flex flex-col gap-[10px]">
                    <label>Shipping types: </label>
                    <section className="flex flex-wrap gap-1 rounded-[8px] border-[2px] border-[#d0d4ff] bg-white p-2">
                      <label className="flex cursor-pointer select-none items-center">
                        <input
                          type="checkbox"
                          value="RAILWAY"
                          onChange={toggleShippingType}
                          className="peer sr-only"
                        />
                        <span className="peer-checked:(bg-[#aab0ff] text-white) rounded-[28px] border-[2px] border-[#aab0ff] px-3 py-2 text-[14px] text-[#aaaaaa]">
                          Railway
                        </span>
                      </label>

                      <label className="flex cursor-pointer select-none items-center">
                        <input
                          type="checkbox"
                          value="ROAD"
                          onChange={toggleShippingType}
                          className="peer sr-only"
                        />
                        <span className="peer-checked:(bg-[#aab0ff] text-white) rounded-[28px] border-[2px] border-[#aab0ff] px-3 py-2 text-[14px] text-[#aaaaaa]">
                          Road
                        </span>
                      </label>

                      <label className="flex cursor-pointer select-none items-center">
                        <input
                          type="checkbox"
                          value="AIR"
                          onChange={toggleShippingType}
                          className="peer sr-only"
                        />
                        <span className="peer-checked:(bg-[#aab0ff] text-white) rounded-[28px] border-[2px] border-[#aab0ff] px-3 py-2 text-[14px] text-[#aaaaaa]">
                          Air
                        </span>
                      </label>

                      <label className="flex cursor-pointer select-none items-center">
                        <input
                          type="checkbox"
                          value="SEA"
                          onChange={toggleShippingType}
                          className="peer sr-only"
                        />
                        <span className="peer-checked:(bg-[#aab0ff] text-white) rounded-[28px] border-[2px] border-[#aab0ff] px-3 py-2 text-[14px] text-[#aaaaaa]">
                          Sea
                        </span>
                      </label>
                    </section>
                  </section>
                </section>
              </section>

              <section className="flex flex-col gap-3 rounded-[8px]">
                <h2>Headquorter address</h2>
                <section className="flex justify-between gap-4">
                  <section className="flex w-[48%] flex-col gap-3">
                    <section className="flex flex-col gap-[10px]">
                      <label>Country: </label>
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
                    </section>
                    <section className="flex flex-col gap-[10px]">
                      <label>City: </label>
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
                    </section>
                  </section>

                  <section className="flex w-[48%] flex-col gap-3">
                    <section className="flex flex-col gap-[10px]">
                      <label>Line1: </label>
                      <Input
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            hqAddress: { ...companyInfo.hqAddress, line1: e.target.value },
                          })
                        }
                        type="text"
                        placeholder="enter your line1"
                      />
                    </section>
                    <section className="flex flex-col gap-[10px]">
                      <label>Postal code: </label>
                      <Input
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            hqAddress: { ...companyInfo.hqAddress, postalCode: e.target.value },
                          })
                        }
                        type="text"
                        placeholder="enter your postalcode"
                      />
                    </section>
                  </section>
                </section>
              </section>

              <section className="flex flex-col gap-3 rounded-[8px]">
                <h2>pricing</h2>
                <section className="grid-row-2 grid grid-cols-2 gap-4">
                  <section className="col-span-2 flex flex-col gap-[10px]">
                    <label>BasePrice: </label>
                    <Input
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          pricing: { ...companyInfo.pricing, basePrice: Number(e.target.value) },
                        })
                      }
                      type="float"
                      placeholder="enter your baseprice"
                    />
                  </section>
                  <section className="flex flex-col gap-[10px]">
                    <label>PricePerKg: </label>
                    <Input
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          pricing: { ...companyInfo.pricing, pricePerKg: Number(e.target.value) },
                        })
                      }
                      type="float"
                      placeholder="enter your perkg price"
                    />
                  </section>
                  <section className="flex flex-col gap-[10px]">
                    <label>FuelPtc: </label>
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
                  </section>
                  <section className="flex flex-col gap-[10px]">
                    <label>insurancePct: </label>
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
                  </section>
                  <section className="flex flex-col gap-[10px]">
                    <label>RemoteAreaPct: </label>
                    <Input
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          pricing: {
                            ...companyInfo.pricing,
                            remoteAreaPct: Number(e.target.value),
                          },
                        })
                      }
                      type="float"
                      placeholder="enter your remoteAreaPct"
                    />
                  </section>
                </section>
                <section className="flex flex-col gap-3">
                  <h2>Type Multipliers</h2>
                  <section className="flex">
                    <section className="flex flex-col gap-[3px]">
                      <label>Sea:</label>
                      <Input
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            pricing: {
                              ...companyInfo.pricing,
                              typeMultipliers: {
                                ...companyInfo.pricing.typeMultipliers,
                                SEA: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-[86%]"
                        type="float"
                        placeholder="1.2x"
                      />
                    </section>
                    <section className="flex flex-col gap-[3px]">
                      <label>Road:</label>
                      <Input
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            pricing: {
                              ...companyInfo.pricing,
                              typeMultipliers: {
                                ...companyInfo.pricing.typeMultipliers,
                                ROAD: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-[86%]"
                        type="float"
                        placeholder="1.3x"
                      />
                    </section>
                    <section className="flex flex-col gap-[3px]">
                      <label>Railway:</label>
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
                        className="w-[86%]"
                        type="float"
                        placeholder="1.1x"
                      />
                    </section>
                    <section className="flex flex-col gap-[3px]">
                      <label>Air:</label>
                      <Input
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            pricing: {
                              ...companyInfo.pricing,
                              typeMultipliers: {
                                ...companyInfo.pricing.typeMultipliers,
                                AIR: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-[86%]"
                        type="float"
                        placeholder="1.5x"
                      />
                    </section>
                  </section>
                </section>
              </section>
            </section>

            <div className="mt-2 flex items-center gap-4">
              <Button type="submit" className="w-[30%]">
                Register
              </Button>
              <div className="text-sm">
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

      <aside className="hidden flex-1 items-center justify-start bg-blue-600 text-white md:flex">
        <div className="ml-[30px] flex flex-col items-start gap-7">
          <h1 className="text-5xl leading-tight">International</h1>
          <h1 className="text-5xl leading-tight">Cargo</h1>
          <h1 className="text-5xl leading-tight">Shipping</h1>
          <h1 className="text-5xl leading-tight">Platform</h1>
        </div>
      </aside>
    </div>
  );
};

export default RegisterCompany;
