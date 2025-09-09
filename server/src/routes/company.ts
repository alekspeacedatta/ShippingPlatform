import { Router, Request, Response } from "express";
import { ComapnyModel } from "../models/Company";

const router = Router();

router.get('/get-companies', async ( req: Request, res: Response ) => {
    try {
        const companies = await ComapnyModel.find().select('-password');
        if(!companies) res.status(400).json({ message: "Companies does not exsist" });

        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: "Error while fetching companies", error })
    }
})
router.get('/get-company', async ( req: Request, res: Response ) => {
    try {
        const companyId = String(req.query.companyId || '')
        if(!companyId) return res.status(400).json({ message: "company id does not exsist" });

        const company = await ComapnyModel.findById(companyId);
        if(!company) return res.status(400).json({ message: 'company does not exsist' });

        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: "Error while fetching company", error })
    }
})
router.patch("/update-pricing", async (req, res) => {
  try {
    const { companyId, pricing } = req.body || {};
    if (!companyId || !pricing) {
      return res.status(400).json({ message: "companyId and pricing are required" });
    }

    const updated = await ComapnyModel.findByIdAndUpdate(
      companyId,
      { $set: { pricing } },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json({
      message: "Pricing updated successfully",
      company: updated,
    });
  } catch (error) {
    console.error("Update pricing error:", error);
    return res.status(500).json({ message: "Error while updating pricing" });
  }
});


export default router