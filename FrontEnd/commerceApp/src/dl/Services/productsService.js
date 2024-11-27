import axios from "axios"

const API_URL = "http://localhost:3000/products"

//Get all users
const getAllProducts = async(token)=>{
    const config = { headers: { Authorization: `Bearer ${token}` } };
    console.log("Service getAllProducts:", API_URL, config)
    const {data :response}  = await axios.get(API_URL, config)
    console.log("getAllProducts:" ,response)

    return response
}

const createNewProduct = async(product, token)=>{
    const config = { headers: { Authorization: `Bearer ${token}` } };
    console.log("Service createNewProduct get data:", API_URL, product, config)

    const {data :response}  = await axios.post(API_URL,product ,config)

    console.log("createNewProduct rsponse:" ,response)
    return response
}

const updateProduct = async(product, token)=>{

    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    console.log("Service updateProduct get data:", API_URL, product, config)

    const {data :response}  = await axios.put(`${API_URL}/${product._id}`,product ,config)

    console.log("updateProduct rsponse:" ,response)
    return response
}

const updateProductAfterPurchase= async(cart, token)=>{
    const config = { headers: { Authorization: `Bearer ${token}` } };
    console.log("updateProductAfterPurchase get data:", `${API_URL}/updateStock`, cart, config)

    for (let item of cart) {
        // Ensure each item has a valid _id field
        const { _id, quantity } = item;
        if (!_id || !quantity) {
            throw new Error("Invalid product data");
        }
        console.log(`${API_URL}/${_id}/updateStock`, { quantity }, config);
        const { data: response } = await axios.put(`${API_URL}/${_id}/updateStock`, item , config);
        console.log("updateProductAfterPurchase response:", response);
    }
    return { success: true, message: "Products updated successfully" };
};



const productService = {getAllProducts, createNewProduct, updateProduct, updateProductAfterPurchase}

export default productService