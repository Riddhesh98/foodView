import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FoodPartnerLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const handleSubmit = async(e)=>{
    e.preventDefault()

    const data = {
      email,
      password
    }

    const res=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/food-partner/login`, data,
    {
      withCredentials: true
    }
    )
    if(res.status === 200 || res.status === 201){
      navigate('/food-partner/home')
      console.log(res)
    }
    else{
      console.log(res)
    }
}

  

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-8 bg-fixed bg-[radial-gradient(circle_at_30%_20%,#f1f5f9_0%,#f9fafb_60%)]">
      <div className="w-full max-w-[420px] bg-white border border-slate-200 p-6 pb-5 rounded-lg shadow-md flex flex-col gap-5" role="region" aria-labelledby="partner-login-title">
        <header className="text-center">
          <h1 id="partner-login-title" className="text-[1.45rem] font-semibold tracking-[.5px] mb-2">Partner login</h1>
          <p className="text-sm text-slate-600">Access your dashboard and manage orders.</p>
        </header>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-[.07em] font-semibold text-slate-600" htmlFor="email">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
            className="appearance-none w-full min-w-0 border border-slate-200 bg-slate-100 px-3 py-2.5 rounded outline-none text-slate-900 transition-colors focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/40 focus-visible:bg-white" id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-[.07em] font-semibold text-slate-600" htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
            className="appearance-none w-full min-w-0 border border-slate-200 bg-slate-100 px-3 py-2.5 rounded outline-none text-slate-900 transition-colors focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/40 focus-visible:bg-white" id="password" name="password" type="password" placeholder="Password" autoComplete="current-password" />
          </div>
          <button className="mt-2 bg-blue-600 text-white border-0 px-4 py-3 font-semibold rounded cursor-pointer tracking-[.5px] inline-flex items-center justify-center gap-1.5 transition-colors active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 hover:bg-blue-700" type="submit">Sign In</button>
        </form>

        <div className="text-center text-sm text-slate-600">
          New partner? <a className="font-semibold text-blue-600 hover:text-blue-700" href="/food-partner/register">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;