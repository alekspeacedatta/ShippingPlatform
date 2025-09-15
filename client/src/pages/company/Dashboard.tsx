import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/company/dashboardHeader';

const Dashboard = () => {
  const navigate = useNavigate();
  const navigation = (route: string) => {
    navigate(route);
  };
  return (
    <>
      <DashboardHeader/>
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-6">
          <div
            onClick={() => navigation('/company/requests')}
            className=" col-span-2 rounded-xl border-2 border-indigo-400 p-5 h-[30vh] flex flex-col justify-between cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
            <img
              src="../../public/Screenshot 2025-09-15 162420.png"
              className="w-full h-full object-cover rounded-lg"
              alt="Requests"
            />
          </div>

          <div
            onClick={() => navigation('/company/pricing')}
            className="rounded-xl cursor-pointer ring hover:ring-indigo-400 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg p-3 w-[10vw] flex flex-col justify-between"
          >
            <img
              src="../../Screenshot 2025-09-15 163300.png"
              className="rounded-xl object-cover w-full h-full"
              alt=""
            />
          </div>

          <div
            onClick={() => navigation('/company/settings')}
            className="rounded-xl border-2 border-indigo-400 p-5 h-[30vh] flex flex-col justify-between cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
            <img
              src="../../public/Screenshot 2025-09-15 164708.png"
              className="w-full h-full object-cover rounded-lg"
              alt="Requests"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
