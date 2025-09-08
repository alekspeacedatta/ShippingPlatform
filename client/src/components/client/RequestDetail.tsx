import { useParams } from "react-router-dom"
import { useGetRequest } from "../../api/useParcel"

const RequestDetail = () => {
    const { parcelId } = useParams<{parcelId: string}>();
    const { data: parcel, isLoading, isError, error } = useGetRequest(parcelId!);
    if(isLoading) return <p>Loading...</p>
    if(isError) return <p>Error: {error.message}</p>
    return (
      <h1>{parcel.route.origin.country}</h1>
    )
}
export default RequestDetail