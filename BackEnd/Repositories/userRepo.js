const {UserModel,getTotalUnitsBoughtPerProduct} = require("../Models/userModel")

const getAllUsers =async ()=>{
    try {
        const totalUnits = await getTotalUnitsBoughtPerProduct();  
        return await UserModel.find({});       
    } catch (error) {
        console.error("Error retrieving users:", error);
        throw error;
    }
}
const getUserById =async (id)=>{
    try {
        const totalUnits = await getTotalUnitsBoughtPerProduct();  
        return await UserModel.findById(id);       
    } catch (error) {
        console.error("Error retrieving user:", error);
        throw error;
    }
}

const getUserByUserName = async (userName) => {
    console.log("Querying user with userName:", userName); // Debug log
    try {
        const user = await UserModel.findOne({ userName: userName });
        console.log("User found:", user); // Debug log
        return user;
    } catch (error) {
        console.error("Error retrieving user by username:", error);
        throw error;
    }
}

const createNewUser = async (userData) => {
    try {
        const user = new UserModel(userData);
        await user.save();
        return { message: "User created successfully", success: true, data: user };
    } catch (error) {
        return { message: `Create user failed: ${error.message}`, success: false };
    }
};

const updateUser = (id, userData) => {

    return UserModel.findByIdAndUpdate(id, userData, { new: true });  
};

const updateUserAfterPurchase = async (userId, purchasedProducts) => {
   
    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $push: { productsBought: { $each: purchasedProducts } } }, // Add the new products to the productsBought list
        { new: true } // Return the updated user document
    );
    return updatedUser;
   
    
};

module.exports = {getUserById, getTotalUnitsBoughtPerProduct,getAllUsers, getUserByUserName, createNewUser, updateUser, updateUserAfterPurchase}