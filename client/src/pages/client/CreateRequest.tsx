import { useGetCompanies } from "../../api/useCompany"
import ParcelForm from "../../components/client/ParcelForm";

const CreateRequest = () => {
    const { data: companies, isLoading, isError, error } = useGetCompanies();

    if(isLoading) return <p>Loading...</p>
    if(isError) return <p>Error: {error.message}</p>

    return (
        <div className="flex justify-between">
            <ParcelForm/>
            <div>
                {companies.map((c : any) => (
                    <h1 key={c._id}>{c.name}</h1>
                ))}
            </div>
        </div>
    )
}
export default CreateRequest