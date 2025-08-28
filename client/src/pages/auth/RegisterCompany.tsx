import { Button } from "../../components/commons/Button"
import { Input } from "../../components/commons/Input"
import { Link } from "react-router-dom"
import { useState } from "react"

const RegisterCompany = () => {
  const [shippingType, setShippingTypes] = useState<string[]>([]);

  const toggleShippingType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    setShippingTypes(prev =>
      checked ? [...prev, value] : prev.filter(v => v !== value)
    );
  };

  return (
    <div className='flex h-[100vh] items-stretch'>
      <div className="basis-full md:basis-[760px] shrink-0 flex items-center justify-center px-6 py-8">
        <section className="w-full max-w-lg bg-white rounded-3xl shadow-2xl ring-1 ring-black/5 p-10">
          <form className="flex flex-col gap-4">
            <h1 className="mb-1 text-2xl font-semibold">Register</h1>

            <section className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto pr-2">
              <section className="flex flex-col gap-3 bg-light-400 rounded-[8px] p-[10px]">
                <h2 >main info</h2>
                <section className="flex justify-between gap-4">
                  <section className="flex flex-col gap-3 w-[48%]">
                    <section className='flex flex-col gap-[10px]'>
                      <label>Company Name: </label>
                      <Input type='text' placeholder='enter your company name' />
                    </section>

                    <section className='flex flex-col gap-[10px]'>
                      <label>Contact Email: </label>
                      <Input type='mail' placeholder='enter your email' />
                    </section>

                    <section className='flex flex-col gap-[10px]'>
                      <label>Shipping types: </label>
                      <section className="border-[2px] border-[#d0d4ff] flex flex-wrap gap-1 p-2 rounded-[8px] bg-white">
                        <label className="flex items-center cursor-pointer select-none">
                          <input type="checkbox" value='RAILWAY' onChange={toggleShippingType} className="sr-only peer" />
                          <span className="px-3 py-2 text-[14px] text-[#aaaaaa] rounded-[28px] border-[2px] border-[#aab0ff] peer-checked:(bg-[#aab0ff] text-white)">Railway</span>
                        </label>

                        <label className="flex items-center cursor-pointer select-none">
                          <input type="checkbox" value='ROAD' onChange={toggleShippingType} className="sr-only peer" />
                          <span className="px-3 py-2 text-[14px] text-[#aaaaaa] rounded-[28px] border-[2px] border-[#aab0ff] peer-checked:(bg-[#aab0ff] text-white)">Road</span>
                        </label>

                        <label className="flex items-center cursor-pointer select-none">
                          <input type="checkbox" value='AIR' onChange={toggleShippingType} className="sr-only peer" />
                          <span className="px-3 py-2 text-[14px] text-[#aaaaaa] rounded-[28px] border-[2px] border-[#aab0ff] peer-checked:(bg-[#aab0ff] text-white)">Air</span>
                        </label>

                        <label className="flex items-center cursor-pointer select-none">
                          <input type="checkbox" value='SEA' onChange={toggleShippingType} className="sr-only peer" />
                          <span className="px-3 py-2 text-[14px] text-[#aaaaaa] rounded-[28px] border-[2px] border-[#aab0ff] peer-checked:(bg-[#aab0ff] text-white)">Sea</span>
                        </label>
                      </section>
                    </section>
                  </section>

                  <section className="flex flex-col gap-3 w-[48%]">
                    <section className='flex flex-col gap-[10px]'>
                      <label>Phone: </label>
                      <Input type='text' placeholder='enter your password' />
                    </section>

                    <section className='flex flex-col gap-[10px]'>
                      <label>logo url: </label>
                      <Input type='text' placeholder='enter your logo url' />
                    </section>

                    <section className='flex flex-col gap-[10px]'>
                      <label>Regions: </label>
                      <section className="border-[2px] border-[#d0d4ff] flex flex-wrap gap-1 p-2 rounded-[8px] bg-white">
                        <label className="flex items-center cursor-pointer select-none">
                          <input type="checkbox" value='AR' className="sr-only peer" />
                          <span className="px-3 py-2 text-[14px] text-[#aaaaaa] rounded-[28px] border-[2px] border-[#aab0ff] peer-checked:(bg-[#aab0ff] text-white)">AR</span>
                        </label>

                        <label className="flex items-center cursor-pointer select-none">
                          <input type="checkbox" value='US'  className="sr-only peer" />
                          <span className="px-3 py-2 text-[14px] text-[#aaaaaa] rounded-[28px] border-[2px] border-[#aab0ff] peer-checked:(bg-[#aab0ff] text-white)">US</span>
                        </label>

                        <label className="flex items-center cursor-pointer select-none">
                          <input type="checkbox" value='UK'  className="sr-only peer" />
                          <span className="px-3 py-2 text-[14px] text-[#aaaaaa] rounded-[28px] border-[2px] border-[#aab0ff] peer-checked:(bg-[#aab0ff] text-white)">UK</span>
                        </label>

                        <label className="flex items-center cursor-pointer select-none">
                          <input type="checkbox" value='GE'  className="sr-only peer" />
                          <span className="px-3 py-2 text-[14px] text-[#aaaaaa] rounded-[28px] border-[2px] border-[#aab0ff] peer-checked:(bg-[#aab0ff] text-white)">GE</span>
                        </label>
                      </section>
                    </section>
                  </section>
                </section>
              </section>

              <section className="flex flex-col gap-3 bg-light-400 rounded-[8px] p-[10px]">
                <h2>Headquorter address</h2>
                <section className="flex justify-between gap-4">
                  <section className="flex flex-col gap-3 w-[48%]">
                    <section className='flex flex-col gap-[10px]'>
                      <label>Country: </label>
                      <Input type='text' placeholder='enter your country' />
                    </section>
                    <section className='flex flex-col gap-[10px]'>
                      <label>City: </label>
                      <Input type='email' placeholder='enter your city' />
                    </section>
                  </section>

                  <section className="flex flex-col gap-3 w-[48%]">
                    <section className='flex flex-col gap-[10px]'>
                      <label>Line1: </label>
                      <Input type='text' placeholder='enter your line1' />
                    </section>
                    <section className='flex flex-col gap-[10px]'>
                      <label>Postal code: </label>
                      <Input type='text' placeholder='enter your postalcode' />
                    </section>
                  </section>
                </section>
              </section>

              
              <section className="flex flex-col gap-3 bg-light-400 rounded-[8px] p-[10px]">
                <h2>pricing</h2>
                <section className="flex justify-between gap-4">
                  <section className="flex flex-col gap-3 w-[48%]">
                    <section className='flex flex-col gap-[10px]'>
                      <label>BasePrice: </label>
                      <Input type='text' placeholder='enter your baseprice' />
                    </section>
                    <section className='flex flex-col gap-[10px]'>
                      <label>PricePerKg: </label>
                      <Input type='email' placeholder='enter your perkg price' />
                    </section>
                    <section className='flex flex-col gap-[10px]'>
                      <label>FuelPtc: </label>
                      <Input type='email' placeholder='enter your fuelPtc' />
                    </section>
                  </section>

                  <section className="flex flex-col gap-3 w-[48%]">
                    <section className='flex flex-col gap-[10px]'>
                      <label>insurancePct: </label>
                      <Input type='text' placeholder='enter your insurancePct' />
                    </section>
                    <section className='flex flex-col gap-[10px]'>
                      <label>postalcode: </label>
                      <Input type='text' placeholder='enter your postalcode' />
                    </section>
                    <section className='flex flex-col gap-[10px]'>
                      <label>RemoteAreaPct: </label>
                      <Input type='text' placeholder='enter your remoteAreaPct' />
                    </section>
                  </section>
                </section>
              </section>
            </section>

            <div className="mt-2 flex items-center gap-4">
              <Button type="submit" className="w-[30%]">Register</Button>
              <div className="text-sm">
                <span>
                  Already have an account?{" "}
                  <Link to="/login" className="text-indigo-600 underline">Login</Link>
                </span>
              </div>
            </div>
          </form>
        </section>
      </div>

      <aside className="hidden md:flex flex-1 items-center justify-start bg-blue-600 text-white">
        <div className="flex flex-col items-start ml-[30px] gap-7">
          <h1 className="text-5xl leading-tight">International</h1>
          <h1 className="text-5xl leading-tight">Cargo</h1>
          <h1 className="text-5xl leading-tight">Shipping</h1>
          <h1 className="text-5xl leading-tight">Platform</h1>
        </div>
      </aside>
    </div>
  )
}

export default RegisterCompany
