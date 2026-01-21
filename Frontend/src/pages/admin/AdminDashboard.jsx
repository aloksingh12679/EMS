import { FaUsers } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi";
import { BsBuilding } from "react-icons/bs";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, } from "recharts";
import { FaUserPlus } from "react-icons/fa";
import { MdOutlineApproval } from "react-icons/md";
import { HiCurrencyDollar } from "react-icons/hi";
import { FiSearch, FiBell, FiPlus } from "react-icons/fi";
import AdminSidebar from '../../Components/AdminSidebar';
import { employeeService } from "../../services/employeeServices";
import NotificationSystem from './NotificationSystem';
import {
  HiUser,
  HiUserAdd,
  HiExclamation,
  HiDocumentText,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { capitalize } from "../../utils/helper";
import { leaveService } from "../../services/leaveServive";
import { IoMdPersonAdd } from "react-icons/io";
// Import additional icons for activities
import { AiOutlineFileText, AiOutlineAlert } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { FaUserMinus, FaEdit } from "react-icons/fa";
import { MdCheckCircle, MdCancel } from "react-icons/md";

const data = [
  { week: "Week 1", attendance: 60 },
  { week: "Week 2", attendance: 75 },
  { week: "Week 3", attendance: 55 },
  { week: "Week 4", attendance: 69 },
];

const AdminDashboard = () => {

  const navigate = useNavigate();
  const [stats, setStats] = useState();
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const result = await employeeService.getAdminDashboardStats();
      const activityResult = await employeeService.getRecentActivities();
      console.log(activityResult);
      const NotificationData = await employeeService.getTickets();
      console.log(NotificationData);
      console.log(result);
      
      if (result && result.data) {
        setStats(result.data.stats);
        // Set departments data
        if (result.data.stats.departmentsManager) {
          setDepartments(result.data.stats.departmentsManager);
        }
      }

      // Set activities data
      if (activityResult && activityResult.activities) {
        setActivities(activityResult.activities);
      }
      setLoadingActivities(false);

    } catch (error) {
      console.error("Error:", error);
      setLoadingActivities(false);
    }
  };

  // Helper function to get time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Helper function to get icon based on activity icon name
  const getActivityIcon = (iconName) => {
    const iconMap = {
      'user': <HiUser />,
      'user-plus': <HiUserAdd />,
      'user-minus': <FaUserMinus />,
      'dollar-sign': <HiCurrencyDollar />,
      'edit': <FaEdit />,
      'alert-triangle': <HiExclamation />,
      'file-text': <HiDocumentText />,
      'check-circle': <MdCheckCircle />,
      'x-circle': <MdCancel />,
      'message-square': <AiOutlineFileText />
    };
    return iconMap[iconName] || <HiUser />;
  };

  // Helper function to get icon background color
  const getIconBgColor = (color) => {
    const colorMap = {
      'slate': 'bg-slate-100 text-slate-600',
      'blue': 'bg-blue-100 text-blue-600',
      'green': 'bg-green-100 text-green-600',
      'red': 'bg-red-100 text-red-600',
      'yellow': 'bg-yellow-100 text-yellow-600',
      'orange': 'bg-orange-100 text-orange-600'
    };
    return colorMap[color] || 'bg-slate-100 text-slate-600';
  };

  return (
    <>
      <AdminSidebar />

      <div className="dashboard-wrapper bg-[#F6F8FB] min-h-screen">

        <div className="header-wrapper w-full bg-white px-4 sm:px-6 lg:px-10 py-4 border-b border-slate-200">
          <div className="flex  sm:flex-row items-start sm:items-center justify-between gap-4">

            <div className="flex items-center gap-3  rounded-full px-4 py-2.5 w-full sm:max-w-xl">
              <h1 className="text-[20px] sm:text-[28px] lg:text-[32px] font-bold text-slate-900 mx-2">
                Welcome back, {capitalize(stats?.Admin?.firstName)} 👋
              </h1>

            </div>

            <div className="flex items-center  gap-4 flex-shrink-0">
              <NotificationSystem />
              <button onClick={() => navigate('/admin/employees/add')}
                className=" hidden sm:flex items-center gap-2 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:opacity-95 transition whitespace-nowrap">
                <FiPlus />
                New Employee
              </button >
              <button onClick={() => navigate('/admin/employees/add')}
                className="sm:hidden sm:flex items-center gap-2 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:opacity-95 transition whitespace-nowrap">
                <IoMdPersonAdd />
              </button>
            </div>
          </div>
        </div>

        <div className="content-wrapper px-4 sm:px-6 lg:px-10 pt-8">
          <div className="flex items-start justify-between mb-10">
            <div></div>
          </div>

          {/* STATS GRID */}
          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={<FaUsers className="text-blue-600" />}
              title="Total Employees"
              value={stats?.totalEmployees}
              subText="vs 1,180 last month"
              badgeText="+5.2%"
              badgeColor="bg-green-100 text-green-700"
            />
            <StatsCard
              icon={<MdOutlineVerified className="text-blue-600" />}
              title="Present Today"
              value={stats?.totalEmployees}
              subText="60 absent (excused)"
              badgeText="95% Rate"
              badgeColor="bg-green-100 text-green-700"
            />
            <StatsCard
              icon={<HiOutlineClock className="text-blue-500" />}
              title="Pending leaves"
              value={stats?.pendingLeaves}
              subText="3 urgent requests"
              badgeText="Action Required"
              badgeColor="bg-orange-100 text-orange-700"
            />
            <StatsCard
              icon={<BsBuilding className="text-blue-600" />}
              title="Departments"
              value={stats?.totalDepartments}
              subText="Across 3 locations"
              badgeText="No Change"
              badgeColor="bg-slate-100 text-slate-600"
            />
          </div>

         
{/* RECENT ACTIVITY AND DEPARTMENTS GRID - UPDATED */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
  {/* RECENT ACTIVITY - Takes 2 columns */}
  <div className="xl:col-span-2">
    <div className="bg-white rounded-[24px] px-6 py-6 shadow-sm border border-slate-100 h-full min-h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h3 className="text-[16px] font-semibold text-slate-900">
          Recent Activity
        </h3>
        <span className="text-[13px] font-medium text-blue-600 cursor-pointer">
          View All
        </span>
      </div>

      <div className="space-y-5 flex-1 overflow-y-auto pr-2">
        {loadingActivities ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 text-sm">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 text-sm">No recent activities</p>
          </div>
        ) : (
          activities.slice(0, 5).map((activity) => (
            <ActivityItem
              key={activity._id}
              icon={getActivityIcon(activity.icon)}
              iconBg={getIconBgColor(activity.iconColor)}
              title={activity.title}
              desc={activity.description}
              time={getTimeAgo(activity.createdAt)}
            />
          ))
        )}
      </div>
    </div>
  </div>

  {/* DEPARTMENTS - Takes 1 column */}
  <div className="xl:col-span-1">
    <div className="bg-white rounded-[24px] px-6 py-6 shadow-sm border border-slate-100 h-full min-h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h3 className="text-[16px] font-semibold text-slate-900">
          Departments
        </h3>
        <span className="text-[13px] font-medium text-blue-600 cursor-pointer">
          View All
        </span>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        {departments.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 text-sm">No departments found</p>
          </div>
        ) : (
          departments.map((dept) => (
            <DepartmentCard
              key={dept._id}
              departmentName={dept.name}
              managerName={dept.manager ? dept.manager.firstName : 'Not Allotted'}
            />
          ))
        )}
      </div>
    </div>
  </div>
