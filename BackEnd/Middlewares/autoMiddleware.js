const jwt = require("jsonwebtoken")
const {UserModel} = require("../Models/userModel")
const dotenv = require("dotenv");

dotenv.config();  // Load environment variables from .env

const protect = async (req, res, next) => {
    let token;
    console.log("Authorization Header:", req.headers.authorization);
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];  // Extract the token part
        } else {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // Verify token
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token Verified:", verify);
        req.user = await UserModel.findById(verify.id); // Get the user from the token's payload

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        console.error("Error in token verification:", error);
        return res.status(401).json({ message: "Not authorized, token expired or invalid" });
    }
};
module.exports = {protect}