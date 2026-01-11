import React, { useState } from "react";
import { User, ArrowRight, Lock, Grid3x3 } from "lucide-react";
import { useAuth } from '../../context/AuthContext';

export default function EmployeeLogin() {
  const [employeeId, setEmployeeId] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
const {login}  = useAuth();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required";
    } else if (employeeId.trim().length < 3) {
      newErrors.employeeId = "Employee ID must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      showToast("Please enter a valid Employee ID", "error");
      return;
    }

    setIsLoading(true);

    try {
      
      const response = await login(false , false , employeeId);
      console.log(response);
     if(response.success){
             
           showToast('Login succesfully Redirecting!' , 'success');
           setTimeout(() => {
        window.location.href = "/employee/dashboard";
                }, 1500); 
          }

      
      // showToast("Login successful! Redirecting...", "success");
      
     
      // setTimeout(() => {
      //   window.location.href = "/employee/dashboard";
      //   console.log("Redirecting to dashboard with ID:", employeeId);
      // }, 1000);

    } catch (error) {
      console.error("Login error:", error);
      showToast(error.message || "Invalid Employee ID. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f6f7f8] font-[Inter]">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 animate-slideIn ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-md`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-red-300' : 'bg-green-300'}`}></div>
          <span className="font-medium">{toast.message}</span>
          <button 
            onClick={() => setToast({ show: false, message: '', type: '' })} 
            className="ml-auto text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative text-white">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600"
          className="absolute inset-0 w-full h-full object-cover"
          alt="office"
        />
        <div className="absolute inset-0 bg-[#0f1729]/80"></div>

        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div className="flex items-center gap-2">
            <Grid3x3 size={24} />
            <span className="font-bold">Enterprise EMS</span>
          </div>

          <div>
            <h1 className="text-4xl font-bold leading-tight mb-6">
              Streamlined workforce management for the modern enterprise.
            </h1>

            {/* PROFILE IMAGES */}
            <div className="flex items-center gap-3 text-blue-200 text-sm">
              <div className="flex -space-x-3">
                <img
                  src="https://i.pravatar.cc/40?img=1"
                  className="w-8 h-8 rounded-full border-2 border-white"
                  alt="user1"
                />
                <img
                  src="https://i.pravatar.cc/40?img=2"
                  className="w-8 h-8 rounded-full border-2 border-white"
                  alt="user2"
                />
                <img
                  src="https://i.pravatar.cc/40?img=3"
                  className="w-8 h-8 rounded-full border-2 border-white"
                  alt="user3"
                />
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-xs">
                  +2k
                </div>
              </div>
              Join 2,000+ employees
            </div>
          </div>

          <div className="text-sm text-white/50">
            © 2024 Enterprise Corp · Privacy · Terms
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(#dcdfe4_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative bg-white w-[420px] rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-[#0f1729] mb-2">
            Employee Portal
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            Securely access your dashboard using your unique ID.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="text-sm font-semibold">Employee ID</span>
              <div className="relative mt-2">
                <User 
                  className="absolute left-3 top-3 text-slate-400" 
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Ex: #EMP-001"
                  value={employeeId}
                  onChange={(e) => {
                    setEmployeeId(e.target.value);
                    
                    if (errors.employeeId) {
                      setErrors({ ...errors, employeeId: '' });
                    }
                  }}
                  className={`w-full h-12 pl-10 pr-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#0f1729]/20 ${
                    errors.employeeId ? 'border-red-500 focus:ring-red-500/20' : ''
                  }`}
                />
              </div>
              {errors.employeeId && (
                <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>
              )}
            </label>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#0f1729] hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  Secure Login
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4 cursor-pointer hover:text-slate-700">
            Forgot ID?
          </p>

          <div className="mt-6 border rounded-xl p-4 bg-slate-50">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                SYSTEM OPERATIONAL
              </span>
              <span className="text-slate-400">v2.4.0</span>
            </div>

            <div className="mt-2 h-1.5 bg-slate-200 rounded-full">
              <div className="h-full w-full bg-[#0f1729] rounded-full"></div>
            </div>
          </div>

          <div className="mt-6 text-xs text-slate-400 flex justify-center items-center gap-1">
            <Lock size={14} />
            Protected by Enterprise Grade Security
          </div>
        </div>
      </div>
    </div>
  );
}