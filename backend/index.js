import express from 'express'

import dotenv from 'dotenv';
import { connectDB } from './connectDB.js';
import authRoutes from './routes/auth.routes.js'

dotenv.config();

const PORT = process.env.PORT

const app = express()
app.get('/',(req, res)=>{
    res.send('hello')
})

app.use('/api/auth', authRoutes)

app.listen(PORT, ()=>{
connectDB()
    console.log(`server running on port ${PORT}`);
    
})