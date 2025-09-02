import { Router, Request, Response } from 'express';
import { UserDocument, UserModel } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { authenticateJWT, AuthRequest } from '../middleware';
import { CompanyModel } from '../models/Company';
const router = Router();

router.post('/client/register', async (req: Request, res: Response) => {
    try {
        const { email, password, fullName, phone, addresses, role } = req.body;

        const exsistingUser = await UserModel.findOne({ email });
        if(exsistingUser) return res.status(400).json({ message: "This Email is already taken" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new UserModel({ fullName, email, password: hashedPassword, phone, addresses, role});
        await newUser.save();

        res.status(201).json({ message: 'User Created Successfully', newUser});
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error Registering User', error })   
    }
})
router.post("/company/register", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const adminUserId = req.user?.id; // <-- from JWT middleware
    if (!adminUserId) return res.status(401).json({ message: "Unauthorized" });

    const companyInfo = req.body;

    // Uniqueness checks (DON'T include password in the query)
    const [existingByEmail, existingByName] = await Promise.all([
      CompanyModel.findOne({ contactEmail: companyInfo.contactEmail }),
      CompanyModel.findOne({ name: companyInfo.name }),
    ]);

    if (existingByEmail) return res.status(400).json({ message: "Company with this contactEmail already exists" });
    if (existingByName)  return res.status(400).json({ message: "Company name is already taken" });

    const hashedPassword = await bcrypt.hash(companyInfo.password, 10);

    // Create company (Mongoose assigns _id before save, safe to use below)
    const company = new CompanyModel({ ...companyInfo, password: hashedPassword });
    await company.save();
        await UserModel.findByIdAndUpdate(adminUserId, {
        role: "COMPANY_ADMIN",
        companyId: company._id,
        });
    // Promote current user to admin and link company
    await UserModel.findByIdAndUpdate(
      adminUserId,
      { role: "COMPANY_ADMIN", companyId: company._id },
      { new: true }
    );

    // Return fresh user (without password) if you need to update client state
    const user = await UserModel.findById(adminUserId).select("-password").lean();

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      user, // now has role: COMPANY_ADMIN and companyId
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error registering company" });
  }
});

router.post("/client/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Incorrect email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // if the user is an admin and has a company linked, include it
    const company = await CompanyModel.findOne({ contactEmail: email });
    if (company) {
      return res.status(200).json({
        message: "Login successful",
        user,
        token,
        company,
      }); // <-- early return stops a second send
    }

    return res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Login failed" });
  }
});
// server/routes/auth.ts
router.get("/client/me", authenticateJWT, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await UserModel.findById(userId).select("-password").lean();
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json({ user }); // includes companyId if set
});

export default router