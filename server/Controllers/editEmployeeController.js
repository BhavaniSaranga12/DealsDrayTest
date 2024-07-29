
const Employee=require('../models/employeeModel') 

async function editEmployeeController(req,res){
    const { id } = req.params;
    const updateData = req.body;
  
    try {
      const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
     
      res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
      res.status(500).json({ message: 'Error updating employee', error });
    }
  
}



module.exports=editEmployeeController;


