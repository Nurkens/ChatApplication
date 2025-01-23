import tokenController from "./tokenController.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import validator from "validator";
import generateAccessToken from "../utils/accessToken.js";
import generateRefreshToken from "../utils/refreshToken.js";
import cloudinary from "../utils/cloudinary.js";
import ApiError from "../exceptions/api-error.js";
class authController {
    async signup(req, res) {
        try {
            const { fullName, email, password } = req.body;
            
            if (!fullName || !email || !password || password.length < 6 || !validator.isEmail(email)) {
                throw ApiError.BadRequest("Invalid input");
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw ApiError.BadRequest("Email already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ fullName, email, password: hashedPassword });

            const tokens = tokenController.generateTokens({ userId: newUser._id });
            await tokenController.saveToken(newUser._id, tokens.refreshToken);

            res.cookie("refreshToken", tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.status(201).json({
                user: { _id: newUser._id, fullName: newUser.fullName, email: newUser.email },
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            });

        } catch (e) {
            console.error(e);

            if (e instanceof ApiError) {
                return res.status(e.status).json({ message: e.message, errors: e.errors });
            }

            return res.status(500).json({ message: "Internal Server Error" });
        }
    }


    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const tokens = tokenController.generateTokens({ userId: user._id });
            await tokenController.saveToken(user._id, tokens.refreshToken);

            res.cookie("refreshToken", tokens.refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            return res.status(200).json({
                user: { _id: user._id, fullName: user.fullName, email: user.email },
                accessToken: tokens.accessToken,
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;
            await tokenController.removeToken(refreshToken);
            res.clearCookie("refreshToken");
            return res.status(200).json({ message: "Logged out successfully" });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    
    async refreshToken(req, res) {
    try {
        const { refreshToken } = req.cookies; 
        if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized - No Refresh Token" });
        }

        const userData = tokenController.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenController.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        const newTokens = tokenController.generateTokens({ userId: userData.userId });
        await tokenController.saveToken(userData.userId, newTokens.refreshToken);

        res.cookie("refreshToken", newTokens.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true, 
        });

        return res.status(200).json({ accessToken: newTokens.accessToken });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    }


    async updateProfile(req, res) {
        try {
            const { profilePic } = req.body;
            const userId = req.user._id;

            if (!profilePic) {
                return res.status(400).json({ message: "Profile pic is required" });
            }

            let uploadResponse;
            try {
                uploadResponse = await cloudinary.uploader.upload(profilePic);
            } catch (error) {
                return res.status(500).json({ message: "Failed to upload profile picture", error: error.message });
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: uploadResponse.secure_url },
                { new: true }
            );

            return res.status(200).json(updatedUser);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Internal Server Error", error: e.message });
        }
    }

    async checkAuth(req, res) {
        try {
            return res.status(200).json(req.user);
        } catch (e) {
            console.error("Error in checkAuth controller", e.message);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
   

}

export default new authController();
