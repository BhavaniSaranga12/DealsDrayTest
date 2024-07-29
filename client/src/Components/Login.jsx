import React from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios'
import { useSetRecoilState } from 'recoil';
import { isLogged, User } from '../atom';

const Login = () => {
  const navigate=useNavigate()
  const setLogged=useSetRecoilState(isLogged)
  const setuser=useSetRecoilState(User)
    const formik = useFormik({
        initialValues: {
          username: '',
          password: '',
        },
        validationSchema: Yup.object({
          username: Yup.string()
            .required('Username is required')
            .min(3, 'Username must be at least 3 characters long'),
          password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters long'),
        }),
        onSubmit: async (values) => {
          console.log(values);
          try {
            const response= await axios({
              method:'post',
              url:'http://localhost:3000/api/admin/login',
              data:{
                username:values.username,
                password:values.password
              }
             })
             if(response.status==200){
              
              localStorage.setItem('token',response.data.token);
              setLogged(true);
              setuser(response.data.name);
              navigate('/home');
              toast.success(response.data.message)
             }
           
            
          } catch (error) {
            console.log(error)
            if(error.response.status==400){
            
              toast.error(error.response.data.message)
             }
             else if(error.response.status==500){
              toast.error(error.response.data.message)
             }
             else {
              toast.error('please try again later')
             }
          }
           
        },
      });
  return (
    <div className='flex justify-center h-[70vh] items-center '>
    <div className='flex flex-col bg-black text-white md:p-[4%] p-4 rounded'>
      <div className='text-3xl font-bold p-2'>Login</div>
        <div className='p-2 flex md:gap-7 gap-3 md:flex-row flex-col md:items-center'>
        <label htmlFor="usename" className='font-semibold text-xl'>Username</label>
        <div>
            <input type="text" 
                   name="username"
                   id="username" 
                   value={formik.values.username}
                   onChange={formik.handleChange}
                   className={`border p-1 text-black border-gray-400 rounded focus:border-black outline-none lg:w-[20vw]  md:w-[40vw] sm:w-[50vw] w-full ${
                    formik.touched.username && formik.errors.username ? 'border-red-500' : ''
                    }`}
                    
              /> 
              {formik.touched.username && formik.errors.username ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
            ) : null}
            </div>
        </div>
        <div className='p-2 flex md:gap-8 gap-3 md:flex-row flex-col md:items-center'>    
        <label htmlFor="password" className='font-semibold text-xl'>Password</label>
        <div> 
            <input type="text"
                   name="password" 
                   id="password"  
                   value={formik.values.password}
                   onChange={formik.handleChange}
                   className={`border p-1 text-black border-gray-400 rounded focus:border-black outline-none lg:w-[20vw]  md:w-[40vw] sm:w-[50vw] w-full ${
                formik.touched.password && formik.errors.password ? 'border-red-500' : ''
              }`}
             />
               {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            ) : null}   
            </div>     
        </div>  
        <button type='submit' className='bg-green-500 text-lg text-white mt-3 mx-2 p-1 rounded' onClick={formik.handleSubmit}>Login</button>
   </div>
   </div>
  )
}

export default Login