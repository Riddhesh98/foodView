import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserRegister from '../pages/auth/UserRegister';
import UserLogin from "../pages/auth/UserLogin"
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister"
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin"
import UserHome from '../pages/auth/UserHome';
import FoodPartnerCreate from '../pages/auth/FoodPartnerCreate';
import Profile from '../pages/auth/food-partner/Profile';
import UserProfile from '../pages/auth/UserProfile';
import SavedReels from '../pages/auth/SavedReels';


const AppRoutes = () => {
  return (
   <Router>

    <Routes>

      <Route path="/" element={<ChooseRegister />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path='/user/login' element={<UserLogin />} />
      <Route path ="/user/home" element={<UserHome />} />
      <Route path="/user/profile" element={<UserProfile />} />
      <Route path="/user/saved-reels" element={<SavedReels />} />
    
      
      <Route path='/food-partner/register' element={<FoodPartnerRegister />} />
      <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
      <Route path ="/food-partner/create" element={<FoodPartnerCreate />} />
     

      <Route path="/foodpartner/:id" element={<Profile />} />
    </Routes>
   </Router>
  )
}

export default AppRoutes