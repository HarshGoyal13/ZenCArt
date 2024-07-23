const mongoose = require("mongoose")
require("dotenv").config()

 connectDB = async() =>{
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log("Database Connected Successfully")
    }catch(error){
        console.log(error)
        console.log("Error in Database Connection")
    }
}

module.exports = connectDB
