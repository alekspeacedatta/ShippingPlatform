import { Router, Request, Response } from "express";
import { UserModel } from "../models/User";
import { authenticateJWT } from "../middleware";
import bcrypt from 'bcrypt';

const router = Router();
router.patch('/edit/:id', authenticateJWT, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone, addresses, password } = req.body;
        const updateData: any = {};
        
        if (fullName !== undefined) updateData.fullName = fullName;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (addresses !== undefined) updateData.addresses = addresses;

        if (password && password.trim() !== '') {
            const rounds = 10;
            updateData.password = await bcrypt.hash(password, rounds);
        }
        const selectedUser = await UserModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );
        
        if(!selectedUser) return res.status(400).json({ message: "This User does not exist" });
        
        res.status(200).json({ 
            message: 'User updated Successfully', 
            user: selectedUser
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'User updating Error', error })   
    }
})
export default router