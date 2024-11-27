const express = require("express")
const userService = require("../Service/userService")
const {protect} = require("../Middlewares/autoMiddleware")

const router = express.Router();

router.get("/", protect, async(req,res)=>{
  
    const getAllUsers = await userService.getAllUsers()
    return res.status(200).json({message: "Users retrieved successfully", data: getAllUsers})
})
router.get("/:id", protect, async(req,res)=>{
    const id = req.params.id

    console.log("get  request body:", id);
    const user = await userService.getUserById(id)
    if(user)
    {
        return res.status(200).json({message: "User retrieved successfully", data: user})
    }
    return res.status(400).json({message: "User exist find"})
    
})

router.post("/login", async (req, res) => {
    console.log("POST login request body:", req.body);
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const status = await userService.checkUserLogin(userName, password);
    console.log("Login status:", status);

    if (status.success) {
        res.status(200).json({ message: "User authenticated successfully", data: status });
    } else {
        res.status(401).json({ message: status.message });
    }
});


// Endpoint to create a new user
router.post('/register', async (req, res) => {
    try {
        const newUser = req.body;
        console.log("register: ", newUser);
        const result = await userService.createNewUser(newUser);

        if (result.success) {
            // Make sure to return a proper message and structure
            res.status(201).json({ message: 'User created successfully', data: result });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put("/:id",protect, async(req, res)=>{
    const id = req.params.id
    const userData = req.body

    console.log("controoler update:", id, userData)
    const status = await userService.updateUser(id, userData)
    console.log(status)
    if(!status.success)
        {
            res.status(404).json({success: status.success, message: status.message})
           
        }
    
        res.status(200).json({success: status.success, message: status.message, data: status.data })
})

router.put('/:id/purchase', protect,async(req, res)=>{
    const id = req.params.id
    updateUserAfterPurchase = req.body

    console.log("purchase update:", id, updateUserAfterPurchase)

    const status = await userService.updateUserAfterPurchase(id, updateUserAfterPurchase)
    console.log(status)
    
    
    if(!status.success)
        {
            res.status(404).json({success: status.success, message: status.message})
           
        }
    
        res.status(200).json({success: status.success, message: status.message, data: status.data })
})


module.exports = router