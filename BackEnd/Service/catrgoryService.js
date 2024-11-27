

const categoryRepo = require("../Repositories/catrgoryRepo")

const getAllCategories =async ()=>{

    return categoryRepo.getAllCategories();
    
}
const getCategoryById = async(id)=>{
    const category = categoryRepo.getcategoryById(id)
    return {category}
}


const createNewCategory = async (category) => {
    console.log("categoryService create: ", category);

    try {
        const result = await categoryRepo.createNewCategory(category);
        return { message: "Created category successfully", success: true, data: result };
    } catch (error) {
        return { message: `Create category failed: ${error.message}`, success: false };
    }
};

const updateCategory = async (id, categoryData) => {
    console.log(`categoryService update: id:${id} data: ${categoryData}`);
    try {
        const updatedCategory = await categoryRepo.updatecCategory(id, categoryData);
        console.log("result:", updateCategory)
        if (!updatedCategory) {
            return { message: `Category with id ${id} not found`, success: false };
        }
        return { message: "Category updated successfully", success: true, data: updatedCategory };
    } catch (error) {
        console.error("Error updating category:", error);
        return { message: `Update failed: ${error.message}`, success: false };
    }
};

const deleteCategory = async (id) => {
    try {
        const result = await categoryRepo.deletedCatrgory(id);
        return { message: "Deleted category successfully", success: true, data: result };
    } catch (error) {
        return { message: `Delete category failed: ${error.message}`, success: false };
    }
};

module.exports = {getAllCategories,createNewCategory,updateCategory, getCategoryById, deleteCategory}