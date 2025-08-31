const Stepper = ({ steps, current }: { steps: string[]; current: number }) => {
  const t = steps.length > 1 ? current / (steps.length - 1) : 0;

  return (
    <div className="relative">
      <div className="absolute top-[25%] -translate-y-1/2 w-full h-[3px] bg-gray-300" />
      <div
        className="absolute top-[25%] -translate-y-1/2 w-full h-[3px] bg-indigo-500 origin-left transition-transform duration-300"
        style={{ transform: `scaleX(${t})` }}
      />
      <ol className="flex justify-around relative">
        {steps.map((s, i) => {
          const complete = i < current;
          const active = i === current;
          return (
            <li key={i} className="flex flex-col items-center gap-2 min-w-[20%]">
              <p
                className={`px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200 ${ active ? "bg-light-100 ring-4 ring-indigo-100 border-indigo-500" : complete ? "bg-indigo-500 text-white border-indigo-500" : "bg-white" }`} >
                {i + 1}
              </p>
              <p className="text-base">{s}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
export default Stepper;