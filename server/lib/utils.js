import jwt from "jsonwebtoken";

// Function to generate token
export const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d" // optional: token expiry
    });

    return token;
};
