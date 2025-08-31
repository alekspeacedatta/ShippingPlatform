import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/commons/Button";
import { useAuthStore } from "../../store/useAuthStore"

const Dashboard = () => {
    const logout = useAuthStore(state => state.logout);
    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();
    const navigation = (route: string) => {
        navigate(route);
    }
    return (
        <>
            <div className="min-h-screen flex justify-center items-center flex-col gap-3"> 
                <h1>{user?.fullName} this is your Dashboard</h1>
                <div className="flex gap-10 items-center">
                    <Button onClick={() => { navigation('/client/create-request') }}>Create Request</Button>
                    <Button onClick={() => { navigation('/client/requests/:id') }}>All Requests</Button>
                    <Button onClick={() => { navigation('/client/track') }}>Track</Button>
                    <Button onClick={logout}>Logout</Button>
                </div>
            </div>
        </>
    )
}
export default Dashboard