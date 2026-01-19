import React, { useEffect, useState } from "react";
import {
  Bell,
  HelpCircle,
  Edit3,
  MoreVertical,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  X,
} from "lucide-react";
import "../../assets/styles/EmployeeProfileCSS/EmployeeProfile.css";
import AdminSidebar from "../../Components/AdminSidebar";
import { employeeService } from "../../services/employeeServices";
import { useParams, useNavigate } from "react-router-dom";
import { capitalize } from "../../utils/helper";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeProfile() {
  const { id } = useParams();
  const { user } = useAuth();

  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [activeTab, setActiveTab] = useState("personal-info");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [salaryData, setSalaryData] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [profile, setProfile] = useState({});
  const [owner, setOwner] = useState();
  const [tasksData, setTasksData] = useState([]);
  const [leavesData, setLeavesData] = useState();

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };
  const [taskForm, setTaskForm] = useState({
    taskName: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setOwner(user.firstName + " " + user.lastName);

        const result = await employeeService.getDetailsbyId(id);

        console.log("result", result);

        const employeeDetail = {
          name: `${result.data.firstName} ${result.data.lastName}`,
          contactNumber: result.data.contactNumber,
          address: result.data.address,
          employeeId: result.data.employeeId,
          status: result.data.status,
          gender: result.data.gender,
          personalEmail: result.data.personalEmail,
          department: result.data.department.name,
          profilePhoto: result.data.profilePhoto,
          dob: new Date(result.data.dob).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          joiningDate: result.data.joiningDate,
          jobType: result.data.jobType,
          reportingManager: result.data.reportingManager,
          position: result.data.position,
        };
        setProfile(employeeDetail);

        setTasksData(result.tasks);

        setSalaryData(result.Salaries);
        setLeavesData(result.leaves);

        console.log(salaryData);
      } catch (err) {
        console.log("error", err);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      const result = await employeeService.deleteEmployee(
        id,
        deletePassword,
        showDeleteModal,
        profile?.status,
      );
      if (result.success) {
        console.log(result);
        showToast(result.message, "success");
        setTimeout(() => {
          navigate(`/admin/employees`);
        }, 1500);
      }
    } catch (err) {
      const { response } = err;
      console.log("delete user error ", err);
      showToast(response.data.message);
    }

    setShowDeleteModal(false);
    setDeletePassword("");
  };

  // Sample data
  const attendanceData = [
    {
      month: "January 2025",
      workingDays: 22,
      present: 21,
      absent: 1,
      onLeave: 2,
    },
    {
      month: "December 2024",
      workingDays: 21,
      present: 20,
      absent: 0,
      onLeave: 1,
    },
    {
      month: "November 2024",
      workingDays: 22,
      present: 22,
      absent: 0,
      onLeave: 0,
    },
  ];

  // const leavesData = [
  //   { id: 1, period: 'Jan 15 - Jan 17, 2025', type: 'Sick Leave', status: 'Approved', reason: 'Medical emergency' },
  //   { id: 2, period: 'Dec 24 - Dec 26, 2024', type: 'Casual Leave', status: 'Approved', reason: 'Personal work' },
  //   { id: 3, period: 'Nov 10 - Nov 11, 2024', type: 'Earned Leave', status: 'Rejected', reason: 'Family function' },
  // ];

  const getStatusColor = (Status) => {
    switch (Status.toLowerCase() || " ") {
      case "paid":
        return "#48bb78";
      case "processing":
        return "#ed8936";
      case "due":
        return "#f56565";
      default:
        return "#718096";
    }
  };

  const taskStatusColor = (status) => {
    switch (status?.toLowerCase() || " ") {
      case "completed":
        return "#10b981"; // green
      case "in progress":
        return "#3b82f6"; // blue
      case "pending":
        return "#f59e0b"; // amber
      default:
        return "#6b7280"; // gray
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "#f56565";
      case "medium":
        return "#ed8936";
      case "low":
        return "#48bb78";
      default:
        return "#718096";
    }
  };
  function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = now.getFullYear();

    return `${year}-${month}-${day}`;
  }
  const validateNewtaskForm = (newTask) => {
    console.log(newTask.dueDate + " " + getCurrentDate());
    const currentDate = getCurrentDate();
    if (newTask.dueDate < currentDate) {
      return false;
    }
    return true;
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const newTask = {
      id: tasksData.length + 1,
      ...taskForm,
    };

    try {
      if (validateNewtaskForm(newTask)) {
        const result = await employeeService.addTask(id, newTask);
        setTasksData([...tasksData, newTask]);
        showToast("New task Submitted", "success");

        console.log(result);
      } else {
        showToast("Enter valid Due date", "error");

        return;
      }
    } catch (err) {
      console.log("task err", err);
    }

    setShowTaskModal(false);
    setTaskForm({
      taskName: "",
      description: "",
      dueDate: "",
      priority: "Medium",
    });
  };

  const gettaskStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "#10b981"; // green
      case "in progress":
        return "#3b82f6"; // blue
      case "pending":
        return "#f59e0b"; // amber
      default:
        return "#6b7280"; // gray
    }
  };
  return (
    <>
      <div className="ems-container">
        <AdminSidebar />
        {toast.show && (
          <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg animate-slideLeft ${
              toast.type === "error"
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            } max-w-xs sm:max-w-md w-full sm:w-auto`}
          >
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
        {/* MAIN CONTENT */}
        <main className="main-content">
          {/* TOP HEADER */}
          <header className="top-header flex justify-end items-center">
            <h1 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">
              Employee Profile
            </h1>
          </header>

          {/* SCROLLABLE CONTENT */}
          <div className="scrollable-content">
            {/* PROFILE CARD */}
            <div className="profile-card">
              <div className="profile-avatar-section">
                <img
                  // src={profile?.profilePhoto?.url || "profilePhoto"}
                  src="../../../public/OIP.jpeg"
                  alt={profile?.name}
                  className="profile-img"
                />
                <div className="status-indicator"><i class="fa-regular fa-camera"></i></div>
              </div>

              <div className="profile-info">
                <h1 className="profile-name">{capitalize(profile?.name)}</h1>
                <div className="profile-meta">
                  <span className="job-title">
                    📋 {capitalize(profile?.position)}
                  </span>
                  <span className="emp-id">ID: {profile?.employeeId}</span>
                  <span className="status-badge">
                    {capitalize(profile?.status)}
                  </span>
                </div>
              </div>

              <div className="profile-actions">
                <Link to={`/admin/employees/${id}/edit`} className="edit-btn">
                  <Edit3 size={16} />
                  Edit Profile
                </Link>
                <button className="menu-btn">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* TABS */}
            <div className="tabs-wrapper">
              <div className="tabs">
                {[
                  "Personal Info",
                  "Attendance",
                  "Salary & Payroll",
                  "Leaves",
                  "Assigned Tasks",
                ].map((tab) => (
                  <button
                    key={tab}
                    className={`tab ${
                      activeTab === tab.toLowerCase().replace(/\s+/g, "-")
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveTab(tab.toLowerCase().replace(/\s+/g, "-"))
                    }
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* PERSONAL INFO TAB */}
            {activeTab === "personal-info" && (
              <>
                {/* FIRST ROW - CONTACT & QUICK STATS */}
                <div className="content-grid">
                  {/* LEFT: CONTACT INFORMATION */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Contact Information</h3>
                    </div>

                    <div className="contact-info-grid">
                      <div className="info-field">
                        <label className="info-label">Phone Number</label>
                        <div className="info-value">
                          <i className="fa-solid fa-phone"></i>
                          <span>{profile?.contactNumber}</span>
                        </div>
                      </div>

                      <div className="info-field">
                        <label className="info-label">Personal Email</label>
                        <div className="info-value">
                          <i className="fa-regular fa-envelope"></i>
                          <span>{profile?.personalEmail}</span>
                        </div>
                      </div>

                      <div className="info-field">
                        <label className="info-label">Work Location</label>
                        <div className="info-value">
                          <i className="fa-solid fa-location-dot"></i>
                          <span>Bangalore</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: QUICK STATS */}
                  <div className="card">
                    <h3 className="quick-stats-title">Quick Stats</h3>

                    <div className="stat-card">
                      <div className="stat-icon">📅</div>
                      <div className="stat-content">
                        <p className="stat-label">Attendance</p>
                        <p className="stat-value">98.5%</p>
                      </div>
                      <span className="stat-change">+2%</span>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">🏖️</div>
                      <div className="stat-content">
                        <p className="stat-label">Leave Balance</p>
                        <p className="stat-value">12 Days</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">⭐</div>
                      <div className="stat-content">
                        <p className="stat-label">Performance</p>
                        <p className="stat-value">4.8/5.0</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EMPLOYMENT DETAILS - FULL WIDTH */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Employment Details</h3>
                  </div>

                  <div className="details-grid">
                    <div className="detail-item">
                      <label className="detail-label">Department</label>
                      <p className="detail-value">{profile?.department}</p>
                    </div>

                    <div className="detail-item">
                      <label className="detail-label">Reporting Manager</label>
                      <div className="manager-card">
                        <div className="manager-avatar">
                          {profile.reportingManager
                            ? profile?.reportingManager.charAt(0).toUpperCase()
                            : "NA"}
                        </div>
                        <span className="detail-value">
                          {profile?.reportingManager}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <label className="detail-label">Date of Joining</label>
                      <p className="detail-value">
                        {new Date(profile.joiningDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <div className="detail-item">
                      <label className="detail-label">Contract Type</label>
                      <p className="detail-value">
                        {capitalize(profile?.jobType)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECOND ROW - PERSONAL INFO & ACCOUNT ACTIONS */}
                <div className="content-grid">
                  {/* LEFT: PERSONAL INFORMATION */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Personal Information</h3>
                    </div>

                    <div className="details-grid">
                      <div className="detail-item">
                        <label className="detail-label">Date of Birth</label>
                        <p className="detail-value">
                          <i className="fa-solid fa-cake-candles"></i> -{" "}
                          {profile?.dob || "no record"}
                        </p>
                      </div>

                      <div className="detail-item">
                        <label className="detail-label">Gender</label>
                        <p className="detail-value">
                          <i className="fa-regular fa-user"></i> -{" "}
                          {profile?.gender || "no record"}
                        </p>
                      </div>

                      <div
                        className="detail-item"
                        style={{ gridColumn: "1 / -1" }}
                      >
                        <label className="detail-label">Current Address</label>
                        <p className="detail-value">
                          <i className="fa-solid fa-location-dot"></i>
                          {profile?.address || "India"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: ACCOUNT ACTIONS & TEAM MEMBERS */}
                  <div className="card">
                    <h3 className="quick-stats-title">Account Actions</h3>

                    <div className="account-actions-section">
                      <div
                        className="action-item"
                        onClick={() => setShowDeleteModal(true)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="action-icon">🔐</div>
                        <div>Delete Employee</div>
                      </div>
                      {profile?.status === "active" ? (
                        <div
                          className="action-item danger"
                          onClick={handleDeleteUser}
                        >
                          <div className="action-icon">⛔</div>
                          <div>Deactivate Employee</div>
                        </div>
                      ) : (
                        <div
                          className="action-item active"
                          onClick={handleDeleteUser}
                          style={{ color: "green" }}
                        >
                          <div className="action-icon">✅</div>
                          <div>Activate Employee</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* DELETE USER MODAL */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                  <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">
                      Delete Employee
                    </h3>
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setDeletePassword("");
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <form onSubmit={handleDeleteUser} className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enter Your Password{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                        placeholder="Enter your password"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteModal(false);
                          setDeletePassword("");
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Delete User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ATTENDANCE TAB */}
            {activeTab === "attendance" && (
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Attendance Records
                  </h3>
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Total Working Days
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Total Present
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Total Absent
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          On Leave
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Attendance %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceData.map((record, idx) => {
                        const percentage = (
                          (record.present / record.workingDays) *
                          100
                        ).toFixed(1);
                        return (
                          <tr key={idx}>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="font-semibold text-gray-900">
                                {record.month}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                              {record.workingDays}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {record.present}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                {record.absent}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                {record.onLeave}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`font-bold ${
                                  parseFloat(percentage) >= 95
                                    ? "text-green-600"
                                    : "text-orange-600"
                                }`}
                              >
                                {percentage}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SALARY & PAYROLL TAB */}
            {activeTab === "salary-&-payroll" && (
              <div className="space-y-4">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">
                      Salary & Payroll
                    </h3>
                    <span className="text-sm text-gray-600">
                      {salaryData.length} records
                    </span>
                  </div>
                </div>

                {salaryData.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <DollarSign
                      size={32}
                      className="text-gray-400 mx-auto mb-2"
                    />
                    <p className="text-gray-900 font-semibold">
                      No Salary Records
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                              Month
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                              Basic
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                              Allow.
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                              Deduct.
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                              Tax %
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                              Net
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {salaryData.map((record) => (
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-semibold text-gray-900">
                                {record?.month || "N/A"} '26
                              </td>
                              <td className="px-4 py-3 text-right text-gray-700">
                                ₹{(record.baseSalary || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right text-green-600 font-medium">
                                +₹{(record.allowances || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right text-red-600 font-medium">
                                −₹{(record.deductions || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right text-amber-600 font-medium">
                                {record.taxApply || 0}%
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-blue-600">
                                ₹{(record.netSalary || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className="px-2 py-1 text-xs font-semibold rounded-md inline-block"
                                  style={{
                                    backgroundColor:
                                      getStatusColor(record.Status) + "15",
                                    color: getStatusColor(record.Status),
                                  }}
                                >
                                  {record.Status || "?"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile List View */}
                    <div className="md:hidden space-y-3">
                      {salaryData.map((record, idx) => (
                        <div
                          key={record.employee || idx}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-gray-900">
                                {record.month || "N/A"} 2026
                              </p>
                              <p className="text-lg font-bold text-blue-600 mt-1">
                                ₹{(record.netSalary || 0).toLocaleString()}
                              </p>
                            </div>
                            <span
                              className="px-2 py-1 text-xs font-semibold rounded-md"
                              style={{
                                backgroundColor:
                                  getStatusColor(record.Status) + "15",
                                color: getStatusColor(record.Status),
                              }}
                            >
                              {record.Status || "?"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Basic:</span>
                              <span className="font-semibold">
                                ₹{(record.baseSalary || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <span>Allow:</span>
                              <span className="font-semibold">
                                +₹{(record.allowances || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-red-600">
                              <span>Deduct:</span>
                              <span className="font-semibold">
                                −₹{(record.deductions || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-amber-600">
                              <span>Tax:</span>
                              <span className="font-semibold">
                                {record.taxApply || 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* LEAVES TAB */}
            {/* LEAVES TAB */}
            {activeTab === "leaves" && (
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Leave Records
                  </h3>
                  <FileText size={20} className="text-blue-600" />
                </div>

                {leavesData && leavesData.length > 0 ? (
                  <div className="space-y-4">
                    {leavesData.map((leave) => (
                      <div
                        key={leave.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-blue-600" />
                            <span className="font-semibold text-gray-900">
                              {leave?.leaveType}
                            </span>
                          </div>
                          <span
                            className="px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1"
                            style={{
                              backgroundColor:
                                leave.status === "approved"
                                  ? "#d4edda"
                                  : "#f8d7da",
                              color:
                                leave.status === "approved"
                                  ? "#155724"
                                  : "#721c24",
                            }}
                          >
                            {leave.status === "approved" ? (
                              <CheckCircle size={14} />
                            ) : (
                              <XCircle size={14} />
                            )}
                            {leave.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                          <Clock size={16} />
                          <span>
                            {new Date(leave?.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}{" "}
                            -{" "}
                            {new Date(leave?.endDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText size={48} className="text-gray-300 mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      No Leave Records
                    </h4>
                    <p className="text-sm text-gray-500">
                      This employee hasn't taken any leaves yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ASSIGN TASKS TAB */}
            {activeTab === "assigned-tasks" && (
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Assigned Tasks
                  </h3>
                  {owner === profile?.reportingManager && (
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      <Plus size={18} />
                      Add Task
                    </button>
                  )}
                </div>

                {tasksData && tasksData.length > 0 ? (
                  <div className="space-y-4">
                    {tasksData.map((task) => (
                      <div
                        key={task._id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-base font-semibold text-gray-900">
                            {task?.taskName}
                          </h4>
                          <div className="flex items-center gap-2">
                            {/* Status Badge */}
                            <span
                              className="px-3 py-1 text-xs font-bold rounded-full uppercase"
                              style={{
                                backgroundColor:
                                  getStatusColor(task?.status) + "20",
                                color: taskStatusColor(task?.status),
                              }}
                            >
                              {task?.status}
                            </span>
                            {/* Priority Badge */}
                            <span
                              className="px-3 py-1 text-xs font-bold rounded-full uppercase"
                              style={{
                                backgroundColor:
                                  getPriorityColor(task?.priority) + "20",
                                color: getPriorityColor(task?.priority),
                              }}
                            >
                              {task?.priority}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={16} />
                          <span>
                            Due:{" "}
                            {new Date(task.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <FileText size={32} className="text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      No Tasks Assigned
                    </h4>
                    <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
                      This employee doesn't have any assigned tasks yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Add New Task</h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleTaskSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Task Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={taskForm?.taskName}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, taskName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter task name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={taskForm.dueDate}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, dueDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={taskForm.priority}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, priority: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
