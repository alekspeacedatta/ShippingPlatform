// type Props = {
//   steps: string[];
//   current: number;
// };

// export default function Stepper({ steps, current }: Props) {
//   const pct = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 0;

//   return (
//     <div className="relative ">
//       {/* base line */}
//       <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded"></div>
//       {/* progress line */}
//       <div
//         className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 rounded transition-all duration-300"
//         style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }}
//       ></div>

//       <ol className="relative z-10 flex flex-wrap">
//         {steps.map((label, i) => {
//           const completed = i < current;
//           const active = i === current;
//           return (
//             <li
//               key={label}
//               className="flex-1 min-w-[120px] flex flex-col items-center gap-2 px-2 text-center"
//             >
//               <div
//                 className={[
//                   "w-8 h-8 rounded-full border-2 grid place-items-center text-sm font-semibold transition-all duration-200",
//                   completed
//                     ? "bg-indigo-500 border-indigo-500 text-white"
//                     : active
//                     ? "bg-white border-indigo-500 text-indigo-600 ring-4 ring-indigo-100"
//                     : "bg-white border-gray-300 text-gray-500",
//                 ].join(" ")}
//               >
//                 {i + 1}
//               </div>
//               <h3
//                 className={[
//                   "text-xs md:text-sm font-medium",
//                   completed ? "text-gray-700" : active ? "text-indigo-600" : "text-gray-500",
//                 ].join(" ")}
//               >
//                 {label}
//               </h3>
//             </li>
//           );
//         })}
//       </ol>
//     </div>
//   );
// }
const Stepper = () => {
    return (
        <ol className="c-stepper">
            <li className="c-stepper_item">
                <h3 className="c-stepper_title">1</h3>
                <p className="c-stepper_desc">step 1</p>
            </li>
            <li className="c-stepper_item">
                <h3 className="c-stepper_title">2</h3>
                <p className="c-stepper_desc">step 2</p>
            </li>
            <li className="c-stepper_item">
                <h3 className="c-stepper_title">3</h3>
                <p className="c-stepper_desc">step 3</p>
            </li>
            <li className="c-stepper_item">
                <h3 className="c-stepper_title">4</h3>
                <p className="c-stepper_desc">step 4</p>
            </li>
            <li className="c-stepper_item">
                <h3 className="c-stepper_title">5</h3>
                <p className="c-stepper_desc">step 5</p>
            </li>
            <li className="c-stepper_item">
                <h3 className="c-stepper_title">6</h3>
                <p className="c-stepper_desc">step 6</p>
            </li>
            <li className="c-stepper_item">
                <h3 className="c-stepper_title">7</h3>
                <p className="c-stepper_desc">step 7</p>
            </li>
        </ol>           
    )
}
export default Stepper