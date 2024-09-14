import mongoose from "mongoose"

export const connectDB = async (params) => {
   try {
    console.log('mongodb:', process.env.MONGO_URI);
    
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`mongodb connected: ${conn.connection.host}`);
    
   } catch (error) {
    console.log('error connection to mongodb',error.message);
    process.exit(1)
   } 
}