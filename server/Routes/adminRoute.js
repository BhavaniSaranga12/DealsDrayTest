const express = require('express');
const router = express.Router();
const login=require('../Controllers/loginController')
const createEmployee=require('../Controllers/createEmployeeController')
const editEmployee=require('../Controllers/editEmployeeController')
const employeeList=require('../Controllers/employeeListController')
const Employee =require('../models/employeeModel')

const multer=require('multer');
const path=require('path');
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directory where files will be saved
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
    }
  });
  
  const upload = multer({ storage: storage });




router.post('/login',login);
router.post('/createemployee',authMiddleware,upload.single('image'),createEmployee);
router.put('/editemployee/:id',authMiddleware,editEmployee);
router.get('/employeelist',authMiddleware,employeeList);
router.delete('/delete/:id',authMiddleware, async (req, res) => {
    try {
      await Employee.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
  });



module.exports = router;