import React, { useState } from "react";
import { User, ArrowRight, Lock, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../Components/formNavbar";

/* LOCAL IMAGE */
import sideImage from "../../assets/images/emp.jpg";

export default function EmployeeLogin() {
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const { login } = useAuth();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!employeeId.trim()) newErrors.employeeId = "Employee ID is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      showToast("Please enter a valid Employee ID", "error");
      return;
    }

    setIsLoading(true);

    try {
      
      const result = await login(email , password , employeeId , "employee");
      console.log(result);
     if(result.success){
             
           showToast('Login succesfully Redirecting!' , 'success');
           setTimeout(() => {
        window.location.href = "/employee/dashboard";
                }, 1500); 
          }

      
  

    } catch (error) {
      console.error("Login error:", error);
      if(error.response.status === 403){
             return showToast(`${error.response.data.message}` , "error");
             }
      showToast(`${error.response.data.message}` || "Invalid Employee ID. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#EEF2F7] font-[Inter]">
      <Navbar />

      {/* TOAST */}
      {toast.show && (
        <div
          className={`fixed top-20 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
            toast.type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="pt-12 min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[720px]">

          {/* LEFT FORM */}
          <div className="p-12 flex flex-col justify-center">

            <h2 className="text-3xl font-bold text-blue-900 mb-3">
              Employee Portal
            </h2>
            <p className="text-sm text-slate-500 mb-10">
              Securely access your dashboard using your credentials.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Employee ID */}
              <label className="block mb-6">
                <span className="text-sm font-semibold text-blue-900">
                  Employee ID
                </span>
                <div className="relative mt-3">
                  <User className="absolute left-4 top-4 text-blue-400" />
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="Ex: EMP-001"
                    className="w-full h-14 pl-12 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                {errors.employeeId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.employeeId}
                  </p>
                )}
              </label>

              {/* Email */}
              <label className="block mb-6">
                <span className="text-sm font-semibold text-blue-900">
                  Email
                </span>
                <div className="relative mt-3">
                  <Mail className="absolute left-4 top-4 text-blue-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="employee@email.com"
                    className="w-full h-14 pl-12 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </label>

              {/* Password */}
              <label className="block">
                <span className="text-sm font-semibold text-blue-900">
                  Password
                </span>
                <div className="relative mt-3">
                  <Lock className="absolute left-4 top-4 text-blue-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full h-14 pl-12 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </label>

              {/* 🔹 FORGOT PASSWORD */}
              <div className="flex justify-end mt-3 mb-8">
                <a
                  href="/employee/forgot-password"
                  className="text-sm text-blue-700 font-medium hover:text-blue-900 hover:underline transition"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-blue-800 hover:bg-blue-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                {isLoading ? "Authenticating..." : "Secure Login"}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="text-xs text-slate-400 flex justify-center items-center gap-1 mt-10">
              <Lock size={14} />
              Protected by Enterprise Grade Security
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden md:flex items-center justify-center bg-blue-50 p-10">
            <img
              src={sideImage}
              alt="Employee Login"
              className="w-full h-full max-w-lg object-contain scale-110"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
