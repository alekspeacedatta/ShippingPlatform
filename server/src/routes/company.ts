import { Router, Request, Response } from "express";
import { ComapnyModel } from "../models/Company";
import { ParcelModel } from "../models/Parcel";

const router = Router();

router.get('/get', async ( req: Request, res: Response ) => {
    try {
        const companies = await ComapnyModel.find().select('-password');
        if(!companies) res.status(400).json({ message: "Companies does not exsist" });

        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: "Error while fetching companies", error })
    }
})
router.get("/get-requests", async (req, res) => {
  try {
    const companyId = String(req.query.companyId || "");
    const filter = companyId ? { companyId } : {};
    const requests = await ParcelModel.find(filter).lean();
    return res.status(200).json(requests);
  } catch (e) {
    return res.status(500).json({ message: "Error while fetching requests" });
  }
});



export default router