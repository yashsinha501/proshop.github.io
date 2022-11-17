import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import { notFound, errorHandler} from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js' 
import userRoutes from './routes/userRoutes.js' 
import Razorpay from 'razorpay'
import paymentRoutes from './routes/paymentRoutes.js'
import cors from "cors"


dotenv.config()

connectDB()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
  res.send("api is running...")
});


app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/payment',paymentRoutes)

app.get("/api/getkey",(req,res)=>res.status(200).json({key:process.env.RAZORPAY_API_KEY}))

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

// export const instance = new Razorpay({ 
//     key_id: process.env.RAZORPAY_API_KEY, 
//     key_secret: process.env.RAZORPAY_SECRET_KEY,
//  })


app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);
