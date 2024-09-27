import bcryptjs from "bcryptjs";
import { User } from "../models/user.models.js";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

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
           await sendVerificationEmail(user.email, VerificationToken)

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
export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        // Find the user based on the verification token
        const user = await User.findOne({
            VerificationToken: code, 
            VerificationTokenExpiresAt: { $gt: Date.now() } 
        });
        console.log('User found:', user); 

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
        }

        // Update user verification status
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined; // corrected case

        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user.email, user.name);
        

        // Respond with success and return user data without the password
        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.log('Error in verifying email', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
}; 

export const login = async (req, res) => {
    const {email, password} = req.body
    try{
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Credentials'
            })
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }
        generateTokenAndSetCookies(res, user._id)
        user.lastLogin = new Date()
        
        res.status(200).json({
            success: true,
            message: 'Logged in Successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error){
        console.log('error logging in', error);
        res.status(400).json({
            success: false,
            message: error.message
        })
        
    }
}
export const logout = async (req, res) => {
    res.clearCookie('token') 
    res.status(200).json({
        success: true, message: 'logged out successfully'
    })
}