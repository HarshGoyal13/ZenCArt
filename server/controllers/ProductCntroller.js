const productModel = require('../models/productModel');
const categoryModel = require('../models/CategoryModel');
const reviewModel = require('../models/ReviewModel');
const orderMOdel = require('../models/OrderModel');

const fs = require('fs');
const slugify = require('slugify');
const braintree = require("braintree")

require("dotenv").config


//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_ID,
  privateKey: process.env.BRAINTREE_PRIVATE_ID,
});



exports.createProduct = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user contains user details from JWT

    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: 'Name is Required' });
      case !description:
        return res.status(400).send({ error: 'Description is Required' });
      case !price:
        return res.status(400).send({ error: 'Price is Required' });
      case !category:
        return res.status(400).send({ error: 'Category is Required' });
      case !quantity:
        return res.status(400).send({ error: 'Quantity is Required' });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: 'Photo is Required and should be less than 1MB' });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name), userId:userId });

    // If photo exists, handle it
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    // Save product to database
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: 'Error in creating product',
    });
  }
};


exports.getAllProducts = async(req,res)=>{
    try{
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            counTotal: products.length,
            message: "ALlProducts ",
            products,
            total : products.length,
          });
    }catch(error){
        console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
    }
}



exports.getAdminProducts = async(req,res)=>{
    try{
        const userId = req.user._id;
        console.log(userId)
        const products = await productModel.find({userId}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            counTotal: products.length,
            message: "ALlProducts ",
            products,
            total : products.length,
          });
    }catch(error){
        console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
    }
}


exports.getSingleProduct = async (req, res) => {
    try {
      const product = await productModel
        .findOne({ slug: req.params.slug })
        .select("-photo")
        .populate("category");
      res.status(200).send({
        success: true,
        message: "Single Product Fetched",
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror while getitng single product",
        error,
      });
    }
};


exports.GetproductPhoto = async(req,res)=>{
    try{

        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
          res.set("Content-type", product.photo.contentType);
          return res.status(200).send(product.photo.data);
        }

    }catch(error){
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Erorr while getting photo",
          error,
        });
    }
}


exports.deleteProduct = async (req, res) => {
    try {
      await productModel.findByIdAndDelete(req.params.pid).select("-photo");
      res.status(200).send({
        success: true,
        message: "Product Deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while deleting product",
        error,
      });
    }
};



  exports.UpdateProduct = async (req, res) => {
    try {
      const { name, description, price, category, quantity } =
        req.fields;
      const { photo } = req.files;
      //alidation
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
        case photo && photo.size > 1000000:
          return res
            .status(500)
            .send({ error: "photo is Required and should be less then 1mb" });
      }
  
      const products = await productModel.findByIdAndUpdate(
        req.params.pid,
        { ...req.fields, slug: slugify(name) },
        { new: true }
      );
      if (photo) {
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
      await products.save();
      res.status(201).send({
        success: true,
        message: "Product Updated Successfully",
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in Updte product",
      });
    }
};
  


exports.productsFilter = async(req,res)=>{
  try{
    const {checked, radio} = req.body

    let args = {}

    if(checked.length > 0) args.category = checked
    if(radio.length) args.price = {$gte: radio[0], $lte:radio[1]}
    const products = await productModel.find(args)
    res.status(200).send({
      success:true,
      products
    })

  }catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      message:"Error While Filtering Product",
      error
    })
  }
}



exports.productCount = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};


exports.productList = async (req, res) => {
  try {
    const perPage = 9;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};


exports.searchPRoduct = async(req,res)=>{
  try{

    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);

  }catch(error){
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
}

exports.realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};



exports.categoryProduct = async (req, res) => {
  try {
    // Find the category by slug
    const category = await categoryModel.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    // Find products that belong to this category
    const products = await productModel.find({ category: category._id });

    res.status(200).send({
      success: true,
      category,
      products, // Use plural for consistency
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};


exports.braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        console.error('Error generating client token:', err);
        return res.status(500).send({ error: 'Error generating client token' });
      } else {
        res.json(response);
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send({ error: 'Unexpected error' });
  }
};



exports.braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    console.log(cart)

    // Validate input
    if (!nonce || !cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).send({ error: 'Invalid request parameters' });
    }

    // Calculate total amount
    let total = cart.reduce((acc, item) => acc + item.price, 0);

    // Create a new transaction
    gateway.transaction.sale(
      {
        amount: total.toFixed(2), // Ensure amount is in decimal format
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async (error, result) => {
        if (error) {
          console.error('Transaction error:', error);
          return res.status(500).send({ error: 'Transaction failed' });
        }

        // Save the order
        const order = new orderMOdel({
          products: cart,
          payment: result,
          buyer: req.user._id,
          AdminId: cart[0]?.userId 
        });

        try {
          await order.save();
          res.json({ success: true, result });
        } catch (saveError) {
          console.error('Error saving order:', saveError);
          res.status(500).send({ error: 'Failed to save order' });
        }
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send({ error: 'Unexpected error' });
  }
};



exports.createReview = async (req, res) => {
  try {
    const { slug } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Check if product exists
    const product = await productModel.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user has already reviewed this product
    const existingReview = await reviewModel.findOne({ 
      product: product._id, 
      user: userId 
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Create and save the new review
    const review = new reviewModel({
      user: userId,
      product: product._id,
      name: req.user.name,
      image: req.user.image || '', // Fallback to empty string if no image
      rating,
      comment
    });

    await review.save();

    // Update the product with the new review
    product.reviews.push(review._id);
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getProductReviews = async(req,res)=>{
  try {
    const { slug } = req.params;

    // Find the product by slug and populate its reviews
    const product = await productModel.findOne({ slug }).populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'name' // Select the name field from the user
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}






