const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please add a full name"]
    },
    lastName: {
        type: String,
        required: [true, "Please add a last name"]
    },
    userName: {
        type: String,
        unique: true,
        required: [true, "Please add a userName"]
    },
    password: {
        type: String,
        required: [true, "Please add a password"]
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    isAdmin: { type: Boolean, default: false },
    isAllowToSeeMyOrder: { type: Boolean, default: false },
    productsBought: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number,
        dateBought: Date
    }]
}, );

// Define the User model
const UserModel = mongoose.model('User', userSchema);

async function getTotalUnitsBoughtPerProduct() {
    console.log("getTotalUnitsBoughtPerProduct:")
    try {
        const result = await UserModel.aggregate([
            { $unwind: "$productsBought" },  // Deconstruct productsBought array
            {
                $group: {
                    _id: "$productsBought.productId",  // Group by productId
                    totalQuantity: { $sum: "$productsBought.quantity" }  // Sum the quantities
                }
            },
            {
                $project: {
                    productId: "$_id",  // Map _id to productId
                    totalQuantity: 1
                }
            }
        ]);
        console.log("getTotalUnitsBoughtPerProduct: ",result);
        return result;
    } catch (error) {
        console.error("Error in aggregation:", error);
        throw error;
    }
}

// Export the model and function properly
module.exports = {UserModel,getTotalUnitsBoughtPerProduct}
    