const express = require("express");
const router = express.Router();
const {requireSignIn, isAdmin} = require("../middlewares/authMiddleware")
const { Register, signIn, updateProfileController, getOrders, getAdminOrders, changeOrderStatus, confirmToken } = require("../controllers/authController");

router.post("/register", Register);


router.get("/confirm/:token", confirmToken);

router.post("/login", signIn);


router.get('/user-auth', requireSignIn, (req,res)=>{
    res.status(200).send({ok:true});
})

router.get('/admin-auth', requireSignIn, isAdmin, (req,res)=>{
    res.status(200).send({ok:true});
})

router.put("/profile", requireSignIn, updateProfileController);


router.get('/orders', requireSignIn, getOrders)


router.get('/all-orders', requireSignIn,isAdmin, getAdminOrders)


router.put('/orders-update/:orderId', requireSignIn,isAdmin, changeOrderStatus)




module.exports = router;
