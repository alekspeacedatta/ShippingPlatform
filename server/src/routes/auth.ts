import { Router, Request, Response } from 'express';
import { UserDocument, UserModel } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { authenticateJWT } from '../middleware';
import { ComapnyModel } from '../models/Company';
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
router.post('/company/register', async ( req: Request, res: Response ) => {
    try {
        const companyInfo  = req.body;

        const exsistingCompany = await ComapnyModel.findOne({ contactEmail: companyInfo.contactEmail, password: companyInfo.password});
        const exsistingCompanyName = await ComapnyModel.findOne({ name: companyInfo.name });
        const hashedPassword = await bcrypt.hash(companyInfo.password, 10);

        if(exsistingCompany) return res.status(400).json({ message: 'This Company is already exsist' });
        if(exsistingCompanyName) return res.status(400).json({ message: 'This Company Name is already taken' });
        
        const admin = new UserModel({ email: companyInfo.contactEmail, password: hashedPassword, fullName: 'aleksandre', addresses: [{country: 'ds', city:  'ds', line1: 'ds', postalCode: 'ds'},], phone: '', role: 'COMPANY_ADMIN' });
        const newCompany = new ComapnyModel({...companyInfo, password: hashedPassword});
        await admin.save();
        await newCompany.save();

        const token = jwt.sign(
            { id: newCompany._id, email: newCompany.contactEmail, role: newCompany.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );
        res.status(201).json({ message: 'Company is registered Successuflly', company: newCompany});
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error Registering Company', error }) 
    }
})
router.post('/client/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const checkUser = await UserModel.findOne({ email });
        if(!checkUser){
                return res.status(400).json({ message: 'Incorect email or password' })
            }
        const isMatch = await bcrypt.compare(password, checkUser.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Incorect email or password' })
        }
        const token = jwt.sign(
        { id: checkUser._id, email: checkUser.email, role: checkUser.role },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' });
        const exsitedCompany = await ComapnyModel.findOne({ contactEmail: email });
        if(exsitedCompany){
            res.status(200).json({ message: 'Login succesful', user: checkUser, token: token, company: exsitedCompany })
        }
        res.status(200).json({ message: 'Login succesful', user: checkUser, token: token})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login Failed', error });
    }
})
router.get('/client/get', authenticateJWT, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user!.id
        const client = await UserModel.findById(userId).select('-password');
        if(!client) res.status(400).json({ message: 'error while getting user' })

        res.status(200).json(client)
    } catch (error) {
        res.status(500).json({ message: 'errorr while getting user', error })
    }
})
export default router