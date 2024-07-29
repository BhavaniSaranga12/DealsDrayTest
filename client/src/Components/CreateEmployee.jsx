import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateEmployee = () => {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      designation: '',
      gender: '',
      course: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
        .required('Mobile number is required'),
      designation: Yup.string().required('Designation is required'),
      gender: Yup.string().required('Gender is required'),
      course: Yup.array().min(1, 'At least one course must be selected'),
    }),
    onSubmit: async (values,{resetForm}) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('mobile', values.mobile);
      formData.append('designation', values.designation);
      formData.append('gender', values.gender);
      formData.append('course', values.course);
      console.log(values.course)
      if (file) {
        formData.append('image', file);
      }

      try {
        const token=localStorage.getItem('token')
        const response = await axios.post('http://localhost:3000/api/admin/createemployee', formData, {
          headers: {
            'Authorization':`Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        toast.success(response.data.message) 
        resetForm();
        
      } catch (error) {
        
        console.error(error);
      if(error.response.status==401)
        toast.error(error.response.data.message)
        toast.error('Error occured') 
      }
    }
  });

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      formik.setFieldValue('course', [...formik.values.course, value]);
    } else {
      formik.setFieldValue('course', formik.values.course.filter((item) => item !== value));
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      
      const validTypes = ['image/jpeg', 'image/png'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setFileError(null); // Clear any previous errors
      } else {
        setFile(null);
        setFileError('Only JPG and PNG files are allowed');
      }
    }
  };

  return (
    <div className='md:m-6 m-4 flex flex-col gap-4 rounded p-5 items-start'>
      <div className='text-2xl font-bold'>Create Employee</div>
      <div className='md:m-3 m-1 border border-black w-full md:p-10 p-5 rounded'>
        <div className='flex flex-col md:flex-row gap-3 my-4'>
          <label htmlFor="name" className='text-lg font-medium'>Name</label>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className='lg:w-[20vw] rounded p-1 border border-black focus:border-black outline-none'
            />
            {formik.errors.name && formik.touched.name ? (
              <div className="text-red-500 text-md mt-1">{formik.errors.name}</div>
            ) : null}
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-3 my-4'>
          <label htmlFor="email" className='text-lg font-medium'>Email</label>
          <div>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              id="email"
              className='lg:w-[20vw] outline-none border-black rounded p-1 border'
            />
            {formik.errors.email && formik.touched.email ? (
              <div className="text-red-500 text-md mt-1">{formik.errors.email}</div>
            ) : null}
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-3 my-4'>
          <label htmlFor="mobile" className='text-lg font-medium'>Mobile No</label>
          <div>
            <input
              type="tel"
              name="mobile"
              id="mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              className='lg:w-[20vw] rounded p-1 border border-black focus:border-black outline-none'
            />
            {formik.errors.mobile && formik.touched.mobile ? (
              <div className="text-red-500 text-md mt-1">{formik.errors.mobile}</div>
            ) : null}
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-3 my-4'>
          <label htmlFor="designation" className='text-lg font-medium'>Designation</label>
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

        <div className='flex flex-col md:flex-row gap-5 my-4'>
          <label htmlFor="gender" className='text-lg font-medium'>Gender</label>
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

        <div className='flex flex-col md:flex-row gap-5 my-4'>
          <label htmlFor="course" className='text-lg font-medium'>Course</label>
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
        </div>

        <button type='submit' onClick={formik.handleSubmit} className='text-xl bg-black text-slate-200 rounded px-5 py-1'>Submit</button>
      </div>
    </div>
  );
};

export default CreateEmployee;