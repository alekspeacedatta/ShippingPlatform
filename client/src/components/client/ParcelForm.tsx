import { useRef, useState } from "react";
import { Button } from "../commons/Button";
import Stepper from "../commons/Stepper";
import { Input } from "../commons/Input";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Select, Option } from "../commons/Select";

gsap.registerPlugin(useGSAP);
const steps = ['Parcel Details', 'Route', 'Shipping Type', 'Calculator', 'Summary & Submit'];

export default function StepperDemo() {
  const [step, setStep] = useState(0);
  const back = () => {setStep(s => Math.max(0, s - 1))}
  const next = () => {setStep(s => Math.min(steps.length - 1, s + 1))}
  const secRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = secRef.current;
      if (!el) return;

      gsap.killTweensOf(el);

      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 8, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    },
    { dependencies: [step], scope: secRef }
  );

  return (
    <div className="max-w-3xl md:max-w-5xl mx-auto p-6 gap-5 min-h-screen flex justify-center flex-col">
      <Stepper steps={steps} current={step} />

      <form className="p-4 border rounded-xl min-h-28 flex flex-col justify-center">
        <div ref={secRef} key={step} className="w-full">
          {step === 0 && (
            <section className="bg-white flex flex-col justify-center gap-3 mx-auto py-10 px-5 rounded-xl min-h-28">
              <h2 className="text-2xl font-semibold">Details:</h2>

              <section className="grid-cols-2 grid gap-2">
                <section className="flex flex-col gap-2 ">
                  <label>Parcel Weight</label>
                  <Input placeholder="kg" />
                </section>
                <section className="flex flex-col gap-2">
                  <label>Parcel Type</label>
                  <Select>
                    <Option>DOCUMENTS</Option>
                    <Option>GOODS</Option>
                  </Select>
                </section>
              </section>

              <section className="grid grid-cols-2 gap-2">
                <section className="flex flex-col col-span-2 gap-2">
                  <label>Width in cm:</label>
                  <Input type="text" placeholder="width = 123" />
                </section>
                <section className="flex flex-col gap-2">
                  <label>Length in cm:</label>
                  <Input type="text" placeholder="length = 132" />
                </section>
                <section className="flex flex-col gap-2">
                  <label>Height in cm:</label>
                  <Input type="text" placeholder="height = 5" />
                </section>
              </section>

              <section className="flex flex-col ">
                <label htmlFor="">Decleared Value</label>
                <Input type="text" placeholder="30$"/>
              </section>
            </section>
          )}

          {step === 1 && (
            <section className="p-4 border rounded-xl min-h-28 bg-white flex flex-col justify-center gap-3 mx-auto py-10 px-5 rounded-xl">
              <h2 className="text-2xl font-semibold">Route:</h2>
              <section className="grid grid-cols-2 gap-2">
                <section className="flex flex-col gap-2">
                  <label className=" text-lg ">Origin</label>
                  <Input placeholder="country"/>
                  <Input placeholder="city"/>
                </section>
                <section className="flex flex-col gap-2">
                  <label className=" text-lg ">Pickup address</label>
                  <section className="grid grid-cols-2 gap-3">
                    <Input placeholder="country"/>
                    <Input placeholder="city"/>
                    <Input placeholder="line1"/>
                    <Input placeholder="postalcode"/>
                  </section>
                </section>
                
              </section>
              <section className="grid grid-cols-2 gap-2">
                <section className="flex flex-col gap-2">
                  <label className="text-lg">Destination</label>
                  <Input placeholder="country"/>
                  <Input placeholder="city"/>
                </section>
                <section className="flex flex-col gap-2">
                  <label className=" text-lg ">delivery address</label>
                  <section className="grid grid-cols-2 gap-3">
                    <Input placeholder="country"/>
                    <Input placeholder="city"/>
                    <Input placeholder="line1"/>
                    <Input placeholder="postalcode"/>
                  </section>
                </section>
              </section>
            </section>
          )}

          {step === 2 && (
            <section className="bg-white flex flex-col justify-center gap-6 mx-auto py-10 px-5 rounded-xl min-h-28">
              <h2 className="text-2xl font-semibold">Shipping Type</h2>

              <section className="flex justify-between">
                <section className="flex items-center gap-2">
                  <h3 className="text-xl">Sea</h3>
                  <input type="radio" name="shippingType" value="SEA" />
                </section>
                <section>
                  <h3 className="text-xl">type multiplier</h3>
                  <p>1.2x</p>
                </section>
              </section>

              <section className="flex justify-between">
                <section className="flex items-center gap-2">
                  <h3 className="text-xl">Road</h3>
                  <input type="radio" name="shippingType" value="ROAD" />
                </section>
                <section>
                  <h3 className="text-xl">type multiplier</h3>
                  <p>1.5x</p>
                </section>
              </section>

              <section className="flex justify-between">
                <section className="flex items-center gap-2">
                  <h3 className="text-xl">RailWay</h3>
                  <input type="radio" name="shippingType" value="RAILWAY" />
                </section>
                <section>
                  <h3 className="text-xl">type multiplier</h3>
                  <p>1.3x</p>
                </section>
              </section>

              <section className="flex justify-between">
                <section className="flex items-center gap-2">
                  <h3 className="text-xl">Air</h3>
                  <input type="radio" name="shippingType" value="AIR" />
                </section>
                <section>
                  <h3 className="text-xl">type multiplier</h3>
                  <p>1.9x</p>
                </section>
              </section>
            </section>
          )}

          {step === 3 && (
            <div className="p-4 border rounded-xl min-h-28">
              <h2 className="text-lg font-semibold mb-2">Calculator</h2>
              <input placeholder="Base price" className="border p-2 w-full mb-2" />
              <input placeholder="Fuel/Insurance %" className="border p-2 w-full" />
            </div>
          )}

          {step === 4 && (
            <div className="p-4 border rounded-xl min-h-28">
              <h2 className="text-lg font-semibold mb-2">Summary & Submit</h2>
              <input placeholder="Review details…" className="border p-2 w-full mb-2" />
              <input placeholder="Notes" className="border p-2 w-full" />
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <Button
              onClick={back}
              disabled={step === 0}
              className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              back
            </Button>
            <Button onClick={next} type="submit">
              {step === steps.length - 1 ? "Submit" : "next"}
            </Button>
          </div>
        </div>
      </form>

    </div>
  );
}
