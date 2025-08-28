import { Router, Request, Response } from 'express';
import { UserDocument, UserModel } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { authenticateJWT } from '../middleware';
const router = Router();

router.post('/client/register', async (req: Request, res: Response) => {
    try {
        const { email, password, fullName, phone, addresses, role } = req.body;

        const exsistingUser = await UserModel.findOne({ email });
        if(exsistingUser) return res.status(400).json({ message: "This Email is already taken" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ fullName, email, password: hashedPassword, phone, addresses, role});
        await newUser.save();

        const token = jwt.sign(
            {id: newUser._id, email: newUser.email, role: newUser.role},
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        )
        res.status(201).json({ message: 'User Created Successfully', user: newUser, token });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error Registering User', error })   
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
        { expiresIn: '7d' })
        res.status(200).json({
            message: 'Login succesful',
            token,
            checkUser,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login Failed', error });
    }
    
})
export default router