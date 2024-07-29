import React, { useState,useEffect } from 'react'
import './EmployeeList.css'
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom'
import Pagination from '@mui/material/Pagination';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
  '@media (min-width: 600px)': {
    width: '70%', // Width for screens larger than 600px
  },
  '@media (min-width: 900px)': {
    width: '50%', // Width for screens larger than 900px
  },
  '@media (min-width: 1200px)': {
    width: '30%', // Width for screens larger than 1200px
  },
};

const EmployeeList = () => {
  const navigate=useNavigate();
  const [currentPage,setCurrentPage]=useState(1);
  const [loading,setloading]=useState(true);
  const [employees,setEmployees]=useState([]);
  const [search,setSearch]=useState('');
  const recordsPerPage=4;
  const [open, setOpen] =useState(false);
  const [selectedEmployee,setselectedEmployee]=useState(null)
  

const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem('token');
   
    const response = await axios({
      method:'get',
      url:`http://localhost:3000/api/admin/employeelist?search=${search}`,
      headers: {
        'Authorization':`Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      
    });
    setEmployees(response.data.employees)
   
    setloading(false);
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
  
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // Formats to dd/mm/yyyy
};

const deleteEmployees = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios( {
      method:'delete',
      url:`http://localhost:3000/api/admin/delete/${id}`,
      headers: {
        'Authorization':`Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    fetchEmployees();
    toast.success(response.data.message);
  } catch (error) {
    console.error('Error deleting employee:', error);
    toast.error('Error deleting employee')
  }
  
};

const handleOpen = (employee) => {
  setOpen(true);
  setselectedEmployee(employee);
}
const handleClose = () => {
 
 setOpen(false);
} 

const formik = useFormik({
  enableReinitialize: true, 
  initialValues: {
    name: selectedEmployee?.name || '',
    email: selectedEmployee?.email || '',
    mobile: selectedEmployee?.mobile || '',
    designation: selectedEmployee?.designation || '',
    gender: selectedEmployee?.gender || '',
    course: selectedEmployee?.course || [],
  },
  validationSchema: Yup.object({
    name: Yup.string().required('Name is required').min(3, 'Must be 3 charcaters or more'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
      .required('Mobile number is required'),
    designation: Yup.string().required('Designation is required'),
    gender: Yup.string().required('Gender is required'),
    course: Yup.array().min(1, 'At least one course must be selected'),
  }),
  onSubmit: async (values, { resetForm }) => {
    try {
      const token = localStorage.getItem('token');
      console.log(values)
      const response = await axios( {
         method:'put',
         url:`http://localhost:3000/api/admin/editemployee/${selectedEmployee._id}`,
         headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data:values
      });
      fetchEmployees();
      toast.success(response.data.message);
      resetForm();
      handleClose();
    } catch (error) {
      console.log(error);
      console.error('Error updating employee:', error);
      toast.error('Error updating employee');
    }
  },
});

