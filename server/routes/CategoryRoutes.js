const express = require("express");
const router = express.Router();
const {requireSignIn, isAdmin} = require("../middlewares/authMiddleware")
const { createCategory, updateCAtegory, getAllCategory, getSingleCategory, deleteCategory} = require("../controllers/CategoryController");

router.post("/create-category", requireSignIn, isAdmin, createCategory);

router.put("/edit-category/:id", requireSignIn, isAdmin, updateCAtegory);

router.get("/All-category",  getAllCategory);


router.get("/single-category/:slug",  getSingleCategory);

router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategory);





module.exports = router;
