
import React from 'react';
import { Link } from 'react-router-dom';

const ChooseRegister = () => {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-8 bg-fixed bg-[radial-gradient(circle_at_30%_20%,#f1f5f9_0%,#f9fafb_60%)]">
      <div className="w-full max-w-[420px] bg-white border border-slate-200 p-6 pb-5 rounded-lg shadow-md flex flex-col gap-5" role="region" aria-labelledby="choose-register-title">
        <header className="text-center">
          <h1 id="choose-register-title" className="text-[1.45rem] font-semibold tracking-[.5px] mb-2">Register</h1>
          <p className="text-sm text-slate-600">Pick how you want to join the platform.</p>
        </header>

        <div className="flex flex-col gap-4">
          <Link to="/user/register" className="mt-2 bg-blue-600 text-white border-0 px-4 py-3 font-semibold rounded cursor-pointer tracking-[.5px] inline-flex items-center justify-center gap-1.5 transition-colors active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 no-underline hover:bg-blue-700">
            Register as normal user
          </Link>
          <Link to="/food-partner/register" className="mt-2 bg-slate-100 text-slate-900 border border-slate-200 px-4 py-3 font-semibold rounded cursor-pointer tracking-[.5px] inline-flex items-center justify-center gap-1.5 transition-colors active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 no-underline hover:bg-slate-200">
            Register as food partner
          </Link>
        </div>

        <div className="text-center text-sm text-slate-600 mt-1">
          Already have an account? <Link to="/user/login" className="font-semibold text-blue-600 hover:text-blue-700">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseRegister;
