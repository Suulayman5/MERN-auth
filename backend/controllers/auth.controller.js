import bcryptjs from "bcryptjs";
import { User } from "../models/user.models.js";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";

export const signup = async (req, res) => {
    const {email, password, name} = req.body
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required"); 
            
            
        }
        const userAlreadyExists = await User.findOne({email})
        
        
        if (userAlreadyExists) {
            return res.status(400).json({success: false, message: "user already exists"})
        }
            const hashpassword = await bcryptjs.hash(password, 10)
            const VerificationToken = Math.floor(100000 + Math.random() * 900000).toString()
            const user = new User({
                email,
                password: hashpassword,
                name,
                VerificationToken,
                VerificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
            })
            await user.save()

            //jwt
            generateTokenAndSetCookies(res, user._id)

            res.status(201).json({
                success: true,
                message: 'user created successfully',
                user: {
                    ...user._doc,
                    password: undefined
                }

            })
        
    } catch (error) {
        res.status(400).json({success: false, message: error.message})

    }
}
export const login = async (req, res) => {
    res.send('login route')
}
export const logout = async (req, res) => {
    res.send('logout route')
}