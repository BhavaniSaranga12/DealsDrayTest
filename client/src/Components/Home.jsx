import React from 'react'
import {  useRecoilValue } from 'recoil'
import { User } from '../atom'

const Home = () => {
  const user=useRecoilValue(User)
  return (
    <div className='flex justify-center items-center h-[50vh] text-3xl font-bold m-5'>
      Hello {user} , <br />Welcome to the admin panel
    </div>
  )
}

export default Home