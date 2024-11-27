const ProductModel = require("../Models/productModel")

const getAllProducts =async ()=>{
    try {
        return await ProductModel.find({});
    } catch (error) {
        console.error("Error retrieving products:", error);
        throw error;
    }
}
const getProductsById = (id)=>{
    return ProductModel.findById(id)
}


const createNewProduct= async (product)=>{
    const productNew = new ProductModel(product)
    await productNew.save()
    return productNew;
}

const updateProduct = async(id, productData)=>{
  
    console.log(`productRepo update: id:${id} data: ${productData}`);
    // Use { new: true } to return the updated document
    return await ProductModel.findByIdAndUpdate(id, productData, { new: true });

}

const deletedProduct= (id)=>{
    return ProductModel.findByIdAndDelete(id)
}

const getProductsByCategory = async (categoryId) => {
    try {
        // Find all products that have the specified category ID
        return await ProductModel.find({ category: categoryId });
    } catch (error) {
        console.error("Error retrieving products by category:", error);
        throw error;
    }
};

// Update stock and boughtByOthers when a product is purchased
/*const updateProductAfterPurchase = async (cartItems) => {
   
    console.log("Repo: updateProductAfterPurchase:", cartItems)
    for (const item of cartItems) {
              
        // Fetch the product from the database
       const product = await ProductModel.findById(item._id);
  
        if (product) {
          // Update the inStock and boughtByOthers fields
          product.inStock = product.inStock - item.quantity;
          product.boughtByOther = (product.boughtByOther || 0) + item.quantity;
  
          // Save the updated product back to the database
          await product.save();
  };
}}*/

// Update product stock after purchase
async function updateProductAfterPurchase(item) {
    try {
        console.log("updateProductAfterPurchase:", item)
            const product = await ProductModel.findById(item._id);
            if (!product) {
                return { success: false, message: 'Product not found' };
            }
            product.inStock = product.inStock - item.quantity;
            product.boughtByOther = product.boughtByOther + item.quantity;
            await product.save();

        return { success: true };
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

module.exports = {getAllProducts,createNewProduct,updateProduct, getProductsById, deletedProduct, getProductsByCategory,updateProductAfterPurchase}