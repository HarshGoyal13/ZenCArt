const JWT = require("jsonwebtoken")
const userModel = require("../models/userModel")
require("dotenv").config()



// Protected Route -> token based
exports.requireSignIn = async(req,res, next)=>{
    try{
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET)
        req.user = decode
        next()
    }catch(error){
        console.log(error)
    }
}



// admin access

exports.isAdmin = async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user._id);
      if (!user || user.role !== "Admin") {
        return res.status(401).send({
          success: false,
          message: "Unauthorized Access",
        });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error checking user role",
        error: error.message,
      });
    }
  };