const userModel = require("../models/userModel");
const orderMOdel = require("../models/OrderModel");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const JWT = require("jsonwebtoken");
const crypto = require('crypto');
const sendEmail = require("../utils/Nodemailer")




exports.Register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    // Validations
    if (!name) return res.status(400).send({ error: "Name is Required" });
    if (!email) return res.status(400).send({ message: "Email is Required" });
    if (!password) return res.status(400).send({ message: "Password is Required" });
    if (!phone) return res.status(400).send({ message: "Phone no is Required" });
    if (!address) return res.status(400).send({ message: "Address is Required" });

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      // If the user exists but is not verified
      if (!existingUser.isVerified) {
        // Generate a new confirmation token
        const confirmationToken = crypto.randomBytes(32).toString('hex');
        existingUser.confirmationToken = confirmationToken;
        await existingUser.save();

        // Retrieve host from request
        const host = req.get('host');
        const protocol = req.secure ? 'https' : 'http'; // Use 'https' if secure, otherwise 'http'
        const confirmationUrl = `${protocol}://${host}/api/v1/auth/confirm/${confirmationToken}`;

        // Send confirmation email again
        await sendEmail(
          email,
          'Confirm Your Email Address',
          `Please click the following link to confirm your email address: ${confirmationUrl}`,
          `<p>Please click the following link to confirm your email address:</p><p><a href="${confirmationUrl}">${confirmationUrl}</a></p>`
        );

        return res.status(200).send({
          success: false,
          message: "Please check your email to confirm your address.",
        });
      }

      return res.status(200).send({
        success: false,
        message: "Already Registered and Verified, Please Login",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate a confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    // Save new user
    const user = new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
      confirmationToken,
      isVerified: false,
    });
    await user.save();

    // Retrieve host from request
    const host = req.get('host');
    const protocol = req.secure ? 'https' : 'http'; // Use 'https' if secure, otherwise 'http'
    const confirmationUrl = `${protocol}://${host}/api/v1/auth/confirm/${confirmationToken}`;

    await sendEmail(
      email,
      'Confirm Your Email Address',
      `Please click the following link to confirm your email address: ${confirmationUrl}`,
      `<p>Please click the following link to confirm your email address:</p><p><a href="${confirmationUrl}">${confirmationUrl}</a></p>`
    );

    res.status(201).send({
      success: true,
      message: "User Registered Successfully. Please check your email to confirm your address.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error: error.message,
    });
  }
};



exports.confirmToken = async(req,res)=>{
  try {
    const { token } = req.params;

    // Find the user by token
    const user = await userModel.findOne({ confirmationToken: token });
    if (!user) {
      return res.status(400).send({ success: false, message: 'Invalid token' });
    }

    // Verify the user's email
    user.isVerified = true;
    user.confirmationToken = null; // Clear the token
    await user.save();

    res.status(200).send({
      success: true,
      message: 'Email confirmed successfully. You can now log in.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in email confirmation',
      error: error.message,
    });
  }
}



exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and Password are required"
      });
    }

    // Check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered"
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).send({
        success: false,
        message: "Please verify your email address before logging in"
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid Credentials"
      });
    }

    // Generate token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '5d' });

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        image: user.image
      },
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message
    });
  }
}



exports.updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    console.log("Request Body:", req.body); // Log request body

    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (password && password.length < 6) {
      return res.status(400).json({ error: "Password is required and must be at least 6 characters long" });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Error While Updating Profile",
      error: error.message,
    });
  }
};



exports.getOrders = async (req, res) => {
  try {
    const orders = await orderMOdel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
  
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error); // More specific error logging
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error: error.message,
    });
  }
};


exports.getAdminOrders = async (req, res) => {
  try {
    console.log("User ID:", req.user._id); // Debugging statement
    const orders = await orderMOdel
      .find({ AdminId: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort("-createdAt");
  
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error); // More specific error logging
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error: error.message,
    });
  }
};


exports.changeOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log('Order ID:', orderId); // Log to check the order ID
    console.log('Status:', status); // Log to check the status

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required"
      });
    }

    const order = await orderMOdel.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.log('Error:', error);
    res.status(500).send({
      success: false,
      message: "Error while updating order",
      error
    });
  }
};


