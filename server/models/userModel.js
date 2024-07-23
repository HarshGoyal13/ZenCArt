const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: {},
        required: true,
      },
      image: {
        type: String,
      },
      role: {
        type: String,
        enum: ['Client', 'Admin'], // Optional: to enforce allowed roles
        default: "Client",
      },
      confirmationToken: { type: String },
      isVerified: { type: Boolean, default: false },
},
{timestamps:true}
);


module.exports = mongoose.model("User", userSchema)