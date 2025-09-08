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



export default router