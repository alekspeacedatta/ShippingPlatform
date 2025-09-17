import DashboardHeader from '../../components/company/DashboardHeader';
import RequestsTable from '../../components/company/RequestsTable';
import { useNavigate } from 'react-router-dom';

const Requests = () => {
  const navigate = useNavigate();

  return (
    <>
      <DashboardHeader />
      <div className="flex items-start justify-center p-3">
        <div className="flex w-8xl max-w-full flex-col gap-3">
          <div className="flex w-full flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div className="top-74  md:top-30 md:absolute flex items-center gap-2">
              <p
                className="cursor-pointer hover:font-semibold hover:underline hover:underline-offset-4"
                onClick={() => navigate('/company/dashboard')}
              >
                Dashboard
              </p>
              <span>→</span>
              <p
                className="cursor-pointer font-semibold text-indigo-500 underline underline-offset-4 transition-all duration-200"
                onClick={() => navigate(1)}
              >
                All Request
              </p>
            </div>
          </div>
          <RequestsTable />
        </div>
      </div>
    </>
  );
};

export default Requests;
