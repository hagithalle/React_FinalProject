const productService = require('../Service/productService');
const {protect} = require("../Middlewares/autoMiddleware")
const express = require('express');

const router = express.Router();

router.get("/", protect, async (req, res) => {
    try {
        const getAllProducts = await productService.getAllProducts();
        return res.status(200).json({ message: "Products retrieved successfully", data: getAllProducts });
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve products", error });
    }
});



// Route to get products by category
router.get('/category/:categoryId',protect, async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
        const result = await productService.getProductsByCategory(categoryId);
        if (result.success === false) {
            return res.status(500).json(result);
        }
        res.status(200).json(result.products);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve products", error });
    }
});



// Endpoint to create a new product
router.post('/',protect ,async (req, res) => {
    try {
       
        const newProduct= req.body;
        console.log("create a new product: ",newProduct )
        const result = await productService.createNewProduct(newProduct);


        if (result.success) {
            res.status(201).json({ success: true, message: 'New product created successfully' ,data: result.data });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put("/:id", protect, async (req, res) => {
    const id = req.params.id;
    const productData = req.body;

    try {
        const status = await productService.updateProduct(id, productData);
        if (!status.success) {
            return res.status(404).json({ status });
        }
        return res.status(200).json({ status });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});

router.delete("/:id",protect, async(req, res)=>{
    const id = req.params
    const status = await productService.deletedProduct(id)

    if(!status.success)
        {
            res.status(404).json({status})
           
        }
    
        res.status(200).json({status})
})


router.put('/:id/updateStock', protect, async (req, res) => {
    const item = req.body;

    try {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxx updateStock:", item);
        
        // Ensure you have a dedicated function in your product service for stock updates
        const result = await productService.updateProductAfterPurchase(item);
        if (result.success) {
            res.status(200).json({ success: true, message: 'Products updated successfully' });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

module.exports = router