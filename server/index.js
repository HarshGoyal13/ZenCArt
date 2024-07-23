const express = require("express")
const app = express()
const connectDB = require("./config/database")
require("dotenv").config()
const morgan = require("morgan")
const cors = require('cors')


const authRoutes = require("./routes/authRoutes")
const categoryRoutes = require("./routes/CategoryRoutes")
const productRoutes = require("./routes/ProductRoutes")
const contactus = require("./controllers/contactUs")







// middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

// routes middleware
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1", contactus)



app.listen(process.env.PORT, ()=>{
    connectDB()
    console.log(`Server Running at ${process.env.PORT}`)
})