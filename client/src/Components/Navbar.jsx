import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isLogged, User } from '../atom';

const Navbar = () => {
    const navigate=useNavigate();
    const setLogged=useSetRecoilState(isLogged)
    const  [user,setuser]=useRecoilState(User)
    
    function handleLogout(){
      localStorage.removeItem('token');
      setLogged(false);
      setuser('')
    }
  return (
   
    <div className='md:m-6  m-4  font-semibold md:text-xl text-sm bg-black text-white md:rounded-full rounded p-3  '>
        <ul className='flex flex-col md:flex-row justify-center md:gap-10 gap-4 '>
            <li className='cursor-pointer' onClick={()=>navigate('/home') }>Home</li>
            <li className='cursor-pointer' onClick={()=>navigate('/employeelist') }>Employee List</li>
           
            <li>Hi, {user} <button className='ml-8 cursor-pointer' onClick={()=>handleLogout()}>Logout</button></li>
           
        </ul>
    </div>
  
  )
}

export default Navbar