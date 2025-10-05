import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// signup 
export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        const token = generateToken(newUser._id);

        res.json({ success: true, userData: newUser, token, message: "Account created successfully" });
    } catch (e) {
        console.log(e);
        res.json({ success: false, message: e.message });
    }
};

// login 
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        const token = generateToken(userData._id);

        res.json({ success: true, userData, token, message: "Login successfully" });
    } catch (e) {
        console.log(e);
        res.json({ success: false, message: e.message });
    }
};

// check user is authenticated
export const checkAuth = (req, res) => {
    res.json({ success: true, userData: req.user });
};

// update profile 
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, fullName } = req.body;
        const userId = req.user._id;
        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { fullName },
                { new: true }
            );
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: upload.secure_url, fullName },
                { new: true }
            );
        }
        res.json({ success: true, user: updatedUser });
    } catch (e) {
        console.log(e.message);
        res.json({ success: false, message: e.message });
    }
};

// logout
export const logout = (req, res) => {
    try {
        res.clearCookie("token", { path: "/" });
        res.json({ success: true, message: "Logged out successfully" });
    } catch (e) {
        console.log(e);
        res.json({ success: false, message: e.message });
    }
};
