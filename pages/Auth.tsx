import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { SERVICE_CATEGORIES } from '../types';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, theme } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    favoriteService: SERVICE_CATEGORIES[0]
  });

  const [forgotPassword, setForgotPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPassword) {
      alert(`OTP sent to ${formData.mobile || formData.email || 'your registered contact'}. (Simulation)`);
      // Simulate password reset flow
      const newPass = prompt("Enter OTP (simulated: 1234):");
      if (newPass === "1234") {
        const resetPass = prompt("Enter new password:");
        if (resetPass) {
          alert("Password changed successfully!");
          setForgotPassword(false);
        }
      } else {
        alert("Invalid OTP");
      }
      return;
    }

    // Mock Authentication
    const user = {
      name: isLogin ? 'Demo User' : formData.name,
      email: formData.email,
      mobile: formData.mobile,
      address: isLogin ? 'Demo Address, Kanpur' : formData.address,
      favoriteService: formData.favoriteService
    };
    login(user);
    navigate('/home');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-serif text-gray-900">
            {forgotPassword ? "Reset Password" : (isLogin ? "Welcome Back to Lotoria" : "Join Lotoria Beauty")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
             {forgotPassword ? "Enter your registered email or mobile" : "Professional Beauty Services at Home"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!forgotPassword && (
            <>
               {!isLogin && (
                <>
                  <input name="name" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm" placeholder="Full Name" onChange={handleChange} />
                  <input name="address" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm" placeholder="Address (Kanpur)" onChange={handleChange} />
                  <select name="favoriteService" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm" onChange={handleChange}>
                    {SERVICE_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </>
              )}
              
              <input name="email" type="text" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm" placeholder="Email / Mobile Number" required onChange={handleChange} />
              <input name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm" placeholder="Password" onChange={handleChange} />
            </>
          )}

          {forgotPassword && (
             <input name="mobile" type="text" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold sm:text-sm" placeholder="Registered Mobile or Email" onChange={handleChange} />
          )}

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold" style={{ backgroundColor: theme.primaryColor }}>
              {forgotPassword ? "Send OTP" : (isLogin ? "Sign In" : "Sign Up")}
            </button>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            {!forgotPassword && (
                <button type="button" onClick={() => setForgotPassword(true)} className="text-brand-gold hover:underline">
                    Forgot Password?
                </button>
            )}
             {forgotPassword && (
                <button type="button" onClick={() => setForgotPassword(false)} className="text-brand-gold hover:underline">
                    Back to Login
                </button>
            )}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-medium text-gray-600 hover:text-gray-500">
              {isLogin ? "New here? Sign Up" : "Already have an account? Login"}
            </button>
          </div>

          {!forgotPassword && (
            <div className="mt-4">
               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span>Google</span>
                    </button>
                    <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span>Phone OTP</span>
                    </button>
                </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};