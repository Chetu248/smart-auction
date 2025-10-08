import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Signup Controller
export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: e.message });
  }
};

// Login Controller
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

    res.json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: e.message });
  }
};

// Check Auth Controller
export const checkAuth = (req, res) => {
  // ✅ FIX: return fresh user data (req.user should already be populated by auth middleware)
  res.json({ success: true, userData: req.user });
};

// Update Profile Controller
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fields from form-data
    const { fullName, email, password, profilePicUrl } = req.body;
    const file = req.file; // multer will attach this if a file is uploaded

    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // ✅ If file uploaded, upload to Cloudinary (using buffer or path depending on setup)
    if (file) {
      // If using multer.diskStorage -> file.path available; if memoryStorage -> file.buffer
      if (file.path) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "user_profiles",
        });
        updateData.profilePic = uploaded.secure_url;
      } else if (file.buffer) {
        const uploaded = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "user_profiles" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        if (uploaded?.secure_url) updateData.profilePic = uploaded.secure_url;
      }
    }
    // ✅ If user entered image URL instead
    else if (profilePicUrl) {
      updateData.profilePic = profilePicUrl;
    }

    if (Object.keys(updateData).length === 0) {
      return res.json({ success: false, message: "No update data provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ FIX: return updated user data so frontend can refresh local state
    res.json({
      success: true,
      message: "Profile updated successfully",
      userData: updatedUser,
    });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: e.message });
  }
};

// Logout Controller
export const logout = (req, res) => {
  try {
    res.clearCookie("token", { path: "/" });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: e.message });
  }
};
