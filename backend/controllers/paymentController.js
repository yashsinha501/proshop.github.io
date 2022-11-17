// import { instance } from "../server"
import Razorpay from "razorpay"

const instance = new Razorpay({ key_id: "rzp_test_KZOaGfMuvCHNCw", key_secret: "tljp89zBBN3RrBYELxzK1Idx" })

// const instance = new Razorpay({ 
//     key_id: process.env.RAZORPAY_API_KEY, 
//     key_secret: process.env.RAZORPAY_SECRET_KEY,
// })

export const checkout =async (req,res)=>{

    const options = {
        amount: Number(req.body.amount)*100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      const order=await instance.orders.create(options)

      console.log(order);
      res.status(200).json({
        success:true,
        order,
      })
};

export const paymentVerification =async (req,res)=>{

    console.log(req.body);

      res.status(200).json({
        success:true,
        order,
      })
};