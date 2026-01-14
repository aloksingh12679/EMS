import { useEffect, useState } from "react";
import EmployeesSidebar from "../../Components/EmployeesSidebar";
import { employeeService } from "../../services/employeeServices";

export default function MyProfile() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const result = await employeeService.getProfile();
            if (result.success) {
                setProfileData(result.data);
            }
        } catch (err) {
            console.log("fetch profile err", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Loading State
    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <EmployeesSidebar />
                <div className="flex-1 flex items-center justify-center ml-0 lg:ml-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    // No Data State
    if (!profileData) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <EmployeesSidebar />
                <div className="flex-1 flex items-center justify-center ml-0 lg:ml-64">
                    <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md border border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Profile Unavailable</h3>
                        <p className="text-gray-600">Unable to load profile information</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <EmployeesSidebar />
            
            <div className="flex-1 w-full ml-0 lg:ml-64">
                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-600 mt-2">View and manage your personal and professional information</p>
                    </div>

                    {/* Profile Header Card */}
                    <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-xl shadow-xl mb-8 overflow-hidden">
                        <div className="p-8">
                            <div className="flex flex-col lg:flex-row items-start gap-8">
                                {/* Profile Avatar */}
                                <div className="relative">
                                    <div className="w-36 h-36 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                                        {profileData.profilePhoto?.url ? (
                                            <img 
                                                src={profileData.profilePhoto.url} 
                                                alt={`${profileData.firstName} ${profileData.lastName}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-4xl font-bold">
                                                {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    {/* Online Status */}
                                    <div className="absolute bottom-2 right-2 w-7 h-7 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                                </div>
                                
                                {/* Profile Info */}
                                <div className="flex-1 text-left">
                                    <div className="mb-6">
                                        <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                                            {profileData.firstName} {profileData.lastName}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg font-semibold text-white shadow-lg">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                {profileData.position}
                                            </span>
                                            <span className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg font-semibold text-white shadow-lg">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                                ID: {profileData.employeeId}
                                            </span>
                                            <span className="px-4 py-2 bg-green-500 border border-green-400 rounded-lg font-bold text-white shadow-lg">
                                                {profileData.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Stats Bar */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all shadow-lg">
                                            <p className="text-3xl font-bold text-white">{profileData.leaveBalance?.annual || 0}</p>
                                            <p className="text-white/90 text-sm font-medium mt-2">Annual Leave</p>
                                        </div>
                                        <div className="text-center p-5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all shadow-lg">
                                            <p className="text-3xl font-bold text-white">{profileData.leaveBalance?.sick || 0}</p>
                                            <p className="text-white/90 text-sm font-medium mt-2">Sick Leave</p>
                                        </div>
                                        <div className="text-center p-5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all shadow-lg">
                                            <p className="text-3xl font-bold text-white">{profileData.leaveBalance?.personal || 0}</p>
                                            <p className="text-white/90 text-sm font-medium mt-2">Personal Leave</p>
                                        </div>
                                        <div className="text-center p-5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all shadow-lg">
                                            <p className="text-3xl font-bold text-white">
                                                {(profileData.leaveBalance?.annual || 0) + 
                                                 (profileData.leaveBalance?.sick || 0) + 
                                                 (profileData.leaveBalance?.personal || 0)}
                                            </p>
                                            <p className="text-white/90 text-sm font-medium mt-2">Total Leave</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Contact Information Card */}
                            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <span className="p-3 bg-gray-100 rounded-lg">
                                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                        </span>
                                        Contact Information
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">Work Email</label>
                                            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-300">
                                                <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                                <span className="text-gray-900 font-medium break-all">{profileData.personalEmail}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">Personal Email</label>
                                            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-300">
                                                <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                                <span className="text-gray-900 font-medium break-all">{profileData.personalEmail}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">Phone Number</label>
                                            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-300">
                                                <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                </svg>
                                                <span className="text-gray-900 font-medium">{profileData.contactNumber || 'Not provided'}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">Work Location</label>
                                            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-300">
                                                <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-gray-900 font-medium">{profileData.address || 'Office'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Employment Details Card */}
                            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
                                    <span className="p-3 bg-gray-100 rounded-lg">
                                        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                        </svg>
                                    </span>
                                    Employment Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">Department</label>
                                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                                                <p className="text-gray-900 font-medium">{profileData.department?.name || 'Not assigned'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">Date of Joining</label>
                                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                                                <p className="text-gray-900 font-medium">{formatDate(profileData.joiningDate)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">Reporting Manager</label>
                                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                                                <p className="text-gray-900 font-medium">{profileData.reportingManager || 'Not assigned'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">Contract Type</label>
                                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                                                <p className="text-gray-900 font-medium capitalize">{profileData.jobType}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information Card */}
                            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
                                    <span className="p-3 bg-gray-100 rounded-lg">
                                        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">First Name</label>
                                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                                                <p className="text-gray-900 font-medium">{profileData.firstName}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">Date of Birth</label>
                                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                                                <p className="text-gray-900 font-medium">{formatDate(profileData.dob)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">Last Name</label>
                                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                                                <p className="text-gray-900 font-medium">{profileData.lastName}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">Gender</label>
                                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                                                <p className="text-gray-900 font-medium capitalize">{profileData.gender}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Side Cards */}
                        <div className="space-y-8">
                            {/* Account Status Card */}
                            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-xl shadow-xl p-6 text-white">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/80 font-medium">Account Status</p>
                                        <p className="text-3xl font-bold capitalize drop-shadow-lg">{profileData.status}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 border-t border-white/20 pt-4">
                                    <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                        <span className="text-sm text-white/90 font-medium">Active Since</span>
                                        <span className="font-bold text-white">{formatDate(profileData.joiningDate)}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                        <span className="text-sm text-white/90 font-medium">Last Login</span>
                                        <span className="font-bold text-white">Today</span>
                                    </div>
                                </div>
                            </div>

                            {/* Department Card */}
                            {profileData.department && (
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900">Department</h3>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                                        <p className="text-lg font-bold text-gray-900 mb-2">{profileData.department.name}</p>
                                        <p className="text-sm text-gray-600">{profileData.department.description || 'No description available'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}