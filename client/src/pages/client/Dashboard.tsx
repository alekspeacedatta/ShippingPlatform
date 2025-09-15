import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/commons/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { useGetUser } from '../../api/useAuth';
import ClientHeader from '../../components/client/ClientHeader';

const Dashboard = () => {
  const { data: user, isLoading, isError, error } = useGetUser();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const navigation = (route: string) => {
    navigate(route);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };
  return (
    <>
      <ClientHeader/>
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <h1>{user?.fullName} this is your Dashboard</h1>
        <div className="flex items-center gap-10">
          <Button
            onClick={() => {
              navigation('/client/create-request');
            }}
          >
            Create Request
          </Button>
          <Button
            onClick={() => {
              navigation('/client/requests');
            }}
          >
            All Requests
          </Button>
          <Button
            onClick={() => {
              navigation('/client/track');
            }}
          >
            Track
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
