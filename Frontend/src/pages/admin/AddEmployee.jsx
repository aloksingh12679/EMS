import { useState } from "react";
import AdminSidebar from "../../Components/AdminSidebar";
import { MdPerson, MdBadge, MdAttachMoney, MdCheckCircle, MdEmail, MdPersonAdd, MdClose, MdAccountBalance } from "react-icons/md";
import {employeeService} from '../../services/employeeServices.js';
import { emailService } from "../../services/emailServices.js";
import { useEffect } from "react";

export default function AddEmployee() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [employeeId, setEmployeeId] = useState("");
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [photoUploadError, setPhotoUploadError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
   const [departmentNames, setDepartmentNames] = useState([]);

useEffect(() => {
  fetchDepartmentsName();
}, []);

const fetchDepartmentsName = async () => {
  const result = await employeeService.getDepartmentTasks();
  console.log(result);
  setDepartmentNames(result?.data?.departmentDetails || []);
};
    
    const [formData, setFormData] = useState({
        // Step 1 - Personal
        firstName: "",
        lastName: "",
        personalEmail: "",
        contactNumber: "",
        dob: "",
        gender: "",
        address: "",
        // Step 2 - Job Details
        department: "",
        jobType: "",
        position: "",
        joiningDate: "",
        // Step 3 - Salary Info
        baseSalary: "",
        taxApply: "",
        allowances: "",
        deductions: "",
        // Step 4 - Bank Details
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        branchName: ""
    });

    const steps = [
        { number: 1, label: "Personal", icon: <MdPerson /> },
        { number: 2, label: "Job Details", icon: <MdBadge /> },
        { number: 3, label: "Salary Info", icon: <MdAttachMoney /> },
        { number: 4, label: "Bank Details", icon: <MdAccountBalance /> },
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showToast('Please select an image file', 'error');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showToast('File size should be less than 5MB', 'error');
                return;
            }

            setProfilePhoto(file);
            setPhotoUploadError("");

            // Create preview only - no upload yet
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const showToast = (message, type = "error") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "" });
        }, 3000);
    };

    const validateStep = (step) => {
        if (step === 1) {
            if (!formData.firstName.trim()) {
                showToast("Please enter first name");
                return false;
            }
            if (!formData.lastName.trim()) {
                showToast("Please enter last name");
                return false;
            }
            if (!formData.personalEmail.trim()) {
                showToast("Please enter email address");
                return false;
            }
            if (!/\S+@\S+\.\S+/.test(formData.personalEmail)) {
                showToast("Please enter a valid email address");
                return false;
            }
            if (!formData.contactNumber.trim()) {
                showToast("Please enter phone number");
                return false;
            }
            if (!formData.gender) {
                showToast("Please select gender");
                return false;
            }
        } else if (step === 2) {
            if (!formData.department) {
                showToast("Please select department");
                return false;
            }
            if (!formData.position.trim()) {
                showToast("Please enter position");
                return false;
            }
            if (!formData.jobType) {
                showToast("Please select job type");
                return false;
            }
            if (!formData.joiningDate) {
                showToast("Please select joining date");
                return false;
            }
        } else if (step === 3) {
            if (!formData.baseSalary || parseFloat(formData.baseSalary) <= 0) {
                showToast("Please enter a valid base salary");
                return false;
            }
            if (!formData.taxApply || parseFloat(formData.taxApply) < 0) {
                showToast("Please enter a valid tax percentage");
                return false;
            }
        } else if (step === 4) {
          
            if (formData.accountNumber.trim() && !formData.ifscCode.trim()) {
                showToast("Please enter IFSC code");
                return false;
            }
            // Validate IFSC code format if provided
            if (formData.ifscCode.trim() && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) {
                showToast("Please enter a valid IFSC code (e.g., SBIN0001234)");
                return false;
            }
        }
        return true;
    };

    const handleNextStep = () => {
        if (validateStep(currentStep)) {
            if (currentStep < 4) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (validateStep(4)) {
            setIsSubmitting(true);
            if (profilePhoto) {
                setIsUploadingPhoto(true);
            }
            
            try {
                const data = new FormData();
        
                // Append all text fields
                data.append('firstName', formData.firstName);
                data.append('lastName', formData.lastName);
                data.append('personalEmail', formData.personalEmail);
                data.append('contactNumber', formData.contactNumber);
                data.append('dob', formData.dob);
                data.append('gender', formData.gender);
                data.append('address', formData.address);
                data.append('department', formData.department);
                data.append('jobType', formData.jobType);
                data.append('position', formData.position);
                data.append('joiningDate', formData.joiningDate);
                data.append('baseSalary', formData.baseSalary);
                data.append('taxApply', formData.taxApply);
                data.append('allowances', formData.allowances);
                data.append('deductions', formData.deductions);
        
                // Append bank details (only if provided)
                if (formData.accountHolderName) data.append('accountHolderName', formData.accountHolderName);
                if (formData.accountNumber) data.append('accountNumber', formData.accountNumber);
                if (formData.ifscCode) data.append('ifscCode', formData.ifscCode.toUpperCase());
                if (formData.bankName) data.append('bankName', formData.bankName);
                if (formData.branchName) data.append('branchName', formData.branchName);

                const baseSalary = parseFloat(formData.baseSalary) || 0;
                const allowances = parseFloat(formData.allowances) || 0;
                const deductions = parseFloat(formData.deductions) || 0;
                const taxApply = parseFloat(formData.taxApply) || 0;

                const netSalary = (
                    baseSalary + 
                    allowances - 
                    deductions -
                    (baseSalary * taxApply / 100)
                ).toFixed(2);

                data.append('netSalary', netSalary);

                if (profilePhoto) {
                    data.append('profilePhoto', profilePhoto);
                }

                const result = await employeeService.addEmployee(data);
                
                setIsUploadingPhoto(false);
                setIsSubmitting(false);
                
                if (result.success) {
                    setEmployeeId(result.data.employeeId);
                    setIsSubmitted(true);
                    showToast(result.message, 'success');
                }
               
            } catch(err) {
                setIsUploadingPhoto(false);
                setIsSubmitting(false);
                
                if (err.message === 'Network Error' || !err.response) {
                    setPhotoUploadError("Network connection weak. Please try again.");
                    showToast('Upload failed. Network connection weak. Please check your internet.', 'error');
                } else {
                    showToast(err.response?.data?.message || err.message || 'Failed to add employee', 'error');
                }
            }
        }
    };

    const handleEmailEmployee = async() => {
        setIsSendingEmail(true);
        
        try {
            const response = await emailService.registraionEmail(formData, employeeId);
            
            if (response && response.success) {
                showToast(`Email sent successfully to ${formData.personalEmail}`, "success");
            }
        } catch(err) {
            console.log("email sending error", err);
            showToast(
                err.response?.data?.message || "Failed to send email. Please try again.", 
                "error"
            );
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleAddAnother = () => {
        setFormData({
            firstName: "",
            lastName: "",
            personalEmail: "",
            contactNumber: "",
            dob: "",
            gender: "",
            address: "",
            department: "",
            jobType: "",
            position: "",
            joiningDate: "",
            baseSalary: "",
            taxApply: "",
            allowances: "",
            deductions: "",
            accountHolderName: "",
            accountNumber: "",
            ifscCode: "",
            bankName: "",
            branchName: ""
        });
        setProfilePhoto(null);
        setProfilePhotoPreview(null);
        setCurrentStep(1);
        setIsSubmitted(false);
        setEmployeeId("");
    };

    const handleCancel = () => {
        setFormData({
            firstName: "",
            lastName: "",
            personalEmail: "",
            contactNumber: "",
            dob: "",
            gender: "",
            address: "",
            department: "",
            jobType: "",
            position: "",
            joiningDate: "",
            baseSalary: "",
            taxApply: "",
            allowances: "",
            deductions: "",
            accountHolderName: "",
            accountNumber: "",
            ifscCode: "",
            bankName: "",
            branchName: ""
        });
        setProfilePhoto(null);
        setProfilePhotoPreview(null);
        setCurrentStep(1);
    };

    return (
        <>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg animate-slideLeft ${
                    toast.type === "error" 
                        ? "bg-red-500 text-white" 
                        : "bg-green-500 text-white"
                } max-w-xs sm:max-w-md w-full sm:w-auto`}>
                    <div className="flex-1 text-sm sm:text-base font-medium">
                        {toast.message}
                    </div>
                    <button 
                        onClick={() => setToast({ show: false, message: "", type: "" })}
                        className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                        <MdClose size={20} />
                    </button>
                </div>
            )}

            <style>{`
                @keyframes slideLeft {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-slideLeft {
                    animation: slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>

            {/* Email Sending Loading Overlay */}
            {isSendingEmail && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex flex-col items-center gap-5">
                            <div className="relative">
                                <MdEmail className="text-blue-500 animate-pulse" size={64} />
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Sending Email...
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Please wait, sending registration email to
                                </p>
                                <p className="text-blue-600 font-medium text-sm mt-1">
                                    {formData.personalEmail}
                                </p>
                            </div>
                            
                            <div className="flex gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Submitting Loading Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {isUploadingPhoto ? 'Uploading Photo...' : 'Submitting Employee Data...'}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Please wait, this may take a moment
                        </p>
                    </div>
                </div>
            )}

            <div>
                <AdminSidebar />
                <main className="min-h-screen bg-gray-50 lg:ml-64 p-4 sm:p-6 lg:p-8 transition-all duration-300">
                    <div className="max-w-6xl mx-auto mt-16 sm:mt-0">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Employee</h1>
                                    <p className="text-sm text-gray-500 mt-1">Fill in the information below to register a new employee.</p>
                                </div>
                            </div>
                        </div>

                        {/* Step Progress */}
                        {!isSubmitted && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 overflow-x-auto">
                                <div className="flex items-center justify-between min-w-max sm:min-w-0">
                                    {steps.map((step, index) => (
                                        <div key={step.number} className="flex items-center flex-1">
                                            <button
                                                onClick={() => setCurrentStep(step.number)}
                                                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
                                                    currentStep === step.number
                                                        ? "bg-gray-900 text-white shadow-md"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                            >
                                                <span className="text-base sm:text-lg hidden sm:block">{step.icon}</span>
                                                <div className="text-left">
                                                    <p className="text-xs opacity-75">STEP {step.number}</p>
                                                    <p className="text-xs sm:text-sm font-medium">{step.label}</p>
                                                </div>
                                            </button>
                                            {index < steps.length - 1 && (
                                                <div className="flex-1 h-px bg-gray-200 mx-1 sm:mx-2 min-w-4"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {isSubmitted && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12">
                                <div className="text-center space-y-6">
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                            <MdCheckCircle className="text-green-600 text-5xl" />
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                            Employee Added Successfully!
                                        </h2>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            The new employee has been registered in the system.
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6 inline-block mx-auto">
                                        <p className="text-sm text-gray-600 mb-2">Employee ID</p>
                                        <p className="text-2xl font-bold text-blue-600">{employeeId}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3 max-w-md mx-auto">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Name:</span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {formData.firstName} {formData.lastName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Email:</span>
                                            <span className="text-sm font-semibold text-gray-900">{formData.personalEmail}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
   <span className="text-sm text-gray-600">position:</span>
                                            <span className="text-sm font-semibold text-gray-900 capitalize">{formData.position}</span>

 
</div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Department:</span>
                                            <span className="text-sm font-semibold text-gray-900 capitalize">{formData.department}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                                        <button
                                            onClick={handleEmailEmployee}
                                            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                                        >
                                            <MdEmail size={20} />
                                            Email Employee
                                        </button>
                                        <button
                                            onClick={handleAddAnother}
                                            className="px-6 py-3 text-sm font-medium text-gray-900 bg-white border-2 border-gray-900 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <MdPersonAdd size={20} />
                                            Add Another Employee
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 1 - Personal Details */}
                        {currentStep === 1 && !isSubmitted && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6">Personal Details</h2>
                                
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Profile Photo Upload */}
                                    <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200">
                                        <div className="relative">
                                            <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                                                {profilePhotoPreview ? (
                                                    <img 
                                                        src={profilePhotoPreview} 
                                                        alt="Profile Preview" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <MdPerson className="text-gray-400 text-6xl" />
                                                )}
                                            </div>
                                            <label 
                                                htmlFor="profilePhoto" 
                                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </label>
                                            <input
                                                type="file"
                                                id="profilePhoto"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-900">Profile Photo</p>
                                            <p className="text-xs text-gray-500 mt-1">Click the camera icon to upload</p>
                                        </div>
                                    </div>

                                    {/* First Name & Last Name */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                First Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                placeholder="Enter first name"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Enter last name"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Personal Email <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                                                <input
                                                    type="email"
                                                    name="personalEmail"
                                                    value={formData.personalEmail}
                                                    onChange={handleInputChange}
                                                    placeholder="email@example.com"
                                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📞</span>
                                                <input
                                                    type="tel"
                                                    name="contactNumber"
                                                    value={formData.contactNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date of Birth & Gender */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Gender
                                            </label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-600"
                                            >
                                                <option value="">Select gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Residential Address
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Enter full address (city , state , country , pincode)"
                                            rows="3"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 sm:mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={handleCancel}
                                        className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleNextStep}
                                        className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Next Step
                                        <span>→</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2 - Job Details */}
                        {currentStep === 2 && !isSubmitted && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6">Job Details</h2>
                                
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Department & Position */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
  <label className="block text-sm font-medium text-gray-900 mb-2">
    Department Name <span className="text-red-500">*</span>
  </label>

  <select
    name="department"
    value={formData.department}
    onChange={handleInputChange}
    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-600"
  >
    <option value="">Select department</option>

    {departmentNames.map((dept) => (
      <option key={dept._id} value={dept.name}>
        {dept.name}
      </option>
    ))}
  </select>
</div>
                                        <div>
                                           <label className="block text-sm font-medium text-gray-900 mb-2">
    Position <span className="text-red-500">*</span>
  </label>

  <select
    name="position"
    value={formData.position}
    onChange={handleInputChange}
    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700"
  >
    <option value="">Select position</option>
    <option value="Frontend Developer">Frontend Developer</option>
    <option value="Backend Developer">Backend Developer</option>
    <option value="Full Stack Developer">Full Stack Developer</option>
    <option value="Team Leader">Team Leader</option>
    <option value="UI/UX Designer">UI/UX Designer</option>
    <option value="Quality Analyst">Quality Analyst</option>
    <option value="DevOps Engineer">DevOps Engineer</option>
    <option value="Software Tester">Software Tester</option>
    <option value="Project Manager">Project Manager</option>
  </select>
                                        </div>
                                    </div>

                                    {/* Job Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-3">
                                            Job Type <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <label className={`flex items-center justify-center gap-3 px-4 py-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                formData.jobType === "full-time" 
                                                    ? "border-blue-500 bg-blue-50" 
                                                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="jobType"
                                                    value="full-time"
                                                    checked={formData.jobType === "full-time"}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className="text-sm font-medium text-gray-900">Full-Time</span>
                                            </label>
                                            <label className={`flex items-center justify-center gap-3 px-4 py-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                formData.jobType === "part-time" 
                                                    ? "border-blue-500 bg-blue-50" 
                                                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="jobType"
                                                    value="part-time"
                                                    checked={formData.jobType === "part-time"}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className="text-sm font-medium text-gray-900">Part-Time</span>
                                            </label>
                                            <label className={`flex items-center justify-center gap-3 px-4 py-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                formData.jobType === "intern" 
                                                    ? "border-blue-500 bg-blue-50" 
                                                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="jobType"
                                                    value="intern"
                                                    checked={formData.jobType === "intern"}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className="text-sm font-medium text-gray-900">Intern</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Joining Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Joining Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="joiningDate"
                                            value={formData.joiningDate}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 sm:mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={handlePreviousStep}
                                        className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span>←</span>
                                        Previous
                                    </button>
                                    <button
                                        onClick={handleNextStep}
                                        className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Next Step
                                        <span>→</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3 - Salary Info */}
                        {currentStep === 3 && !isSubmitted && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6">Salary Information</h2>
                                
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Base Salary & Tax Apply */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Base Salary <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                                <input
                                                    type="number"
                                                    name="baseSalary"
                                                    value={formData.baseSalary}
                                                    onChange={handleInputChange}
                                                    placeholder="50000"
                                                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Tax Apply (%) <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="taxApply"
                                                    value={formData.taxApply}
                                                    onChange={handleInputChange}
                                                    placeholder="10"
                                                    className="w-full px-4 pr-9 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Allowances & Deductions */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Allowances
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                                <input
                                                    type="number"
                                                    name="allowances"
                                                    value={formData.allowances}
                                                    onChange={handleInputChange}
                                                    placeholder="5000"
                                                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Deductions
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                                <input
                                                    type="number"
                                                    name="deductions"
                                                    value={formData.deductions}
                                                    onChange={handleInputChange}
                                                    placeholder="2000"
                                                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Salary Summary Card */}
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Salary Summary</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Base Salary:</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    ${formData.baseSalary || "0"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Allowances:</span>
                                                <span className="text-sm font-semibold text-green-600">
                                                    +${formData.allowances || "0"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Deductions:</span>
                                                <span className="text-sm font-semibold text-red-600">
                                                    -${formData.deductions || "0"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Tax ({formData.taxApply || "0"}%):</span>
                                                <span className="text-sm font-semibold text-red-600">
                                                    -${((parseFloat(formData.baseSalary) || 0) * (parseFloat(formData.taxApply) || 0) / 100).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="pt-3 border-t-2 border-blue-300">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-base font-bold text-gray-900">Net Salary:</span>
                                                    <span className="text-lg font-bold text-blue-600">
                                                        ${(
                                                            (parseFloat(formData.baseSalary) || 0) +
                                                            (parseFloat(formData.allowances) || 0) -
                                                            (parseFloat(formData.deductions) || 0) -
                                                            ((parseFloat(formData.baseSalary) || 0) * (parseFloat(formData.taxApply) || 0) / 100)
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 sm:mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={handlePreviousStep}
                                        className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span>←</span>
                                        Previous
                                    </button>
                                    <button
                                        onClick={handleNextStep}
                                        className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Next Step
                                        <span>→</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 4 - Bank Details */}
                        {currentStep === 4 && !isSubmitted && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-2">Bank Details</h2>
                                <p className="text-sm text-gray-500 mb-4 sm:mb-6">Bank details are optional but recommended for salary processing</p>
                                
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Account Holder Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Account Holder Name
                                        </label>
                                        <input
                                            type="text"
                                            name="accountHolderName"
                                            value={formData.accountHolderName}
                                            onChange={handleInputChange}
                                            placeholder="Enter account holder name"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>

                                    {/* Account Number & IFSC Code */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Account Number
                                            </label>
                                            <input
                                                type="text"
                                                name="accountNumber"
                                                value={formData.accountNumber}
                                                onChange={handleInputChange}
                                                placeholder="Enter account number"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                IFSC Code
                                            </label>
                                            <input
                                                type="text"
                                                name="ifscCode"
                                                value={formData.ifscCode}
                                                onChange={handleInputChange}
                                                placeholder="e.g., SBIN0001234"
                                                maxLength="11"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm uppercase"
                                            />
                                        </div>
                                    </div>

                                    {/* Bank Name & Branch Name */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Bank Name
                                            </label>
                                            <input
                                                type="text"
                                                name="bankName"
                                                value={formData.bankName}
                                                onChange={handleInputChange}
                                                placeholder="e.g., State Bank of India"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Branch Name
                                            </label>
                                            <input
                                                type="text"
                                                name="branchName"
                                                value={formData.branchName}
                                                onChange={handleInputChange}
                                                placeholder="Enter branch name"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Info Box */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                                        <MdAccountBalance className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-blue-900 mb-1">Why we need this?</p>
                                            <p className="text-xs text-blue-700">
                                                Bank details are required for salary processing and direct deposit. You can add or update these details later from the employee profile.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 sm:mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={handlePreviousStep}
                                        className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span>←</span>
                                        Previous
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className={`w-full sm:w-auto px-8 py-3 text-sm font-medium text-white rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md ${
                                            isSubmitting 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                {isUploadingPhoto ? 'Uploading Photo...' : 'Submitting...'}
                                            </>
                                        ) : (
                                            <>
                                                Submit Employee
                                                <span>✓</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <style>{`
                        @keyframes slideLeft {
                            from {
                                opacity: 0;
                                transform: translateX(100%);
                            }
                            to {
                                opacity: 1;
                                transform: translateX(0);
                            }
                        }
                        .animate-slideLeft {
                            animation: slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        }
                        @keyframes spin {
                            to {
                                transform: rotate(360deg);
                            }
                        }
                        .animate-spin {
                            animation: spin 1s linear infinite;
                        }
                        @keyframes bounce {
                            0%, 100% {
                                transform: translateY(0);
                            }
                            50% {
                                transform: translateY(-10px);
                            }
                        }
                        .animate-bounce {
                            animation: bounce 1s infinite;
                        }
                        @keyframes pulse {
                            0%, 100% {
                                opacity: 1;
                            }
                            50% {
                                opacity: 0.5;
                            }
                        }
                        .animate-pulse {
                            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                        }
                    `}</style>
                </main>
            </div>
        </>
    );
}