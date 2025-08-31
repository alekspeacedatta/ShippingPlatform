import { useRef, useState } from "react";
import { Button } from "../commons/Button";
import Stepper from "../commons/Stepper";
import { Input } from "../commons/Input";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);
const steps = ['Parcel Details', 'Route', 'Shipping Type', 'Calculator', 'Summary & Submit'];

export default function StepperDemo() {
  const [step, setStep] = useState(0);

  const secRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = secRef.current;
      if (!el) return;

      gsap.killTweensOf(el);

      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 8, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
      );
    },
    { dependencies: [step], scope: secRef }
  );

  return (
    <div className="max-w-3xl md:max-w-5xl mx-auto p-6 min-h-screen flex justify-center flex-col">
      <Stepper steps={steps} current={step} />

      <form className="p-4 border rounded-xl min-h-28 flex flex-col justify-center">
        <div ref={secRef} key={step} className="w-full">
          {step === 0 && (
            <section className="w-[40%] bg-white flex flex-col justify-center gap-3 mx-auto py-10">
              <section className="flex flex-col gap-2">
                <label>Parcel Weight</label>
                <Input placeholder="kg" />
              </section>
              <section className="flex flex-col gap-2">
                <label>Declared Value</label>
                <Input placeholder="123$" />
              </section>

              <section className="grid grid-cols-2 gap-3">
                <section className="flex flex-col col-span-2 gap-2">
                  <label>Width:</label>
                  <Input type="text" placeholder="width = 123cm" />
                </section>
                <section className="flex flex-col w-[95%] gap-2">
                  <label>Length:</label>
                  <Input type="text" placeholder="length = 132cm" />
                </section>
                <section className="flex flex-col gap-2">
                  <label>Height:</label>
                  <Input type="text" placeholder="height = 5cm" />
                </section>
              </section>
            </section>
          )}

          {step === 1 && (
            <div className="p-4 border rounded-xl min-h-28">
              <h2 className="text-lg font-semibold mb-2">Route</h2>
              <input placeholder="From → To" className="border p-2 w-full mb-2" />
              <input placeholder="Extra info" className="border p-2 w-full" />
            </div>
          )}

          {step === 2 && (
            <div className="p-4 border rounded-xl min-h-28">
              <h2 className="text-lg font-semibold mb-2">Shipping Type</h2>
              <input placeholder="Weight (kg)" className="border p-2 w-full mb-2" />
              <input placeholder="Type (e.g. SEA, AIR)" className="border p-2 w-full" />
            </div>
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
        </div>
      </form>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          back
        </button>
        <Button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}>
          {step === steps.length - 1 ? "Submit" : "next"}
        </Button>
      </div>
    </div>
  );
}
