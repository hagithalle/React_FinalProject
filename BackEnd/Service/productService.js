const productRepo = require("../Repositories/productsRepo")

const getAllProducts = async () => {
    return await productRepo.getAllProducts();
};

const getProductsById = async(id)=>{
    const product = productRepo.getProductsById(id)
    return {product}
}

const createNewProduct= async (product)=>{
   try {
    console.log(`createNewProduct product: ${product}`)
    const result = await productRepo.createNewProduct(product)
    if(result!= null){
        console.log(`message: "created product successfully", success: true, data: ${result}` )
        return {message: "created product successfully", success: true, data: result }
    }
        
    
   } catch (error) {
    return { message: `Create product failed: ${err}`, success: false };
   }
}

const updateProduct = async(id, productData)=>{
    console.log(`updateProduct id: ${id} product: ${productData}`)

    try {
        const updateProduct = await productRepo.updateProduct(id, productData);
        console.log("result:", updateProduct)
        if (!updateProduct) {
            return { message: `Product with id ${id} not found`, success: false };
        }
        return { message: "Product updated successfully", success: true, data: updateProduct };
    } catch (error) {
        console.error("Error updating Product:", error);
        return { message: `Update failed: ${error.message}`, success: false };
    }
};

const deletedProduct= async(id)=>{
    try {
        await productRepo.deletedProduct(id)
        return {message: "Deleted product successfully", success: true }
        
       } catch (error) {
        return { message: `Deleted product failed: ${err}`, success: false };
       }
    }

// Service method to get products by category
const getProductsByCategory = async (categoryId) => {
    try {
        const products = await productRepo.getProductsByCategory(categoryId);
        return { products };
    } catch (error) {
        return { message: `Failed to retrieve products by category: ${error}`, success: false };
    }
};

const updateProductAfterPurchase = async (cartItem) => {
    
    console.log("updateProductAfterPurchase:",cartItem )
    try {
            
        await productRepo.updateProductAfterPurchase(cartItem)   
        return { success: true, message: 'Products updated successfully'};   
      }
      catch (error) {
      return { success: false, message: 'Error updating products', error };
    }
  };



module.exports = {getAllProducts,createNewProduct,updateProduct, getProductsById, deletedProduct, getProductsByCategory, updateProductAfterPurchase}