import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  ClipboardList,
  Settings,
  Download,
  LogIn,
  LogOut,
  Plus,
} from "lucide-react";
import EmployeesSidebar from "../../Components/EmployeesSidebar";
import { employeeService } from "../../services/employeeServices";
import { capitalize } from "../../utils/helper";

export default function EmployeeDashboard() {
  const [clockedIn, setClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState(new Date());
  const [attendance] = useState(92);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [me, setMe] = useState();
  const [salarydetails, setSalaryDetails] = useState([]);
  const [taskdetails, setTaskDetails] = useState([]);
  const getCurrentDate = () => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
    setTimeout(() => {
      const wrapper = document.querySelector('div.fixed.inset-y-0.left-0.z-50');
      if (!wrapper) return;
      const aside = wrapper.querySelector('aside');
      if (aside) {
        aside.classList.add('translate-x-0');
        aside.classList.remove('-translate-x-full');
        aside.style.transform = 'translateX(0)';
      }
      const innerToggle = wrapper.querySelector('button.fixed.top-4.left-4');
      if (innerToggle) innerToggle.style.display = 'none';
    }, 20);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setTimeout(() => {
      const wrapper = document.querySelector('div.fixed.inset-y-0.left-0.z-50');
      if (!wrapper) return;
      const aside = wrapper.querySelector('aside');
      if (aside) {
        aside.classList.remove('translate-x-0');
        aside.classList.add('-translate-x-full');
        aside.style.transform = '';
      }
      const innerToggle = wrapper.querySelector('button.fixed.top-4.left-4');
      if (innerToggle) innerToggle.style.display = '';
    }, 20);
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const result = await employeeService.getEmployeedashboardStats();
      console.log(result);
      if (result && result.success) {
        setMe(result.data.employee);
        setSalaryDetails(result.data.salaryDetails);
        setTaskDetails(result.data.taskDetails);
      }
    } catch (error) {
      console.error("employee dashboard error", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] font-sans">

      <EmployeesSidebar />


      {/* ===== OVERLAY (mobile only) =====
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 z-40 min-[1112px]:hidden"
        />
      )} */}

      <main className="flex-1 p-4 sm:p-6 lg:p-10 space-y-8 min-[1112px]:ml-[280px]">
        <header className=" gap-4 flex-row items-center">




          <div className="relative overflow-hidden rounded-2xl shadow-lg 
    bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600">

            {/* Optional soft glow overlay */}
            <div className="absolute inset-0 bg-white/5"></div>

            {/* Content */}
            <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 text-white">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Welcome back, {capitalize(me?.firstName) || "Employee"}
              </h1>

              <p className="text-base sm:text-lg text-white/80">
                {getCurrentDate()}
              </p>
            </div>
          </div>



        </header>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Attendance */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
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
                <h3 className="text-slate-900 text-3xl font-bold">$ {(salarydetails[0]?.baseSalary) || 0}</h3>
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
                <h3 className="text-slate-900 text-3xl font-bold">{me?.leaveBalance?.annual + me?.leaveBalance?.sick + me?.leaveBalance?.personal} Days</h3>
                <span className="text-slate-400 text-sm">Remaining</span>
              </div>
            </div>
            <div className="flex gap-2 mt-auto">
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">{me?.leaveBalance?.annual || 0} Annual</span>
              <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium"> {me?.leaveBalance?.sick || 0} Sick</span>
              <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium">{me?.leaveBalance?.personal || 0} personal</span>
            </div>
          </div>
        </section>

        {/* SALARY + TASKS */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SalaryHistory salarydetails={salarydetails} />
          <MyTasks taskdetails={taskdetails} />
        </section>
      </main>
    </div>
  );
}

/* COMPONENTS */

const MyTasks = ({ taskdetails }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col min-h-[420px]">
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
          <Plus className="h-4 w-4 text-slate-600" />
        </button>
      </div>

      <div className="flex-1 p-3 sm:p-4 flex flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          </div>
        ) : taskdetails && taskdetails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-slate-300 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-slate-500 text-sm">No tasks assigned</p>
          </div>
        ) : (
          taskdetails?.map((task) => (
            task.status === "completed" ? (
              <TaskDone key={task._id || task.id} title={task?.taskName} />
            ) : (
              <TaskItem
                key={task._id || task.id}
                title={task?.taskName}
                priority={task?.priority}
                color={task?.priority === "Low" ? "amber" : task?.priority === "High" ? "blue" : "red"}
                due={task?.dueDate}
              />
            )
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
        <button className="w-full text-center text-sm text-slate-400 hover:text-primary font-medium">
          View All Tasks ({taskdetails?.length || 0})
        </button>
      </div>
    </div>
  );
};

const TaskItem = ({ title, priority, color, due }) => {
  const colors = {
    red: "text-red-600 bg-red-50",
    amber: "text-amber-600 bg-amber-50",
    blue: "text-blue-600 bg-blue-50",
  };
  // Format due date
  const formatDueDate = (dueDate) => {
    if (!dueDate) return "No due date";

    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time parts for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Due Today";
    } else if (date.getTime() === tomorrow.getTime()) {
      return "Due Tomorrow";
    } else if (date < today) {
      return "Overdue";
    } else {
      // Format as "Due Oct 27" or "Due Jan 15"
      const options = { month: 'short', day: 'numeric' };
      return `Due ${date.toLocaleDateString('en-US', options)}`;
    }
  };
  return (
    <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">{title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors[color] || 'text-slate-600 bg-slate-50'}`}>{priority}</span>
          <span className="text-xs text-slate-400">{formatDueDate(due)}</span>
        </div>
      </div>
    </div>
  );
};

