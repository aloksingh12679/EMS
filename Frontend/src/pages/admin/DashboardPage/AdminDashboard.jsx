// import AiAnalyticsCard from "../AiAnalyticsCard";
// import AttendanceChart from "../AttendanceChart";
// // import QuickActions from "../QuickAction";
// import RecentActivity from "../RecentActivity";
// import SalaryDistribution from "../SalaryDistribution";
// import Sidebar from "../Sidebar";
import StatsGrid from "./StatsGrid";
// import Topbar from "../Topbar";
import AiAnalyticsCard from "./AiAnalyticsCard";
import AttendanceChart from "./AttendanceChart";
import QuickActions from "./QuickAction";
import RecentActivity from "./RecentTable";
import SalaryDistribution from "./SalaryDistribution";


import Topbar from "./Topbar";
import StatsCard from "./StatsCards";
import AdminSidebar from "../../../Components/AdminSidebar.jsx";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex bg-[#F6F8FB]">

      
      <AdminSidebar />
      {/* MAIN CONTENT */}
      <main className="flex-1 px-10 py-6">

        {/* TOP BAR */}
        <Topbar />

        {/* <StatsCard /> */}

        {/* STATS */}
        {/* <StatsGrid /> */}

        {/* ATTENDANCE + RECENT ACTIVITY */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="col-span-2">
            <AttendanceChart />
          </div>
          <RecentActivity />
         </div>

        {/* QUICK ACTIONS */}
        <div className="mt-8">
          <QuickActions />
        </div>

        {/* SALARY + AI ANALYTICS */}
         <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="col-span-2">
            <SalaryDistribution />
          </div>
          <AiAnalyticsCard />
        </div>

      </main> 
    </div>
  );
};

export default AdminDashboard;
