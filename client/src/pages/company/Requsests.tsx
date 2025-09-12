import RequestsTable from '../../components/company/RequestsTable';
import { useNavigate } from 'react-router-dom';

const Requsests = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center p-3">
      <div className="flex w-full max-w-full flex-col gap-3">
        <div className="flex items-center gap-2 absolute">
          <p
            className="cursor-pointer hover:font-semibold hover:underline hover:underline-offset-4"
            onClick={() => navigate(-1)}
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
        <RequestsTable />
      </div>
    </div>
  );
};
export default Requsests;
