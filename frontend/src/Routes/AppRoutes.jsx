import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserRegister from '../pages/auth/UserRegister';
import UserLogin from "../pages/auth/UserLogin"
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister"
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin"
import UserHome from '../pages/auth/UserHome';
import FoodPartnerHome from '../pages/auth/FoodPartnerHome';


const AppRoutes = () => {
  return (
   <Router>

    <Routes>

      <Route path="/" element={<ChooseRegister />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path='/user/login' element={<UserLogin />} />
      <Route path ="/user/home" element={<UserHome />} />
    
      
      <Route path='/food-partner/register' element={<FoodPartnerRegister />} />
      <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
      <Route path ="/food-partner/home" element={<FoodPartnerHome />} />
    </Routes>
   </Router>
  )
}

export default AppRoutes