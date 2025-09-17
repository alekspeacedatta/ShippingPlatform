import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingForm, { type Banner } from '../../components/company/PricingForm';
import DashboardHeader from '../../components/company/DashboardHeader';

const Pricing = () => {
  const navigate = useNavigate();
  const [banner, setBanner] = useState<Banner | null>(null);

  return (
    <>
      <DashboardHeader />

      <main className="min-h-[90vh]">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-10 flex flex-col gap-4 sm:gap-6">
          
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button
              onClick={() => navigate('/company/dashboard')}
              className="hover:font-semibold hover:underline underline-offset-4"
            >
              Dashboard
            </button>
            <span className="text-gray-400">→</span>
            <span className="font-semibold text-indigo-500 underline underline-offset-4">Pricing</span>
          </div>

          
          <h1 className="text-xl sm:text-2xl font-semibold">
            Company Pricing form that you can edit
          </h1>

          
          {banner && (
            <div
              role="status"
              aria-live="polite"
              className={`rounded-lg p-3 text-sm ring-1 ${
                banner.type === 'success'
                  ? 'bg-green-50 text-green-700 ring-green-200'
                  : 'bg-red-50 text-red-700 ring-red-200'
              }`}
            >
              {banner.text}
            </div>
          )}

          
          <PricingForm onResult={setBanner} />
        </div>
      </main>
    </>
  );
};

export default Pricing;
