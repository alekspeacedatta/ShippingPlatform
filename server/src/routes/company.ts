import { Router, Request, Response } from 'express'
import { CompanyModel } from '../models/Company'
const router = Router();

router.get("/get", async (_req: Request, res: Response) => {
  try {
    const allCompanies = await CompanyModel.find().lean();
    
    return res.status(200).json({
      message: "All companies fetched successfully",
      companies: allCompanies ?? [],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching all companies", error });
  }
});
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const company = await CompanyModel.findById(req.params.id).lean();
    
    if (!company) return res.status(404).json({ message: "Company not found" });
    return res.status(200).json({ company });
  } catch (e) {
    return res.status(500).json({ message: "Error fetching company" });
  }
});
export default router