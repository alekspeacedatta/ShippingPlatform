import { Request, Response, Router } from "express";
import { MessageModel } from "../models/Messages";

const router = Router();

router.post('/set-message', async ( req: Request, res: Response ) => {
    try {
        const message = req.body;
        if(!message) return res.status(400).json({ message: 'Message does not exsist'})

        const newMessage = new MessageModel(message);

        await newMessage.save();

        res.status(200).json(message);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error while sending message', error })
    }
})
router.get('/get-message', async ( req: Request, res: Response ) => {
    try {
        const id = String(req.query.id || '');
        if(!id) return res.status(400).json({ message: ' id doesnot found so can not get recieved messages ' });

        const foundMessages = await MessageModel.find({ userId: id });
        if(!foundMessages) return res.status(400).json({ message: 'no message yet' })

        res.status(200).json(foundMessages)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error while getting messages', error })
    }
})

export default router