</div>

          {/* QUICK ACTIONS */}
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <QuickActionCard
                icon={<FaUserPlus />}
                label="Add Employee"
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
                link="/admin/employees/add"
              />
              <QuickActionCard
                icon={<MdOutlineApproval />}
                label="Approve Leave"
                iconBg="bg-orange-100"
                iconColor="text-orange-500"
                link="/admin/employees/leaves"
              />
              <QuickActionCard
                icon={<HiCurrencyDollar />}
                label="Run Payroll"
                iconBg="bg-green-100"
                iconColor="text-green-600"
                link="/admin/employees/salary"
              />
            </div>
          </div>

          {/* SALARY DISTRIBUTION */}
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 mt-8 pb-8">
            <div className="xl:col-span-2">
              <div className="bg-white rounded-[24px] px-6 sm:px-8 py-7 shadow-sm border border-slate-100">
                <h3 className="text-[18px] font-semibold text-slate-900 mb-8">
                  Salary Distribution
                </h3>

                <div className="overflow-x-auto">
                  <div className="grid grid-cols-4 gap-4 sm:gap-8 items-end h-[200px] min-w-[280px]">
                    <SalaryBar label="<30k" fill="35%" />
                    <SalaryBar label="30-50k" fill="55%" />
                    <SalaryBar label="50-80k" fill="85%" active />
                    <SalaryBar label="80k+" fill="45%" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-wrapper {
          margin-left: 0;
          transition: margin-left 0.3s ease-in-out;
          overflow-x: hidden;
          max-width: 100vw;
        }

        .header-wrapper {
          margin-left: 0;
          transition: margin-left 0.3s ease-in-out;
        }

        .content-wrapper {
          margin-left: 0;
          transition: margin-left 0.3s ease-in-out;
        }

        @media (min-width: 1120px) {
          .dashboard-wrapper {
            margin-left: 0; 
          }

          .header-wrapper {
            margin-left: 256px;
            width: calc(100% - 256px);
          }

          .content-wrapper {
            margin-left: 256px; 
            width: calc(100% - 256px);
          }
        }

        @media (max-width: 1119px) {
          .header-wrapper {
            padding-top: 3.5rem; 
          }
        }
      `}</style>
    </>
  );
};

const StatsCard = ({ icon, title, value, subText, badgeText, badgeColor }) => {
  return (
    <div className="bg-white rounded-[24px] px-6 py-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-[14px] bg-slate-50 flex items-center justify-center text-xl">
          {icon}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
          {badgeText}
        </span>
      </div>
      <h3 className="text-slate-500 text-[13px] font-medium mb-2">{title}</h3>
      <p className="text-slate-900 text-[28px] font-bold mb-1">{value}</p>
      <p className="text-slate-400 text-[12px]">{subText}</p>
    </div>
  );
};

const ActivityItem = ({ icon, iconBg, title, desc, time }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div>
          <p className="text-[14px] font-medium text-slate-900">{title}</p>
          <p className="text-[13px] text-slate-500">{desc}</p>
        </div>
      </div>
      <span className="text-[12px] text-slate-400 whitespace-nowrap">{time}</span>
    </div>
  );
};

// NEW COMPONENT - Department Card
const DepartmentCard = ({ departmentName, managerName }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[16px] border border-slate-100 hover:bg-slate-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <BsBuilding className="text-blue-600 text-lg" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-slate-900">{departmentName}</p>
          <p className="text-[12px] text-slate-500">
            Manager: <span className={managerName === 'Not Allotted' ? 'text-orange-600 font-medium' : 'text-slate-700 font-medium'}>
              {managerName}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ icon, label, iconBg, iconColor, link }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-4 sm:gap-5 bg-white px-4 sm:px-6 py-5 rounded-[20px] border border-slate-100 shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-[1px]"
    >
      <div className={`w-11 h-11 flex items-center justify-center rounded-[14px] ${iconBg} ${iconColor} text-lg flex-shrink-0`}>
        {icon}
      </div>
      <span className="text-[14px] sm:text-[15px] font-semibold text-slate-900">{label}</span>
    </div>
  );
};

const SalaryBar = ({ label, fill, active }) => {
  return (
    <div className="flex flex-col items-center justify-end h-full">
      <div className="w-full h-full bg-slate-100 rounded-[20px] flex items-end overflow-hidden">
        <div
          className={`w-full rounded-[20px] ${active ? "bg-blue-500" : "bg-blue-500"}`}
          style={{ height: fill }}
        />
      </div>
      <span className="mt-4 text-[13px] font-medium text-slate-500">{label}</span>
    </div>
  );
};

export default AdminDashboard;