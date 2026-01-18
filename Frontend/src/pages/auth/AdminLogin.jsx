import React, { useState } from "react";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineVerifiedUser,
} from "react-icons/md";
import { LuLogIn } from "react-icons/lu";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { BsShieldLock } from "react-icons/bs";
import { TbShieldSearch } from "react-icons/tb";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* LEFT SIDE IMAGE */
import sideImg from "../../assets/images/Admin.jpg";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email format!";
    }
    
    if (!values.password) {
      errors.password = "Password is required!";
    } else if (values.password.length < 4) {
      errors.password = "Password must be at least 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed 10 characters";
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validate(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      
      try {
        const result = await login(formValues.email, formValues.password , false , "Admin");

        if (result.success) {
          showToast("Login successful! Redirecting...", "success");
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 1500);
        }
      } catch (err) {
        const { response } = err;
        
        if (!response) {
          showToast("Network error. Please check your connection.", "error");
          return;
        }
        
        showToast(response.data.message || "Login failed. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      showToast("Please fix the errors in the form", "error");
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 animate-slideIn ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-md`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              toast.type === "error" ? "bg-red-300" : "bg-green-300"
            }`}
          ></div>
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, message: "", type: "" })}
            className="ml-auto text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-[#E3E8EC] px-4 py-8">
        {/* CONTAINER */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden bg-white">
          
          {/* LEFT IMAGE SIDE */}
          <div className="hidden md:flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="relative w-full h-full">
              <img
                src={sideImg}
                alt="Admin Login"
                className="w-full h-full object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-xl"></div>
            </div>
          </div>

          {/* RIGHT FORM SIDE */}
          <div className="p-6 sm:p-8 md:p-10">
            {/* ICON */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center ring-4 ring-blue-100 shadow-md">
                <MdOutlineAdminPanelSettings className="text-blue-800 text-3xl" />
              </div>
            </div>

            {/* TITLE */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-sm sm:text-base text-blue-600">
                Please enter your details to sign in.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  Work Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formValues.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`
                    w-full px-4 py-3
                    bg-blue-50
                    border-2 
                    ${formErrors.email ? 'border-red-500' : 'border-blue-200'}
                    rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all
                    text-sm font-medium
                  `}
                  autoComplete="off"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {formErrors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formValues.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`
                      w-full px-4 py-3 pr-12
                      bg-blue-50
                      border-2 
                      ${formErrors.password ? 'border-red-500' : 'border-blue-200'}
                      rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all
                      text-sm font-medium
                    `}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-700 hover:text-blue-900 disabled:opacity-50"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {formErrors.password}
                  </p>
                )}
              </div>

              {/* REMEMBER + FORGOT */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm">
                <label className="flex items-center gap-2 text-blue-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-blue-300 text-blue-900 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  disabled={isLoading}
                  className="font-semibold text-blue-900 underline hover:no-underline disabled:opacity-50"
                >
                  Forgot Password?
                </button>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  w-full h-12
                  bg-gradient-to-r from-blue-900 to-blue-800
                  text-white font-semibold
                  rounded-lg
                  flex items-center justify-center gap-2
                  shadow-lg shadow-blue-900/30
                  hover:shadow-xl hover:shadow-blue-900/40
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  active:scale-[0.98]
                "
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LuLogIn size={20} />
                    Secure Login
                  </>
                )}
              </button>
            </form>

            {/* SECURITY BADGES */}
            <div className="mt-8 text-center border-t border-blue-100 pt-6">
              <p className="text-xs text-blue-600 flex items-center justify-center gap-1.5 mb-3">
                <CiLock className="text-base text-green-600" />
                Protected by Enterprise Grade Security
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-xs text-blue-500">
                <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                  <MdOutlineVerifiedUser size={14} />
                  SOC2
                </span>
                <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                  <BsShieldLock size={14} />
                  256-bit AES
                </span>
                <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                  <TbShieldSearch size={14} />
                  ISO 27001
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
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
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}