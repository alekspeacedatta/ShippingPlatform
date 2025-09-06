import { Router, Request, Response } from "express";
import { UserModel } from "../models/User";
import { ParcelModel } from "../models/Parcel";
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
router.post('/create-request', async ( req: Request, res: Response ) => {
    try {
        const parcelRequestData = req.body;
    
        if(!parcelRequestData) res.status(400).json({ message: 'parcel request does not exsist' });
    
        const parcelRequest = new ParcelModel(parcelRequestData);
    
        await parcelRequest.save();
        res.status(200).json({message: 'parcel request created successfuly', parcelRequest: parcelRequest})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: ' Parcel Request creating Failed ' });
    }
})
export default router