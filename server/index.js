const express= require('express');
const app=express();
const dotenv=require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('./models/adminModel');
const bcrypt= require('bcrypt')
dotenv.config();
const adminRoute = require('./Routes/adminRoute')
const path=require('path');
const authMiddleware = require('./middlewares/authMiddleware');

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const corsOption={
  origin: 'https://deals-dray-test-five.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}
app.use(cors(corsOption))
app.options('*', (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://deals-dray-test-five.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendStatus(204);
});

const connectToDatabase = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB is connected');
    } catch (error) {
      console.error('Error connecting to DB', error);
    }
  };
  connectToDatabase();

  app.get('/',async(req,res)=>{
    res.send("Hello everyone")
  })
  // app.post('/',async (req,res)=>{
  //   const newUser= new admin({
  //       username:req.body.username,
  //       password:await bcrypt.hash(req.body.password,10)
  //   });
  //   newUser.save();
  //   res.json(
  //       'successfull'
  //   )
  
  // })

  app.use('/api/admin',adminRoute);
  app.get('/api/validate',authMiddleware,(req,res)=>{
    res.status(200).json({
      message:'Authenicated',
      name:req.user.username
    })
  });
  

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});