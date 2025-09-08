const Stepper = ({ steps, current }: { steps: string[]; current: number }) => {
  const t = steps.length > 1 ? current / (steps.length - 1) : 0;

  return (
    <div className="relative">
      <div className="absolute top-[25%] -translate-y-1/2 w-full max-w-[100%] h-[3px] bg-gray-300" />
      <div
        className="absolute top-[25%] -translate-y-1/2 w-full h-[3px] max-w-[80%] bg-indigo-500 origin-left transition-transform duration-300"
        style={{ transform: `scaleX(${t})` }}
      />
      <ol className="relative flex items-start justify-between gap-1">
        {steps.map((s, i) => {
          const complete = i < current;
          const active = i === current;
          return (
            <li key={i} className="flex-1 flex flex-col items-center">
              <span
                className={[
                  "grid place-items-center rounded-full border-2 transition-all duration-200",
                  // circle sizes (tiny → larger)
                  "w-7 h-7 text-[12px] sm:w-9 sm:h-9 sm:text-sm md:w-10 md:h-10 md:text-base",
                  active
                    ? "bg-light-100 ring-4 ring-indigo-100 border-indigo-500"
                    : complete
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-white",
                ].join(" ")}
              >
                {i + 1}
              </span>

              <span className="mt-2 text-[10px] leading-tight text-center max-w-[72px] truncate sm:text-xs sm:max-w-[120px] md:text-sm md:max-w-none">
                {s}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
export default Stepper;