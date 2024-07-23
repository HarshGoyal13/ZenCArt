const express = require("express");
const router = express.Router();
const {requireSignIn, isAdmin} = require("../middlewares/authMiddleware")
const { createProduct, getAllProducts, getAdminProducts, getSingleProduct, GetproductPhoto, deleteProduct, UpdateProduct, productsFilter, productCount, productList, searchPRoduct, realtedProductController, categoryProduct, braintreeTokenController, braintreePaymentController, createReview, getProductReviews} = require("../controllers/ProductCntroller");
const formidable = require("express-formidable")

router.post("/create-product", requireSignIn, isAdmin,formidable(), createProduct);


router.put("/update-product/:pid", requireSignIn, isAdmin,formidable(), UpdateProduct);

router.get("/Admin-product", requireSignIn, isAdmin, getAdminProducts);

router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProduct);


router.get("/All-product", getAllProducts);

router.get("/single-product/:slug", getSingleProduct);


router.get("/product-photo/:pid", GetproductPhoto);


router.post("/product-filters", productsFilter);



router.get("/product-count", productCount);

router.get("/product-list/:page", productList);

router.get("/search/:keyword", searchPRoduct)

router.get("/related-product/:pid/:cid", realtedProductController);

router.get('/category-product/:slug', categoryProduct)


router.get('/braintree/token', braintreeTokenController)


router.post('/braintree/payment',requireSignIn, braintreePaymentController)

router.post('/create-review/:slug', requireSignIn, createReview)

router.get('/get-review/:slug', getProductReviews)






module.exports = router;
