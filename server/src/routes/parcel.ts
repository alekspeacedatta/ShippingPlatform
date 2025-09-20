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
    const { parcelId, status, note } = req.body as {
      parcelId?: string; status?: RequestStatus; note?: string;
    };

    if (!parcelId || !status) {
      return res.status(400).json({ message: 'parcelId and status are required' });
    }
    if (!REQUEST_STATUS.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const timelineEntry: any = { status, at: new Date().toISOString(), note: '' };
    if (note && note.trim()) timelineEntry.note = note.trim();

    const updated = await ParcelModel.findByIdAndUpdate(
      parcelId,
      {
        $set: { status },
        $push: { timeline: timelineEntry },
      },
      { new: true, runValidators: true },
    ).lean();

    if (!updated) return res.status(404).json({ message: 'Parcel not found' });

    return res.status(200).json(updated);
  } catch (err) {
    console.error('update-status error:', err);
    return res.status(500).json({ message: 'Error while updating status' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const parcel = await ParcelModel.findById(id).lean();
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });

    
    const company = parcel.companyId
      ? await ComapnyModel.findById(parcel.companyId, { name: 1, pricing: 1 }).lean()
      : undefined;

    res.json(company ? { parcel, company } : parcel);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch parcel' });
  }
});
export default router
