import mongoose from "mongoose"

export const connectDB = async (params) => {
   try {
    const conn = await mongoose.connect.process.env.MONGO_URI
   } catch (error) {
    console.log(error.message);
    process.exit(1)
   } 
}