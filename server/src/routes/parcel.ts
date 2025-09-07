import { ComapnyModel } from "../models/Company";
import { ParcelModel } from "../models/Parcel";
import { UserModel } from "../models/User";
import router from "./auth";


router.get("/get-requests", async (req, res) => {
  try {
    const id = String(req.query.id || "");
    if (!id) return res.status(400).json({ message: "id is required" });

    const requests = await ParcelModel.find({
      $or: [{ userId: id }, { companyId: id }],
    }).lean();

    return res.status(200).json(requests);
  } catch (e) {
    return res.status(500).json({ message: "Error while fetching requests" });
  }
});

export default router
