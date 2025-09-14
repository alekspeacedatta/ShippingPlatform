import { useNavigate, useParams } from 'react-router-dom'
import { useGetRequest, useUpdateParcelStatus } from '../../api/useParcel'
import { Badge } from '../commons/Badge'
import type { Company, ParcelRequest } from '../../types/Types'
import { REQUEST_STATUS, statusColors, type RequestStatus } from '../../types/Types'

const prettyStatus = (s?: string) => (s ? s.replace(/_/g, ' ') : '—')

const RequestDetailPanel = () => {
  const navigate = useNavigate()
  const { parcelId } = useParams<{ parcelId: string }>()

  const { data, isLoading, isError, error } = useGetRequest(parcelId!)
  const { mutate: updateStatus, isPending } = useUpdateParcelStatus()

  const raw = data as any
  const parcel: ParcelRequest | undefined = raw?.parcel ?? raw
  const company: Company | undefined = raw?.company

  const currentStatus = (parcel?.status as RequestStatus | undefined) ?? undefined
  const badgeClass = currentStatus ? statusColors[currentStatus] : 'bg-gray-400'

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error: {error.message}</p>
  if (!parcel) return <p>parcel does not exsist</p>

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as RequestStatus
    if (!parcelId || !next || next === parcel.status) return
    updateStatus({ parcelId, status: next })
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <div className='min-w-5xl mx-auto flex flex-col gap-5'>
        <div className='flex items-center gap-2'>
          <p
            className='cursor-pointer hover:font-semibold hover:underline hover:underline-offset-4'
            onClick={() => navigate(-1)}
          >
            all request
          </p>
          <span>→</span>
          <p className='cursor-pointer font-semibold text-indigo-500 underline underline-offset-4 transition-all duration-200'>
            request details panel
          </p>
        </div>

        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Your parcel details</h1>

          <div className='flex items-center gap-3'>
            <Badge className={badgeClass}>{prettyStatus(parcel.status)}</Badge>

            <select
              className='rounded border bg-white px-3 py-2'
              value={currentStatus ?? ''}
              onChange={handleStatusChange}
              disabled={isPending}
            >
              {!currentStatus && (
                <option value='' disabled>
                  Select status…
                </option>
              )}
              {REQUEST_STATUS.map((s) => (
                <option key={s} value={s}>
                  {prettyStatus(s)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='gap-4 rounded border bg-white p-3 md:flex md:flex-wrap md:items-start'>
          <div className='flex flex-col gap-2 rounded p-4'>
            <h2 className='text-lg font-semibold'>
              {parcel.route.origin.country} → {parcel.route.destination.country} - route:
            </h2>
            <div className='flex items-center gap-10'>
              <div>
                <p className='text-sm text-gray-500'>Pick up address:</p>
                <p className='text-sm'>
                  {parcel.route.pickupAddress.country}, {parcel.route.pickupAddress.city}
                </p>
                <p className='text-sm'>
                  {parcel.route.pickupAddress.line1}, {parcel.route.pickupAddress.postalCode}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Delivery address:</p>
                <p className='text-sm'>
                  {parcel.route.deliveryAddress.country}, {parcel.route.deliveryAddress.city}
                </p>
                <p className='text-sm'>
                  {parcel.route.deliveryAddress.line1}, {parcel.route.deliveryAddress.postalCode}
                </p>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2 rounded p-4 md:border-l md:border-r md:px-10'>
            <h2 className='text-lg font-semibold'>Parcel Details:</h2>
            <div>
              <p className='text-sm'>
                <span className='text-gray-500'>width: </span> {parcel.parcel.widthCm}cm,{' '}
                <span className='text-gray-500'>length: </span> {parcel.parcel.lengthCm}cm
              </p>
              <p className='text-sm'>
                <span className='text-gray-500'>height: </span> {parcel.parcel.heightCm}cm,{' '}
                <span className='text-gray-500'>weight: </span> {parcel.parcel.weightKg}kg
              </p>
              {parcel.parcel.kind && (
                <p className='text-sm'>
                  <span className='text-gray-500'>kind: </span>
                  {parcel.parcel.kind.toLowerCase()}
                </p>
              )}
              {'declaredValue' in parcel.parcel && (
                <p className='text-sm'>
                  <span className='text-gray-500'>declared value: </span>
                  {parcel.parcel.declaredValue}$
                </p>
              )}
            </div>
          </div>

          {company && (
            <div className='flex flex-col gap-2 rounded p-4'>
              <h2 className='text-lg font-semibold'>Company & shipping:</h2>
              <div>
                <p className='text-sm'>
                  <span className='text-gray-500'>company: </span>
                  {company.name}
                </p>
                <p className='text-sm'>
                  <span className='text-gray-500'>shipping type: </span>
                  {parcel.shippingType}
                </p>
                <p className='text-sm'>
                  <span className='text-gray-500'>type multiplier: </span>
                  {company.pricing.typeMultipliers[parcel.shippingType]}x
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className='text-2xl font-semibold'>Total price {parcel.priceEstimate}$</h2>
        </div>
      </div>
    </div>
  )
}

export default RequestDetailPanel
