import { useNavigate } from 'react-router-dom';
import PricingForm from '../../components/company/PricingForm';

const Pricing = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <p
            className="cursor-pointer hover:font-semibold hover:underline hover:underline-offset-4"
            onClick={() => navigate(-1)}
          >
            Dashboard
          </p>
          <span>→</span>
          <p className="cursor-pointer font-semibold text-indigo-500 underline underline-offset-4 transition-all duration-200">
            Pricing
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font=semibold text-2xl">Company Pricing form that you can edit</h1>
          <PricingForm />
        </div>
      </div>
    </div>
  );
};
export default Pricing;
