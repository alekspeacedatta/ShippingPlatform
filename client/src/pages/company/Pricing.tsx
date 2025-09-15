import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingForm, { type Banner } from '../../components/company/PricingForm';
import DashboardHeader from '../../components/company/dashboardHeader';

const Pricing = () => {
  const navigate = useNavigate();
  const [banner, setBanner] = useState<Banner | null>(null);

  return (
    <>
      <DashboardHeader />
      <div className="flex min-h-[90vh] flex-col items-center justify-center gap-4">
        <div className="flex w/full max-w-3xl flex-col gap-4">
          <div className="flex items-center gap-2">
            <p
              className="cursor-pointer hover:font-semibold hover:underline hover:underline-offset-4"
              onClick={() => navigate('/company/dashboard')}
            >
              Dashboard
            </p>
            <span>→</span>
            <p className="cursor-pointer font-semibold text-indigo-500 underline underline-offset-4 transition-all duration-200">
              Pricing
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold">Company Pricing form that you can edit</h1>

            {banner && (
              <div
                role="status"
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
        </div>
      </div>
    </>
  );
};

export default Pricing;
