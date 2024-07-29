const z= require('zod')
const Employee= require('../models/employeeModel')

const multer=require('multer');
const path=require('path');

const employeeSchema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().length(10, 'Mobile number must be 10 digits'),
  designation: z.enum(['HR', 'Manager', 'Sales'], 'Designation is required'),
  gender: z.enum(['Male', 'Female'], 'Gender is required'),
  course: z.string().nonempty('At least one course must be selected'),
  image: z.string()
});

const createEmployeeController = async (req,res) => {
    const { name, email, mobile, designation, gender, course } = req.body;
    const image = req.file ? req.file.path : null; 
  
    try {
        const {success}= employeeSchema.safeParse({
        name,
        email,
        mobile,
        designation,
        gender,
        course,
        image
      });
   
   if(!success){
    return res.status(400).json({message: "Incorrect Inputs"})
   }
  

      const ifexists= await Employee.findOne({email: email});
      if(ifexists){
        return res.status(401).json({ message: 'employee already exists' });
      }
     
      const newEmployee = new Employee({
        name,
        email,
        mobile,
        designation,
        gender,
        course,
        image
      });
  
      await newEmployee.save();
      res.status(201).json({ message: 'Employee created successfully', data: newEmployee });
    } catch (error) {
        console.log(error)
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors
        });
      } else {
        
        res.status(500).json({
          success: false,
          message: 'An unexpected error occurred'
        });
      }
    }
  
}

module.exports=createEmployeeController








