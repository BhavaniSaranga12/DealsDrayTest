import { useState } from 'react'
import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom'
import './App.css'
import Login from './Components/Login'
import Navbar from './Components/Navbar'
import EmployeeList from './Components/EmployeeList'
import CreateEmployee from './Components/CreateEmployee'
import Home from './Components/Home'
import toast, { Toaster } from 'react-hot-toast';
import {isLogged,isLoading, User} from './atom.js'
import { useRecoilState,useSetRecoilState } from 'recoil'
import { useEffect } from 'react'
import axios from 'axios'

function App() {
 const [Logged,setLogged]=useRecoilState(isLogged);
 
 const setuser=useSetRecoilState(User)


 useEffect(() => {
  const checkUserAuthentication = async () => {
    try {
    

      const token = localStorage.getItem('token');
      if (!token) {
        setLogged(false);
        setuser('');
       
        return;
      }

      const response = await axios({
        method: 'get',
        url: 'http://localhost:3000/api/validate',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      

      if (response.status === 200) {
        setLogged(true);
        setuser(response.data.name);
      
      } else {
        setLogged(false);
        setuser('');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setLogged(false);
      setuser('');
     
    } 
  };

  checkUserAuthentication();
}, []);

  return (
    <>
      <BrowserRouter>
      <div className='md:text-3xl text-2xl font-bold md:m-6  m-4 p-2'>DealsDrayTest</div>
     
     {Logged?<Navbar></Navbar>:null}
      
    
      
       <Routes>
       <Route path='/' element= {!Logged ? <Navigate to='/login'/>: <Home/> }/>
        <Route path='/login' element={Logged?  <Navigate to='/'/>: <Login/>}></Route>
        <Route path='/home' element= {!Logged ? <Navigate to='/login'/>: <Home/> }/>
        <Route path='/employeelist' element= {!Logged ? <Navigate to='/login'/>: <EmployeeList/> } />
        <Route path='/createemployee'element= {!Logged ? <Navigate to='/login'/>: <CreateEmployee/> } />
        
       </Routes>
       <Toaster />
      </BrowserRouter>
       
    </>
  )
}

export default App
