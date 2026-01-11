


import React, { useState } from 'react';
import { MdGridView, MdOutlineAdminPanelSettings, MdOutlineVerifiedUser } from 'react-icons/md';
import { PiHeadset } from 'react-icons/pi';
import { LuLogIn } from 'react-icons/lu';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { CiLock } from 'react-icons/ci';
import { BsShieldLock } from 'react-icons/bs';
import { TbShieldSearch } from 'react-icons/tb';
import { useAuth } from '../../context/AuthContext';
import {useNavigate} from 'react-router-dom';

export default function AdminLogin() {
     const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [formValues, setFormValues] = useState({ email: "", password: "" });
    const [formErrors, setFormErrors] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
const {login}  = useAuth();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            try{
           
         const result = await login(formValues.email,formValues.password);
         
         
          if(result.success){
             
           showToast('Login succesfully Redirecting!' , 'success');
           setTimeout(() => {
                   navigate("/admin/dashboard");
                }, 1500); 
          }
           
       
        }catch(err){
          
            const {response} = err;
            if(!response){
                return;
            }
           
            showToast(`${response.data.message}` , 'error');
            
        }
            
        } else {
            showToast('Please fix the errors', 'error');
        }
    };

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.email) errors.email = "Email is required!";
        else if (!regex.test(values.email)) errors.email = "Invalid email format!";
        if (!values.password) errors.password = "Password is required!";
        else if (values.password.length < 4) errors.password = "Password must be at least 4 characters";
        else if (values.password.length > 10) errors.password = "Password cannot exceed 10 characters";
        return errors;
    };

    return (
        <>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-6 right-6 z-50 animate-slideIn ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-md`}>
                    <div className={`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-red-300' : 'bg-green-300'}`}></div>
                    <span className="font-medium">{toast.message}</span>
                    <button onClick={() => setToast({ show: false, message: '', type: '' })} className="ml-auto text-white/80 hover:text-white">
                        ✕
                    </button>
                </div>
            )}

            <div className="min-h-screen flex flex-col bg-[#D9DFE3] text-[#131416] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-white -z-10"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 -z-10"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0F1729] to-[#0F1729]/80"></div>

                {/* Header - Responsive */}
                {/* <header className="px-4 sm:px-6 md:px-8 py-4 md:py-6 w-full max-w-7xl mx-auto">
                    <div className="flex flex-col  items-center sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0F1729] rounded-full flex items-center justify-center text-white shadow-lg">
                                <MdGridView className="text-lg sm:text-xl" />
                            </div>
                            <div>
                                <h1 className="text-[#0F1729] text-lg sm:text-xl font-bold leading-none">
                                    EMS Portal
                                </h1>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-0.5">
                                    Enterprise Admin
                                </p>
                            </div>
                        </div>
                       
                    </div>
                </header> */}

                {/* Main Content - Responsive */}
                <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative z-10">
                    <div className="w-full max-w-[90%] sm:max-w-md md:max-w-[480px] bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0F1729]/80 to-[#0F1729]"></div>

                        <div className="mb-6 sm:mb-8 text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-[#0F1729] ring-4 sm:ring-8 ring-slate-50">
                                <MdOutlineAdminPanelSettings className="text-2xl sm:text-3xl" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-[#0F1729] mb-1 sm:mb-2">
                                Welcome Back
                            </h2>
                            <p className="text-slate-500 text-sm sm:text-base">
                                Please enter your details to sign in.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Work Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    name='email'
                                    className="w-full px-3 sm:px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F1729]/20 focus:border-[#0F1729] transition-all text-sm font-medium"
                                    autoComplete='off'
                                    value={formValues.email}
                                    onChange={handleChange}
                                />
                                {formErrors.email && <p className='text-red-500 text-sm mt-1'>{formErrors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        name='password'
                                        className="w-full px-3 sm:px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F1729]/20 focus:border-[#0F1729] transition-all text-sm font-medium pr-12"
                                        autoComplete='off'
                                        value={formValues.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-3 sm:right-4 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {formErrors.password && <p className='text-red-500 text-sm mt-1'>{formErrors.password}</p>}
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => setIsChecked(!isChecked)}
                                        className="h-4 w-4 rounded border-slate-300 text-[#0F1729] focus:ring-[#0F1729]/20 cursor-pointer transition-all"
                                    />
                                    Remember me
                                </label>
                                <button type="button" className="text-sm font-bold text-[#0F1729] underline hover:no-underline">
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                type='submit'
                                className="flex w-full items-center justify-center gap-2 rounded-lg h-11 sm:h-12 px-4 sm:px-6 bg-[#0F1729] hover:bg-[#0F1729]/90 text-white text-sm font-bold tracking-wide transition-all active:scale-[0.98] shadow-md shadow-[#0F1729]/20"
                            >
                                <LuLogIn className="text-[18px] sm:text-[20px]" />
                                Secure Login
                            </button>

                            
                        </form>

                        {/* Trust Section */}
                        <div className="mt-3 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
                            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                <CiLock className="text-base text-green-700" />
                                Protected by Enterprise Grade Security
                            </p>
                            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                                <div className="flex items-center gap-1">
                                    <MdOutlineVerifiedUser className="text-slate-600" />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">SOC2</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BsShieldLock className="text-slate-600" />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">256-bit AES</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <TbShieldSearch className="text-slate-600" />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">ISO 27001</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer - Responsive */}
                <footer className="text-center text-slate-400 text-sm px-4 py-4 sm:py-6">
                    <p>© 2024 EMS Enterprise Systems. All rights reserved.</p>
                    <div className="flex justify-center gap-3 sm:gap-4 mt-2 text-xs font-medium">
                        <a className="hover:text-[#0F1729]" href="#">Privacy Policy</a>
                        <span className="text-slate-300">•</span>
                        <a className="hover:text-[#0F1729]" href="#">Terms of Service</a>
                    </div>
                </footer>
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
