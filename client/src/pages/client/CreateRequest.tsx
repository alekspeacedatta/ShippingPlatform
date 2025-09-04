import { useGetCompanies } from "../../api/useCompany"
import ParcelForm from "../../components/client/ParcelForm";

const CreateRequest = () => {
    const {  isLoading, isError, error } = useGetCompanies();

    if(isLoading) return <p>Loading...</p>
    if(isError) return <p>Error: {error.message}</p>

    return (
        <div className="max-w-3xl md:max-w-4xl mx-auto p-6 gap-5 min-h-screen flex justify-center flex-col">
            <ParcelForm/>
        </div>
    )
}
export default CreateRequest