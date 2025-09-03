import { Router, Request, Response } from "express";
import { ComapnyModel } from "../models/Company";

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

export default router