const userRepo = require("../Repositories/userRepo");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const saltRounds = 10;
dotenv.config(); // Load environment variables from .env

const getAllUsers = () => {
    return userRepo.getAllUsers();
};

const getUserById = (id) => {
    return userRepo.getUserById(id);
};

const checkUserLogin = async (userName, password) => {
    try {
    console.log("checkUserLogin", userName, password)
    const user = await userRepo.getUserByUserName(userName);

    if (!user) {
        return { success: false, message: "Authentication failed: userName not found" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return { success: false, message: "Authentication failed: Incorrect password" };
    }

        const token = generateToken(user)

        //const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return { success: true, user, token };
    } catch (error) {
        console.error("Error generating token:", error);
        return { success: false, message: "Error generating token" };
    }
};

const createNewUser = async (user) => {
    try {
        // Check if user already exists
        const existingUser = await userRepo.getUserByUserName(user.userName);
        if (existingUser) {
            return { success: false, message: "Username already exists" };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
        console.log("createNewUser passoword: ", user.password)
        user.joinedAt = new Date()
        console.log( "joinAt: ",user.joinedAt)

        await userRepo.createNewUser(user);
        return { success: true, message: "User created successfully" };
    } catch (err) {
        console.error("Error when creating new user:", err);
        return { success: false, message: `Create new User failed: ${err.message}` };
    }
};

const updateUser = async (id, userData) => {
    try {
        console.log("service updateUser:", id, userData)
        
        if (userData.password) {
            console.log("userPassword befor: ",userData.password)
            userData.password = await bcrypt.hash(userData.password, saltRounds);
            console.log("userPassword after: ",userData.password)
        }else{
            delete userData.password
        }

        const updatedUser = await userRepo.updateUser(id, userData);
        console.log(updatedUser)
        if (!updatedUser) {
            return { success: false, message: "User not found or update failed" };
        }

        return { success: true, message: "User updated successfully", updatedUser };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, message: `Update failed: ${error.message}` };
    }
};

function generateToken(user) {
    try {
      const token = jwt.sign(
        { id: user._id, userName: user.userName },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return token;
    } catch (error) {
        console.error("Error generating token: ", error);
      return null;
    }
  }
  const updateUserAfterPurchase = async (userId, purchasedProducts) => {
            try {
                purchasedProducts.forEach(pPto =>
                     {
                        pPto.dateBought = new Date()
                });
                console.log("purchasedProducts: ", purchasedProducts)

                const updateUser = await userRepo.updateUserAfterPurchase(userId,purchasedProducts)
                return { success: true, message: "User updated successfully", data: updateUser };
                
            } catch (error) {
                console.error("Error updating user after purchase:", error);
                throw error;
            }}

module.exports = { updateUser, getUserById, createNewUser, getAllUsers, checkUserLogin , updateUserAfterPurchase};