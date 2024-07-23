const mongoose =  require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product:{
        type: mongoose.ObjectId,
        ref: "Products",
      },
    user: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    image:{
      type:String
    },
    comment:{
        type:String,
        required:true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
    createdAt: {
        type: Date,
        default: Date.now
      }

  },
  { timestamps: true }
);

module.exports =  mongoose.model("Review", reviewSchema);