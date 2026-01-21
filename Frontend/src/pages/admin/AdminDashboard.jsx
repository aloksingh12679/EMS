// import StatsCard from "./StatsCards";
import { FaUsers } from "react-icons/fa";
import { MdOutlineVerified, MdPersonAddAlt1 } from "react-icons/md";
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
import { IoMdCheckbox, IoMdPersonAdd } from "react-icons/io";

const data = [
  { week: "Week 1", attendance: 60 },
  { week: "Week 2", attendance: 75 },
  { week: "Week 3", attendance: 55 },
  { week: "Week 4", attendance: 69 },
];

const AdminDashboard = () => {

  const navigate = useNavigate();
  const [stats, setStats] = useState()


  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {

      const result = await employeeService.getAdminDashboardStats();
      const NotificationData = await employeeService.getTickets();
      console.log(NotificationData);
      console.log(result);
      if (result && result.data) {
        setStats(result.data.stats);
      }

    } catch (error) {
      console.error("Error:", error);

    }
  };










  return (
    <>
      {/* SIDEBAR - Fixed position, managed by AdminSidebar component */}
      <AdminSidebar />

      {/* MAIN DASHBOARD CONTENT - Changed: Added dashboard-wrapper class for responsive margin */}
      <div className="dashboard-wrapper bg-[#F6F8FB] min-h-screen">

        {/* TOP HEADER BAR - Changed: Added header-wrapper class for responsive margin */}
        <div className="header-wrapper  w-full bg-white px-4 sm:px-6 lg:px-10 py-4 border-b border-slate-200">
          <div className=" flex  sm:flex-row items-start sm:items-center justify-between gap-4">

            {/* SEARCH BAR - Changed: Added flex-wrap and full width on mobile for mobile responsiveness */}
            <div className="flex items-center gap-3  rounded-full px-4 py-2.5 w-full sm:max-w-xl">
              <h1 className="text-[20px] sm:text-[28px] lg:text-[32px] font-bold text-slate-900 mx-2">
                Welcome back, {capitalize(stats?.Admin?.firstName)} 👋
              </h1>

            </div>

            {/* RIGHT ACTIONS - Changed: Added flex-shrink-0 to prevent squashing */}
            <div className="flex items-center  gap-4 flex-shrink-0">
              {/* Notification */}
              <NotificationSystem />

              {/* Button - Changed: Added responsive classes to show/hide on mobile */}
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

        {/* WELCOME SECTION - Changed: Added content-wrapper class and responsive padding */}
        <div className="content-wrapper px-4 sm:px-6 lg:px-10 pt-8">


          {/* STATS GRID - No changes needed, already responsive */}

          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={<FaUsers className="text-white" />}
              // badgeColor='blue'
              title="Total Employees"
              value={stats?.totalEmployees}
              subText="vs 1,180 last month"
              badgeText="+5.2%"
              badgeColor="bg-green-100 text-green-700"
            />
            <StatsCard
              icon={<MdOutlineVerified className="text-white" />}
              title="Present Today"
              value={stats?.totalEmployees}
              subText="60 absent (excused)"
              badgeText="95% Rate"
              badgeColor="bg-green-100 text-green-700"
            />
            <StatsCard
              icon={<HiOutlineClock className="text-white" />}
              title="Pending leaves"
              value={stats?.pendingLeaves}
              subText="3 urgent requests"
              badgeText="Action Required"
              badgeColor="bg-orange-100 text-orange-700"
            />
            <StatsCard
              icon={<BsBuilding className="text-white" />}
              title="Departments"
              value={stats?.totalDepartments}
              subText="Across 3 locations"
              badgeText="No Change"
              badgeColor="bg-slate-100 text-slate-600"
            />
          </div>

          {/*  RECENT ACTIVITY - Changed: Made them appear side by side on large screens */}


          <div className="grid grid-cols-1 xl:grid-cols-1  gap-6 mt-8">

            {/* RECENT ACTIVITY - Changed: Takes 1 column on xl screens, appears beside attendance */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-[24px] px-6 py-6 shadow-sm border-1 border-blue-300 h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[16px] font-semibold text-black">
                    Recent Activity
                  </h3>
                  <span className="text-[13px] font-medium text-black cursor-pointer hover:text-blue-600">
                    View All
                  </span>
                </div>

                {/* Activity List */}
                <div className="space-y-5">
                  <ActivityItem
                    icon={<HiUser />}
                    iconBg="bg-slate-100"
                    title="Sarah Johnson"
                    desc="Applied for Sick Leave"
                    time="2m ago"
                  />
                  <ActivityItem
                    icon={<HiCurrencyDollar />}
                    iconBg="bg-green-100 text-green-600"
                    title="Payroll System"
                    desc="Oct Payroll Processed"
                    time="1h ago"
                  />
                  <ActivityItem
                    icon={<HiUserAdd />}
                    iconBg="bg-blue-100 text-blue-600"
                    title="New Hire: Mike R."
                    desc="Added to Engineering"
                    time="3h ago"
                  />
                  <ActivityItem
                    icon={<HiExclamation />}
                    iconBg="bg-yellow-100 text-yellow-600"
                    title="System Alert"
                    desc="Server load peaked 85%"
                    time="5h ago"
                  />
                  <ActivityItem
                    icon={<HiDocumentText />}
                    iconBg="bg-slate-100"
                    title="Policy Update"
                    desc="Updated WFH policy"
                    time="1d ago"
                  />
                </div>
              </div>
            </div>
          </div>



          {/* QUICK ACTIONS - Changed: Made grid responsive for mobile/tablet */}
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              <QuickActionCard
                icon={<MdPersonAddAlt1 />}
                label="Add Employee"
                iconBg="bg-gradient-to-r from-blue-600 to-blue-500"
                iconColor="text-white"
                link="/admin/employees/add"
              />
              <QuickActionCard
                icon={<IoMdCheckbox />}
                label="Approve Leave"
                iconBg="bg-gradient-to-r from-blue-600 to-blue-500"
                iconColor="text-white"
                link="/admin/employees/leaves"

              />
              <QuickActionCard
                icon={<HiCurrencyDollar />}
                label="Run Payroll"
                iconBg="bg-gradient-to-r from-blue-600 to-blue-500"
                iconColor="text-white"
                link="/admin/employees/salary"

              />
            </div>
          </div>

          {/* SALARY DISTRIBUTION + AI ANALYTICS - Changed: Made them appear side by side on large screens */}
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 mt-8 pb-8 ">
            {/* SALARY DISTRIBUTION - Changed: Takes 2 columns on xl screens */}
            <div className="xl:col-span-2 ">
              <div className="bg-white rounded-[24px] px-6 sm:px-8 py-7 shadow-sm border-1 border-blue-300">
                <h3 className="text-[18px] font-semibold text-slate-900 mb-8">
                  Salary Distribution
                </h3>

                {/* Bars Container - Changed: Made gap responsive and added horizontal scroll on mobile */}
                <div className="overflow-x-auto ">
                  <div className="grid grid-cols-4 gap-4 sm:gap-8 items-end h-[200px] min-w-[280px] ">
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

      {/* CSS for responsive sidebar margin - Changed: Added custom styles to match AdminSidebar's 1120px breakpoint */}
      <style>{`
        /* Mobile: No margin, full width */
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

        /* Desktop (1120px and above): Add margin for fixed sidebar */
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

// Added missing component
const StatsCard = ({ icon, title, value, subText, badgeText, badgeColor }) => {
  return (
    <div className="bg-white rounded-[24px] px-6 py-6 shadow-sm  border-1 border-blue-300 ">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-[14px] bg-gradient-to-r from-blue-600 to-blue-500  flex items-center justify-center  text-2xl">
          {icon}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
          {badgeText}
        </span>
      </div>
      <h3 className="text-black text-[14px] font-medium mb-2">{title}</h3>
      <p className="text-slate-900 text-[28px] font-bold mb-1">{value}</p>
      <p className="text-slate-400 text-[13px]">{subText}</p>
    </div>
  );
};

// No changes, already responsive
const ActivityItem = ({ icon, iconBg, title, desc, time }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full text-xl flex items-center justify-center ${iconBg} `}>
          {icon}
        </div>
        <div>
          <p className="text-[14px] font-medium text-black">{title}</p>
          <p className="text-[13px] text-slate-700">{desc}</p>
        </div>
      </div>
      <span className="text-[12px] text-slate-700 whitespace-nowrap">{time}</span>
    </div>
  );
};

// Changed: Added responsive padding
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
      className="flex items-center gap-4 sm:gap-5 bg-white px-4 sm:px-6 py-5 rounded-[20px] border-1 border-blue-300 shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-[1px]"
    >
      <div className={`w-11 h-11 flex items-center justify-center rounded-[14px] ${iconBg} ${iconColor} text-2xl flex-shrink-0`}>
        {icon}
      </div>
      <span className="text-[14px] sm:text-[15px] font-semibold text-slate-900">{label}</span>
    </div>
  );
};

// No changes needed
const SalaryBar = ({ label, fill, active }) => {
  return (
    <div className="flex flex-col items-center justify-end h-full ">
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