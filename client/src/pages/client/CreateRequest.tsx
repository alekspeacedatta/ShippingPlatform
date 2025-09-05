import { useNavigate } from "react-router-dom";
import { useGetCompanies } from "../../api/useCompany"
import ParcelForm from "../../components/client/ParcelForm";

const CreateRequest = () => {
    const navigate = useNavigate();
    const {  isLoading, isError, error } = useGetCompanies();

    if(isLoading) return <p>Loading...</p>
    if(isError) return <p>Error: {error.message}</p>

    return (
        <div className="max-w-3xl md:max-w-5xl mx-auto p-6 gap-5 min-h-screen flex justify-center flex-col">
            <div className="flex items-center gap-2">
                <p className="cursor-pointer hover:underline hover:underline-offset-4 hover:font-semibold" onClick={() => navigate(-1)}>Dashboard</p>
                <span>→</span>
                <p className="cursor-pointer underline transition-all duration-200 underline-offset-4 font-semibold text-indigo-500" onClick={() => navigate(-1)}>Create Request</p>
            </div>
            <ParcelForm/>
        </div>        
    )
}
export default CreateRequest