const TaskDone = ({ title }) => (
  <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
    <div className="flex-1 opacity-60">
      <p className="text-sm font-medium text-slate-900 line-through">{title}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Done</span>
      </div>
    </div>
  </div>
);

const SalaryHistory = ({ salarydetails }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h2 className="font-bold">Salary History</h2>
          <p className="text-sm text-gray-500">Recent payment activity</p>
        </div>

        <button className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm flex gap-2 items-center w-full sm:w-auto justify-center">
          <Download size={16} /> Download Payslip
        </button>
      </div>

      {/* ================= TABLE VIEW (Tablet + Desktop) ================= */}
      <div className="hidden sm:block overflow-x-auto lg:overflow-visible">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          </div>
        ) : salarydetails && salarydetails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-slate-300 mb-2" />
            <p className="text-slate-500 text-sm">No salary records found</p>
          </div>
        ) : (
          <table className="min-w-[720px] lg:min-w-full w-full text-sm">
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
              {salarydetails?.map((salary) => (
                <SalaryRow
                  key={salary._id || salary.id}
                  month={salary.month}
                  year={new Date().getFullYear()}
                  baseSalary={salary.baseSalary}
                  deduction={salary.deductions}
                  taxApply={salary?.taxApply}
                  net={salary.netSalary}
                  status={salary.Status}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="sm:hidden space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          </div>
        ) : salarydetails && salarydetails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-slate-300 mb-2" />
            <p className="text-slate-500 text-sm">No salary records found</p>
          </div>
        ) : (
          salarydetails?.map((salary) => (
            <MobileSalaryCard
              key={salary._id || salary.id}
              month={salary.month}
              year={new Date().getFullYear()}
              base={`$${salary.baseSalary}`}
              deduction={`$-${((parseFloat(salary?.baseSalary) || 0) * (parseFloat(salary?.taxApply) || 0) / 100 + (parseFloat(salary?.deductions) || 0)).toFixed(2)}`}
              net={`$${salary.netSalary}`}
              status={salary.Status}
            />
          ))
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-6 p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
        <button className="w-full text-center text-sm text-gray-600 hover:text-primary font-medium">
          View All Payslips ({salarydetails?.length || 0})
        </button>
      </div>
    </div>
  );
};

const SalaryRow = ({ month, year, baseSalary, taxApply, deduction, net, status }) => (
  <tr className="border-b last:border-none">
    <td className="py-4">
      <div>{month}</div>
      <div className="text-xs text-gray-400">{year}</div>
    </td>
    <td className="text-center">${parseFloat(baseSalary || 0).toLocaleString()}</td>
    <td className="text-center text-red-500">`$-${((parseFloat(baseSalary) || 0) * (parseFloat(taxApply) || 0) / 100 + (parseFloat(deduction) || 0)).toFixed(2)}`
    </td>
    <td className="text-center font-semibold">${parseFloat(net || 0).toLocaleString()}</td>
    <td className="text-center">
      <span className={`px-3 py-1 rounded-full text-xs ${status === 'paid' ? 'bg-green-100 text-green-700' :
          status === 'processing' ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700'
        }`}>
        {capitalize(status || 'pending')}
      </span>
    </td>
  </tr>
);

const MobileSalaryCard = ({ month, year, base, deduction, net, status }) => (
  <div className="border rounded-xl p-4 bg-slate-50 space-y-3">
    <div className="flex justify-between items-center">
      <div>
        <p className="font-semibold text-slate-900">{month}</p>
        <p className="text-xs text-gray-400">{year}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs ${status === 'paid' ? 'bg-green-100 text-green-700' :
          status === 'processing' ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700'
        }`}>
        {capitalize(status || 'pending')}
      </span>
    </div>

    <div className="flex justify-between text-sm">
      <span className="text-gray-500">Base Salary</span>
      <span>{base}</span>
    </div>

    <div className="flex justify-between text-sm text-red-500">
      <span>Deductions</span>
      <span>{deduction}</span>
    </div>

    <div className="flex justify-between font-semibold">
      <span>Net Pay</span>
      <span>{net}</span>
    </div>
  </div>
);

const NavItem = ({ icon, label, active }) => (
  <div className={`flex items-center gap-3 px-4 py-3 sm:py-2 rounded-xl cursor-pointer ${active ? "bg-white/15 text-white" : "text-gray-300 hover:bg-white/5"}`}>
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