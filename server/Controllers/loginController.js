const admin = require("../models/adminModel");
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const dotenv = require('dotenv');
const z = require('zod')
dotenv.config();


const authSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .nonempty('Username is required'),
  
  password: z.string()
    .min(6, 'Password must be at least 6 characters long')
    .max(50, 'Password must not exceed 50 characters')
    .nonempty('Password is required')
}); 


async function loginController(req,res){
const {username,password}=req.body;

const {success}=authSchema.safeParse(req.body);

   
   if(!success){
    return res.status(400).json({message: "Incorrect Inputs"})
   }
try {
    const user=await admin.findOne({username:username});
  
    if(!user){
       return res.status(400).json({message:"user doesnot exits"})
    }
    const checkPwd= await bcrypt.compare(password,user.password);
    if(!checkPwd){
        return res.status(400).json({message:"Incorrect password"})
    }
   
    const payload= {
        id: user._id,
        name:user.username
    }
    const token=jwt.sign(payload, process.env.JWT_SECRET)
    return  res.status(200).json({message:"Login successful",token:token,name:user.username})
} catch (error) {
     console.error(error);
     return res.status(500).json({
        message:"Error"
     })
}
}



module.exports=loginController;