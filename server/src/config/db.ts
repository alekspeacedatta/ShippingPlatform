import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/ShippingDB", { dbName: "ShippingDB", });
        console.log('MOngoDB Connected');
    } catch (error) {
        console.error(`MongoDB Connection Error ${error}`);
        process.exit(1);
    }
}