
import User from "../models/User.js";
import bcrypt from "bcrypt";
import validator from "validator";
import generateAccessToken from "../utils/accessToken.js";
import generateRefreshToken from "../utils/refreshToken.js";
import cloudinary from "../utils/cloudinary.js";

class authController {
    async signup(req, res) {
        try {
            const { fullName, email, password } = req.body;

            if (!fullName || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }

            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                fullName,
                email,
                password: hashedPassword,
            });

            await newUser.save();

            const accessToken = generateAccessToken(newUser);
            const refreshToken = generateRefreshToken(newUser);

            res.status(201).json({
                message: "User created successfully",
                user: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
                },
                accessToken,
                refreshToken
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Internal Server Error", error: e.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
                accessToken,
                refreshToken
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Internal Server Error", error: e.message });
        }
    }

    async logout(req, res) {
        try {
            res.cookie("jwt", "", { maxAge: 0 });
            res.status(200).json({ message: "Logged out successfully" });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Internal Server Error", error: e.message });
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