const handleCheckboxChange = (event) => {
  const { value, checked } = event.target;
  if (checked) {
    formik.setFieldValue('course', [...formik.values.course, value]);
  } else {
    formik.setFieldValue('course', formik.values.course.filter((item) => item !== value));
  }
};
useEffect(() => {
  fetchEmployees();
}, [search]);
  
 const handlePageChange=(event,value)=>{
  setCurrentPage(value);
 }

 const indexOfLastEmployee = currentPage * recordsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - recordsPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

 {
  if(loading){
    return <div className='text-xl font-bold text-center'>Loading....</div>
  }
 }
  return (
    <div className='md:m-6  m-4'>
        
        
        <div className='flex md:flex-row flex-col justify-between   my-2 p-2'>
            <div className='md:text-2xl text-lg font-bold'>Employee List</div>
            <div className='flex flex-row gap-7 items-center justify-between'>
                <p className='md:text-lg'>Total Count: {employees.length}</p>
                <button className='bg-orange-300 rounded p-2 md:text-lg font-semibold' onClick={()=>navigate('/createemployee')}>Create Employee</button>
            </div>
         </div>


        <div className='flex justify-end gap-4 my-4 mx-2'> 
        <label htmlFor="search" className='text-lg font-medium'>Search</label>
        <input type="text" className='border focus:border-black outline-none rounded md:w-[15vw] w-full md:p-2 p-1' value={search} onChange={(e)=>{setSearch(e.target.value)}} />
        </div>



 {employees.length? <>
  <div className='mx-2 my-5  rounded overflow-x-auto shadow-2xl'>
        <table className='w-[100%] border-collapse  '>
        <thead>
          <tr className='bg-black text-white'>
             <th>Unique Id</th>
             <th>Image</th>
             <th>Name</th>
             <th>Email</th>
             <th>Mobile No</th>
             <th>Designation</th>
             <th>Gender</th>
             <th>Course</th>
             <th>Created date</th>
             <th>Action</th>
           </tr>
           </thead>
  <tbody>
  {
    currentEmployees.map((employee,id)=>(
        <tr key={id} className='border border-gray-300 hover:bg-gray-100'>
            <td className='text-center'>{id+1}</td>
            <td><img src={`http://localhost:3000/${employee.image}`} alt={employee.name} width='70' height='70' /></td>
            <td>{employee.name}</td>
            <td> <a href={`mailto:${employee.email}`} className='text-blue-500 underline cursor-pointer' >{employee.email}</a> </td>
            <td>{employee.mobile}</td>
            <td>{employee.designation}</td>
            <td>{employee.gender}</td>
            <td>{employee.course}</td>
            <td>{formatDate(employee.createdAt)}</td>
            <td>
            <Tooltip title="Edit">
               <EditNoteIcon onClick={()=> handleOpen(employee) }/>
              </Tooltip>
              <Tooltip title="Delete">
               <DeleteIcon onClick={()=> deleteEmployees(employee._id)}/>
               </Tooltip>
            </td>
        
        </tr>
    )
   
    )
  }
  </tbody>
  
</table>
        </div>
        <div className='flex justify-center items-center mx-2 my-4'>
        <Pagination
           count={Math.ceil(employees.length/recordsPerPage)}
          page={currentPage}
           onChange={handlePageChange}
          variant="outlined"
          color="primary"
        />
      </div>
 
 </>: <div className='text-center font-bold text-xl'>No Employees are found</div>}
        
 {open? 
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <div className=' border border-black w-full  p-5 rounded'>
        <div className='flex flex-col  gap-3 my-2'>
          <label htmlFor="name" className='text-md font-medium'>Name</label>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className=' rounded p-1 border border-black focus:border-black outline-none'
            />
            {formik.errors.name && formik.touched.name ? (
              <div className="text-red-500 text-md mt-1">{formik.errors.name}</div>
            ) : null}
          </div>
        </div>

        <div className='flex flex-col  gap-3 my-2'>
          <label htmlFor="email" className='text-md font-medium'>Email</label>
          <div>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              id="email"
              className=' outline-none border-black rounded p-1 border'
            />
            {formik.errors.email && formik.touched.email ? (
              <div className="text-red-500 text-md mt-1">{formik.errors.email}</div>
            ) : null}
          </div>
        </div>

        <div className='flex flex-col  gap-3 my-2'>
          <label htmlFor="mobile" className='text-md font-medium'>Mobile No</label>
          <div>
            <input
              type="tel"
              name="mobile"
              id="mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              className='rounded p-1 border border-black focus:border-black outline-none'
            />
            {formik.errors.mobile && formik.touched.mobile ? (
              <div className="text-red-500 text-md mt-1">{formik.errors.mobile}</div>
            ) : null}
          </div>
        </div>

        <div className='flex flex-col gap-3 my-2'>
          <label htmlFor="designation" className='text-md font-medium'>Designation</label>
          <select
            name="designation"
            id="designation"
            value={formik.values.designation}
            onChange={formik.handleChange}
            className='p-1 border border-black focus:border-black outline-none'
          >
            <option value="">Select Designation</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
          {formik.errors.designation && formik.touched.designation ? (
            <div className="text-red-500 text-md mt-1">{formik.errors.designation}</div>
          ) : null}
        </div>

        <div className='flex flex-col  gap-5 my-2'>
          <label htmlFor="gender" className='text-md font-medium'>Gender</label>
          <div className='flex items-center gap-2'>
            <input
              type="radio"
              id="male"
              name="gender"
              value="Male"
              checked={formik.values.gender === 'Male'}
              onChange={formik.handleChange}
              className='h-4 w-4'
            />
            <label htmlFor="male">Male</label>
            <br />
            <input
              type="radio"
              id="female"
              name="gender"
              value="Female"
              checked={formik.values.gender === 'Female'}
              onChange={formik.handleChange}
              className='h-4 w-4'
            />
            <label htmlFor="female">Female</label>
          </div>
          {formik.errors.gender && formik.touched.gender ? (
            <div className="text-red-500 text-md mt-1">{formik.errors.gender}</div>
          ) : null}
        </div>

        <div className='flex flex-col  gap-5 my-2'>
          <label htmlFor="course" className='text-md font-medium'>Course</label>
          <div className='flex items-center gap-2'>
            <input
              type="checkbox"
              id="MCA"
              name="course"
              value="MCA"
              checked={formik.values.course.includes('MCA')}
              onChange={handleCheckboxChange}
              className='h-4 w-4'
            />
            <label htmlFor="MCA">MCA</label>
            <br />
            <input
              type="checkbox"
              id="BCA"
              name="course"
              value="BCA"
              checked={formik.values.course.includes('BCA')}
              onChange={handleCheckboxChange}
              className='h-4 w-4'
            />
            <label htmlFor="BCA">BCA</label>
            <br />
            <input
              type="checkbox"
              id="BSC"
              name="course"
              value="BSC"
              checked={formik.values.course.includes('BSC')}
              onChange={handleCheckboxChange}
              className='h-4 w-4'
            />
            <label htmlFor="BSC">BSC</label>
          </div>
          {formik.errors.course && formik.touched.course ? (
            <div className="text-red-500 text-md mt-1">{formik.errors.course}</div>
          ) : null}
        </div>
{/* 
        <div className='flex flex-col md:flex-row gap-5 my-4'>
          <label htmlFor="image" className='text-lg font-medium'>Image</label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            className='p-1 border border-black rounded'
          />
          {fileError && <div className="text-red-500 text-md mt-1">{fileError}</div>}
        </div> */}

        <button type='submit' onClick={formik.handleSubmit} className='text-xl bg-black text-slate-200 rounded px-5 py-1'>Submit</button>
      </div>  
        </Box>
      </Modal>: null}


    </div>
  )
}

export default EmployeeList







