

const Employee =require('../models/employeeModel')
const employeeListController = async (req,res) => {
    
    try {
      
        const search = req.query.search || "";

        const employees = await Employee.find(
                {
                    $or: [
                        {name : { "$regex": search, "$options": 'i' } },
                        { email: { "$regex": search, "$options": 'i' } },
                        
                    ]
                },
        )
      
        res.json({
            employees: employees
            })
        
     
    } catch (error) {
      res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
}

module.exports=employeeListController







