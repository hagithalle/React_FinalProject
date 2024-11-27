import axios from "axios";

const API_URL = "http://localhost:3000/categories";

const getAllCategories = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    console.log("Service getAllCategories:", API_URL, config)
    const { data :response} = await axios.get(API_URL, config);
    console.log("getAllCategories:" ,response)
    return response;
};

const createNewCategory = async (category, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    console.log("Service createNewCategory:", API_URL, category, config)

    const {data: response} = await axios.post(API_URL,category, config)
    console.log("createNewCategory:" ,response)
    return response;
};

const updateCategory = async (id, category, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    console.log("Service updateCategory:", API_URL, category, config)

    const { data } = await axios.put(`${API_URL}/${id}`, category, config);
    console.log("updateCategory:" ,response)
    return data;
};

const deleteCategory = async (id, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    console.log("Service deleteCategory:", API_URL, id, config)

    const { data } = await axios.delete(`${API_URL}/${id}`, config);
    console.log("deleteCategory:" ,response)
    return data;
};

const categoryService = {
    getAllCategories,
    createNewCategory,
    updateCategory,
    deleteCategory
};

export default categoryService;