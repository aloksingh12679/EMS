import { useEffect, useState, useRef } from "react";
import { Camera, X, Edit, Save, Eye, EyeOff } from "lucide-react";
import AdminSidebar from "../../Components/AdminSidebar";
import { employeeService } from "../../services/employeeServices";
import { 
  MdPerson, 
  MdEmail, 
  MdBadge, 
  MdCalendarToday,
  MdAccessTime,
  MdKey,
  MdCheckCircle,
  MdClose
} from "react-icons/md";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    position: "",
    AccessKey: "",
    address: ""
  });

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      setIsLoading(true);
      const response = await employeeService.getProfile();
      console.log(response);
      
      if (response.success) {
        setProfile(response.data);
        setEditData({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          email: response.data.email || "",
          contactNumber: response.data.contactNumber || "",
          position: response.data.position || "",
          AccessKey: response.data.AccessKey || "",
          address: response.data.address || ""
        });
        
        if (response.data.profilePhoto?.url) {
          setProfilePhotoPreview(response.data.profilePhoto.url);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      showToast("Failed to load profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Please select an image file", "error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast("File size should be less than 5MB", "error");
        return;
      }

      setProfilePhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhotoFile(null);
    setProfilePhotoPreview(profile?.profilePhoto?.url || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - reset data
      setEditData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        contactNumber: profile.contactNumber || "",
        position: profile.position || "",
        AccessKey: profile.AccessKey || "",
        address: profile.address || ""
      });
      setProfilePhotoFile(null);
      setProfilePhotoPreview(profile?.profilePhoto?.url || null);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Prepare form data
      const formDataToSend = new FormData();
      
      // Add profile photo if changed
      if (profilePhotoFile) {
        formDataToSend.append("profilePhoto", profilePhotoFile);
      }

     
      Object.keys(editData).forEach((key) => {
        formDataToSend.append(key, editData[key]);
      });

      const response = await employeeService.updateProfile(formDataToSend);

      if (response.success) {
        showToast("Profile updated successfully!", "success");
        setIsEditing(false);
        fetchMe(); // Refresh profile data
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(error.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg animate-slideIn ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white max-w-md`}
        >
          <div className="flex-1 font-medium">{toast.message}</div>
          <button
            onClick={() => setToast({ show: false, message: "", type: "" })}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex-1 w-full min-w-0 lg:ml-64">
          <div className="p-4 pt-16 md:p-6 md:pt-6 lg:p-8 lg:pt-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    My Profile
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your account information
                  </p>
                </div>

                <button
                  onClick={isEditing ? handleEditToggle : handleEditToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isEditing
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X size={18} />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit size={18} />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Profile Photo */}
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-white flex items-center justify-center ring-4 ring-white/30">
                        {profilePhotoPreview ? (
                          <img
                            src={profilePhotoPreview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl text-gray-400 font-bold">
                            {profile?.firstName?.charAt(0)}
                            {profile?.lastName?.charAt(0)}
                          </span>
                        )}
                      </div>

                      {isEditing && (
                        <>
                          {profilePhotoFile && (
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-md"
                            >
                              <X size={16} />
                            </button>
                          )}

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                            id="profilePhoto"
                          />
                          <label
                            htmlFor="profilePhoto"
                            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors shadow-md"
                          >
                            <Camera size={20} />
                          </label>
                        </>
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center sm:text-left text-white">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        {profile?.firstName} {profile?.lastName}
                      </h2>
                      <p className="text-blue-100 mt-1 text-lg">
                        {profile?.position}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                          {profile?.role}
                        </span>
                        {profile?.isActive && (
                          <span className="px-3 py-1 bg-green-500/90 rounded-full text-sm font-medium flex items-center gap-1">
                            <MdCheckCircle size={16} />
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MdPerson className="text-blue-600" size={18} />
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.firstName}
                          onChange={(e) =>
                            setEditData({ ...editData, firstName: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="First name"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                          {profile?.firstName || "Not set"}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MdPerson className="text-blue-600" size={18} />
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.lastName}
                          onChange={(e) =>
                            setEditData({ ...editData, lastName: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Last name"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                          {profile?.lastName || "Not set"}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MdEmail className="text-blue-600" size={18} />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Email address"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium px-4 py-2 bg-gray-50 rounded-lg break-all">
                          {profile?.email || "Not set"}
                        </p>
                      )}
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MdBadge className="text-blue-600" size={18} />
                        Contact Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editData.contactNumber}
                          onChange={(e) =>
                            setEditData({ ...editData, contactNumber: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Contact number"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                          {profile?.contactNumber || "Not set"}
                        </p>
                      )}
                    </div>

                    {/* Position */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MdBadge className="text-blue-600" size={18} />
                        Position
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.position}
                          onChange={(e) =>
                            setEditData({ ...editData, position: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Position"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                          {profile?.position || "Not set"}
                        </p>
                      )}
                    </div>

                    {/* Role */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MdBadge className="text-blue-600" size={18} />
                        Role
                      </label>
                      <p className="text-gray-900 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                        {profile?.role || "Not set"}
                      </p>
                    </div>

                    {/* Access Key */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MdKey className="text-blue-600" size={18} />
                        Access Key
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            type={showAccessKey ? "text" : "password"}
                            value={editData.AccessKey}
                            onChange={(e) =>
                              setEditData({ ...editData, AccessKey: e.target.value })
                            }
                            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Access key"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAccessKey(!showAccessKey)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showAccessKey ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <p className="text-gray-900 font-medium px-4 py-2 bg-gray-50 rounded-lg font-mono">
                            {showAccessKey
                              ? profile?.AccessKey || "Not set"
                              : "••••••••••••"}
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowAccessKey(!showAccessKey)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showAccessKey ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MdBadge className="text-blue-600" size={18} />
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editData.address}
                          onChange={(e) =>
                            setEditData({ ...editData, address: e.target.value })
                          }
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                          placeholder="Address"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium px-4 py-2 bg-gray-50 rounded-lg min-h-[80px]">
                          {profile?.address || "Not set"}
                        </p>
                      )}
                    </div>

                    {/* Joining Date */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MdCalendarToday className="text-blue-600" size={18} />
                        Joining Date
                      </label>
                      <p className="text-gray-900 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                        {formatDate(profile?.joiningDate)}
                      </p>
                    </div>

                    {/* Last Login */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MdAccessTime className="text-blue-600" size={18} />
                        Last Login
                      </label>
                      <p className="text-gray-900 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                        {formatDateTime(profile?.lastLogin)}
                      </p>
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
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