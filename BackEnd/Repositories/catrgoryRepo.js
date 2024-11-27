const CategoryModel = require("../Models/categoryModel")

const getAllCategories=async ()=>{
    try {
        return await CategoryModel.find({});
    } catch (error) {
        console.error("Error retrieving categors:", error);
        throw error;
    }
}
const getcategoryById = (id)=>{
    return categoryModel.findById(id)
}


const createNewCategory =async (category)=>{
   
    console.log("categoryRepo create: ", category);
        const categoryNew = new CategoryModel(category)
        await categoryNew.save()
        return categoryNew;
}

const updatecCategory = async (id, categoryData) => {

   console.log(`categoryRepo update: id:${id} data: ${categoryData}`);
    // Use { new: true } to return the updated document
    return await CategoryModel.findByIdAndUpdate(id, categoryData, { new: true });
};

const deletedCatrgory = (id)=>{
    return CategoryModel.findByIdAndDelete(id)
}

module.exports = {getAllCategories,getcategoryById,createNewCategory, updatecCategory, deletedCatrgory}