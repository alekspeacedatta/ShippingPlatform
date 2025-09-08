import { useParams } from "react-router-dom";
import { useGetRequest } from "../../api/useParcel";
import { Badge } from "../commons/Badge";
import type { Company, ParcelRequest } from "../../types/Types";
import { statusColors } from "../../types/Types";


const RequestDetail = () => {

  const { parcelId } = useParams<{ parcelId: string }>();
  const { data, isLoading, isError, error } = useGetRequest(parcelId!);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  if(!data) return <p>parcel does not exsist</p>
  
  const parcel : ParcelRequest = data.parcel;
  const company: Company = data.company;  
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <div className="flex flex-col gap-5 min-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Your parcel details</h1>
          <Badge className={statusColors[parcel.status]}>{parcel.status}</Badge>
        </div>
        <div className=" rounded border p-3 md:flex md:flex-wrap  md:items-start gap-4 bg-white">
          <div className="flex flex-col gap-2 p-4  rounded ">
            <h2 className="text-lg font-semibold">{parcel.route.origin.country} → {parcel.route.destination.country} -  route: </h2>
            <div className="flex items-center gap-10">
              <div>
                <p className="text-gray-500 text-sm">pick up address: </p>
                <p className="text-sm">{parcel.route.pickupAddress.country}, {parcel.route.pickupAddress.city}</p>
                <p className="text-sm">{parcel.route.pickupAddress.line1}, {parcel.route.pickupAddress.postalCode}</p>

              </div>
              <div>
              <p className="text-gray-500 text-sm">Delivery Address: </p>
                <p className="text-sm">{parcel.route.deliveryAddress.country}, {parcel.route.deliveryAddress.city}</p>
                <p className="text-sm">{parcel.route.deliveryAddress.line1}, {parcel.route.deliveryAddress.postalCode}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 md:px-10 rounded md:border-l md:border-r ">
            <h2 className="text-lg font-semibold">Parcel Details: </h2>
            <div>
              <p className="text-sm"><span className="text-gray-500">width: </span> {parcel.parcel.widthCm}cm, <span className="text-gray-500">height: </span> {parcel.parcel.lengthCm}cm</p>
              <p className="text-sm"><span className="text-gray-500">height: </span> {parcel.parcel.heightCm}cm, <span className="text-gray-500">weight: </span> {parcel.parcel.weightKg}kg</p>
              <p className="text-sm"><span className="text-gray-500">fragile:</span> {parcel.parcel.fragile}, <span className="text-gray-500">kind: </span>{parcel.parcel.kind.toLocaleLowerCase()}</p>
              <p className="text-sm"><span className="text-gray-500">declared value: </span>{parcel.parcel.declaredValue}$</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4  rounded ">
            <h2 className="text-lg font-semibold">Company & shipping: </h2>
            <div>
              <p className="text-sm"><span className="text-gray-500">company: </span>{company.name}</p>
              <p className="text-sm"><span className="text-gray-500">shipping type: </span>{parcel.shippingType}</p>
              <p className="text-sm"><span className="text-gray-500">type multiplier: </span>{company.pricing.typeMultipliers[parcel.shippingType]}x</p>        
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-2xl">Total price {parcel.priceEstimate}$</h2>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
