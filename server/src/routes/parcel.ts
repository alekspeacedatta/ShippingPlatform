import { Router, Request, Response } from 'express'
import { ComapnyModel } from '../models/Company'
import { ParcelModel } from '../models/Parcel'
import { REQUEST_STATUS, RequestStatus } from '../types/types'

const router = Router()

router.get('/get-requests', async (req: Request, res: Response) => {
  try {
    const id = String(req.query.id || '')
    if (!id) return res.status(400).json({ message: 'id is required' })

    const requests = await ParcelModel.find({
      $or: [{ userId: id }, { companyId: id }],
    }).lean()

    return res.status(200).json(requests)
  } catch (e) {
    return res.status(500).json({ message: 'Error while fetching requests' })
  }
})
router.get('/get', async (req: Request, res: Response) => {
  try {
    const parcelId = String(req.query.parcelId || '')
    if (!parcelId) return res.status(400).json({ message: 'parcel Id does not exsist' })

    const selectedParcel = await ParcelModel.findById(parcelId).lean()
    const companyId = selectedParcel?.companyId
    const company = await ComapnyModel.findById(companyId)
    if (!company) res.status(400).json({ message: ' company for parcel transfer does not exisist ' })
    if (!selectedParcel) res.status(400).json({ message: ' parcel does not exisist ' })

    return res.status(200).json({ parcel: selectedParcel, company: company })
  } catch (error) {
    res.status(500).json({ message: 'error while searching selected parcel' })
  }
})
router.patch('/update-status', async (req: Request, res: Response) => {
  try {
    const { parcelId, status } = req.body as { parcelId?: string; status?: RequestStatus }

    if (!parcelId || !status) {
      return res.status(400).json({ message: 'parcelId and status are required' })
    }
    if (!REQUEST_STATUS.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' })
    }

    const updated = await ParcelModel.findByIdAndUpdate(
      parcelId,
      {
        $set: { status },
        $push: { timeline: { status, at: new Date().toISOString() } },
      },
      { new: true, runValidators: true },
    ).lean()

    if (!updated) return res.status(404).json({ message: 'Parcel not found' })

    return res.status(200).json(updated)
  } catch (err) {
    console.error('update-status error:', err)
    return res.status(500).json({ message: 'Error while updating status' })
  }
})

export default router
