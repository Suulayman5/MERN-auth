import bcryptjs from "bcryptjs";
import crypto from 'crypto'
import { User } from "../models/user.models.js";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";

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
export const forgotPassword = async (req, res) => {
    const {email} = req.body
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'user not found'
            })
        }
        const resetToken = crypto.randomBytes(20).toString('hex')
        const resetTokenExpireAt = Date.now + 1 * 60 * 60 * 1000

        const resetPasswordToken = resetToken
        const resetPasswordExpireAt = resetTokenExpireAt

        await user.save()
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({success: true, message: 'password reset link sent to your email'})

    } catch (error) {
        console.log('error in forgotpassword', error);
        res.status(400).json({success: false, message: error.message})
    }
}
export const resetPassword = async (req, res) => {
    try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
