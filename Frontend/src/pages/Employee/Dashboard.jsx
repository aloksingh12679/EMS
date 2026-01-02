import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  ClipboardList,
  Settings,
  Download,
  LogIn,
  LogOut,
} from "lucide-react";

export default function App() {
  const [clockedIn, setClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState(new Date());
  const [attendance] = useState(92);

  const toggleClock = () => {
    if (!clockedIn) setClockInTime(new Date());
    setClockedIn(!clockedIn);
  };

  return (
    <div className="flex min-h-screen bg-[#f6f8fb] font-sans">
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-gradient-to-b from-[#0b1220] to-[#020617] text-white flex flex-col justify-between">
        <div>
          <div className="px-6 py-6">
            <div className="text-lg font-semibold">TechCorp EMS</div>
            <div className="text-xs text-gray-400">Employee Portal</div>
          </div>
          <nav className="px-4 space-y-1">
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
            <NavItem icon={<FileText size={18} />} label="Payslips" />
            <NavItem icon={<Calendar size={18} />} label="Leaves" />
            <NavItem icon={<ClipboardList size={18} />} label="Tasks" />
            <NavItem icon={<Settings size={18} />} label="Settings" />
          </nav>
        </div>
        <div className="flex items-center gap-3 p-4 border-t border-white/10">
          <img src="https://i.pravatar.cc/100?img=47" className="h-9 w-9 rounded-full" />
          <div>
            <div className="text-sm font-medium">Sarah Miller</div>
            <div className="text-xs text-gray-400">Product Designer</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10 space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-[28px] font-semibold text-gray-900">Welcome back, Sarah</h1>
            <p className="text-gray-500 mt-1">It's Tuesday, October 24, 2023</p>
          </div>
          <button
            onClick={toggleClock}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm ${clockedIn ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
          >
            {clockedIn ? <LogOut size={16} /> : <LogIn size={16} />}
            {clockedIn
              ? `Clocked In: ${clockInTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Clock In"}
          </button>
        </header>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Attendance */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-40 relative overflow-hidden group">
            
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Attendance</p>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-slate-900 text-3xl font-bold">92%</h3>
                <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">+2.4%</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
              <div className="bg-[#0b1220] h-2 rounded-full" style={{ width: "92%" }} />
            </div>
            <p className="text-slate-400 text-xs mt-2">Target: 95% monthly average</p>
          </div>

          {/* Salary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-40 relative overflow-hidden group">
            
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Current Salary</p>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-slate-900 text-3xl font-bold">$5,200</h3>
                <span className="text-slate-400 text-sm">/ month</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <span className="material-symbols-outlined text-green-600 text-sm">trending_up</span>
              <p className="text-slate-500 text-xs">Next review in 14 days</p>
            </div>
          </div>

          {/* Leave */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-40 relative overflow-hidden group">
            
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Leave Balance</p>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-slate-900 text-3xl font-bold">12 Days</h3>
                <span className="text-slate-400 text-sm">Remaining</span>
              </div>
            </div>
            <div className="flex gap-2 mt-auto">
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">8 Paid</span>
              <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium">3 Sick</span>
              <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium">1 Casual</span>
            </div>
          </div>
        </section>

        {/* SALARY + TASKS */}
        <section className="grid grid-cols-3 gap-6">
          <SalaryHistory />
          <MyTasks />
        </section>
      </main>
    </div>
  );
}

/* COMPONENTS */

const MyTasks = () => (
  <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
      <div>
        <h3 className="text-slate-900 font-bold text-lg">My Tasks</h3>
        <p className="text-slate-500 text-sm">Assigned for this week</p>
      </div>
      <button
  aria-label="Add task"
  className="h-8 w-8 flex items-center justify-center
             rounded-full border border-slate-300
             bg-white hover:bg-slate-100 transition"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-slate-600"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
</button>

    </div>

    <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
      <TaskItem title="Q3 Financial Report review" priority="High Priority" color="red" due="Due Today" />
      <TaskItem title="Onboarding new intern" priority="Medium" color="amber" due="Due Tomorrow" />
      <TaskItem title="Update compliance docs" priority="Low" color="blue" due="Due Oct 27" />
      <TaskDone title="Submit Timesheet" />
    </div>

    <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
      <button className="w-full text-center text-sm text-slate-400 hover:text-primary font-medium">View All Tasks</button>
    </div>
  </div>
);

const TaskItem = ({ title, priority, color, due }) => {
  const colors = {
    red: "text-red-600 bg-red-50",
    amber: "text-amber-600 bg-amber-50",
    blue: "text-blue-600 bg-blue-50",
  };

  return (
    <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
      <div className="pt-0.5">
        <input className="w-5 h-5 rounded border-slate-200 text-primary focus:ring-primary/20" type="checkbox" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">{title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors[color]}`}>{priority}</span>
          <span className="text-xs text-slate-400">{due}</span>
        </div>
      </div>
    </div>
  );
};

const TaskDone = ({ title }) => (
  <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
    <div className="pt-0.5">
      <input checked readOnly className="w-5 h-5 rounded border-slate-200 text-primary focus:ring-primary/20" type="checkbox" />
    </div>
    <div className="flex-1 opacity-60">
      <p className="text-sm font-medium text-slate-900 line-through">{title}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Done</span>
      </div>
    </div>
  </div>
);

const NavItem = ({ icon, label, active }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer ${active ? "bg-white/15 text-white" : "text-gray-300 hover:bg-white/5"}`}>
    {icon}
    {label}
  </div>
);

const Card = ({ children }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">{children}</div>
);

const Badge = ({ text, color }) => {
  const map = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
  };
  return <span className={`px-3 py-1 rounded-full ${map[color]}`}>{text}</span>;
};

const SalaryHistory = () => (
  <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="font-bold">Salary History</h2>
        <p className="text-sm text-gray-500">Recent payment activity</p>
      </div>
      <button className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm flex gap-2 items-center">
        <Download size={16} /> Download Payslip
      </button>
    </div>

    <table className="w-full text-sm">
      <thead className="text-xs font-semibold text-gray-400 border-b">
        <tr>
          <th className="text-left py-3">MONTH</th>
          <th className="text-center">BASE SALARY</th>
          <th className="text-center">DEDUCTIONS</th>
          <th className="text-center">NET PAY</th>
          <th className="text-center">STATUS</th>
        </tr>
      </thead>
      <tbody>
        <SalaryRow month="October" year="2023" deduction="-$300.00" net="$5,200.00" />
        <SalaryRow month="September" year="2023" deduction="-$300.00" net="$5,200.00" />
        <SalaryRow month="August" year="2023" deduction="-$300.00" net="$5,200.00" />
        <SalaryRow month="July" year="2023" deduction="-$150.00" net="$5,350.00" />
      </tbody>
    </table>

    <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
      <button className="w-full text-center text-sm text-gray-600 hover:text-primary font-medium">View All Tasks</button>
    </div>
  </div>
);

const SalaryRow = ({ month, year, deduction, net }) => (
  <tr className="border-b last:border-none">
    <td className="py-4"><div>{month}</div><div className="text-xs text-gray-400">{year}</div></td>
    <td className="text-center">$5,500.00</td>
    <td className="text-center text-red-500">{deduction}</td>
    <td className="text-center font-semibold">{net}</td>
    <td className="text-center"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Paid</span></td>
  </tr>
);
