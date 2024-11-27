import axios from "axios"

const API_URL = "http://localhost:3000/users"


//Get all users
const getAllUsers = async(token)=>{
    const config = { headers: { Authorization: `Bearer ${token}` } };

    console.log("Service getAllUsers get data:", API_URL, token)

    const {data :response}  = await axios.get(API_URL, config)
    console.log("getAllUsers rsponse:" ,response)

    return response
}

//Get all users
const getUserById = async(id,token)=>{
    const config = { headers: { Authorization: `Bearer ${token}` } };

    console.log("Service getUSerById get data:", `${API_URL}/${id}`, config)

    const {data :response}  = await axios.get(`${API_URL}/${id}`, config)
    console.log("getUSerById rsponse:" ,response)

    return response
}

const createNewUser = async(user)=>{
    console.log("Service createNewUser get data:", API_URL, user)

    const {data :response}  = await axios.post(API_URL,user)

    console.log("createNewUser rsponse:" ,response)
    return response
}

const updateUser = async(user, token)=>{

    const config = { headers: { Authorization: `Bearer ${token}` } };
    console.log("Service updateUSer get data:", API_URL, user, config,"ff:", `${API_URL}/${user._id}`)

    const {data :response}  = await axios.put(`${API_URL}/${user._id}`,user ,config)

    console.log("updateUSer rsponse:" ,response)
    return response
}

const updateUserAfterPurchase = async (userId, purchasedProducts, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    console.log("updateUserAfterPurchase:", `${API_URL}/${userId}/purchase`, purchasedProducts, config)
    const { data: response } = await axios.put(`${API_URL}/${userId}/purchase`, purchasedProducts, config);
    console.log("updateUSer rsponse:" ,response)
    return response;
};

const userService = {getAllUsers, getUserById,updateUser, createNewUser, updateUserAfterPurchase}

export default userService