const Stepper = ({ steps, current }: { steps: string[]; current: number }) => {
  const t = steps.length > 1 ? current / (steps.length - 1) : 0;

  return (
    <div className="relative">
      <div className="absolute top-[25%] h-[3px] w-full max-w-[100%] -translate-y-1/2 bg-gray-300" />
      <div
        className="absolute top-[25%] h-[3px] w-full max-w-[80%] origin-left -translate-y-1/2 bg-indigo-500 transition-transform duration-300"
        style={{ transform: `scaleX(${t})` }}
      />
      <ol className="relative flex items-start justify-between gap-1">
        {steps.map((s, i) => {
          const complete = i < current;
          const active = i === current;
          return (
            <li key={i} className="flex flex-1 flex-col items-center">
              <span
                className={[
                  'grid place-items-center rounded-full border-2 transition-all duration-200',
                  'h-7 w-7 text-[12px] sm:h-9 sm:w-9 sm:text-sm md:h-10 md:w-10 md:text-base',
                  active
                    ? 'bg-light-100 border-indigo-500 ring-4 ring-indigo-100'
                    : complete
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'bg-white',
                ].join(' ')}
              >
                {i + 1}
              </span>

              <span className="mt-2 max-w-[72px] truncate text-center text-[10px] leading-tight sm:max-w-[120px] sm:text-xs md:max-w-none md:text-sm">
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
