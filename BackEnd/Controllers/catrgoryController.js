const categoryService = require('../Service/catrgoryService');
const {protect} = require("../Middlewares/autoMiddleware")
const express = require('express');

const router = express.Router();

router.get("/", protect, async(req,res)=>{
  
    console.log("get:")
    const getAllCategory= await categoryService.getAllCategories()
    return res.status(200).json({message: "Categorys retrieved successfully", data: getAllCategory})
})



// Endpoint to create a new category
router.post('/', protect, async (req, res) => {
    console.log("categories post", req);
    try {
        const newCategory = req.body;
        console.log("categoryController create: ", newCategory);
        const result = await categoryService.createNewCategory(newCategory);
        

        if (result.success) {
            return res.status(201).json({ success: true,message: 'New category created successfully', data: result.data });
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        return res.status(500).json({ success: fale, message: 'Internal Server Error' });
    }
});

router.put("/:id", protect, async (req, res) => {
    console.log("UpdateCategory Controller:", req.params.id)

    const id = req.params.id;
    const categoryData = req.body;
    try {
        const status = await categoryService.updateCategory(id, categoryData);
        if (!status.success) {
            return res.status(404).json({ status });
        }
        return res.status(200).json({ status });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.delete("/:id", protect, async (req, res) => {
    const id = req.params.id;
    try {
        const status = await categoryService.deleteCategory(id);
        if (!status.success) {
            return res.status(404).json({ status });
        }
        return res.status(200).json({ status });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router