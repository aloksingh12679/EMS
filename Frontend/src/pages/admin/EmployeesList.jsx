export default function EmployeesList() {
  return (
    <div className="flex h-screen w-full bg-[#f6f7f8] font-['Inter'] text-[#0f1729]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-white border-r hidden lg:flex flex-col p-4">
        <div className="flex flex-col h-full justify-between">

          {/* BRAND + NAV */}
          <div>
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="bg-[#0f1729] w-10 h-10 rounded-full flex items-center justify-center text-white">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <h1 className="font-bold text-lg">Enterprise EMS</h1>
            </div>

            <nav className="flex flex-col gap-2 text-sm">
              <NavItem icon="dashboard" label="Dashboard" />
              <NavItem icon="group" label="Employees" active />
              <NavItem icon="payments" label="Payroll" />
              <NavItem icon="description" label="Reports" />
              <NavItem icon="settings" label="Settings" />
            </nav>
          </div>

          {/* USER PROFILE */}
          <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
            <img
              src="https://i.pravatar.cc/40?img=12"
              className="w-10 h-10 rounded-full"
              alt="user"
            />
            <div>
              <p className="text-sm font-semibold">Alex Morgan</p>
              <p className="text-xs text-gray-500">HR Director</p>
            </div>
            <span className="material-symbols-outlined ml-auto text-gray-400">
              logout
            </span>
          </div>

        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* TOP BAR */}
        <header className="h-16 bg-white border-b flex items-center px-6 justify-between">
          <input
            className="hidden lg:block w-96 px-4 py-2 border rounded-lg text-sm"
            placeholder="Search global records..."
          />
          <div className="flex gap-4 text-gray-500">
            <span className="material-symbols-outlined">notifications</span>
            <span className="material-symbols-outlined">help</span>
          </div>
        </header>

        {/* PAGE BODY */}
        <section className="flex-1 overflow-y-auto p-8">

          {/* HEADER */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-1">
              Home / Management / <span className="text-gray-700">Employees</span>
            </p>

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">Employee List</h2>
                <p className="text-gray-500">
                  Manage access, roles, and employment status for all staff.
                </p>
              </div>

              <button className="bg-[#0f1729] text-white px-5 py-2 rounded-xl flex gap-2 items-center">
                <span className="material-symbols-outlined text-sm">add</span>
                Add Employee
              </button>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4 flex-wrap">
            <input
              className="flex-1 min-w-[200px] px-4 py-2 border rounded-xl text-sm"
              placeholder="Search by name, ID, or role..."
            />
            <select className="px-3 py-2 border rounded-xl text-sm">
              <option>All Depts</option>
            </select>
            <select className="px-3 py-2 border rounded-xl text-sm">
              <option>All Status</option>
            </select>
            <button className="px-4 py-2 border rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span>
              Export
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400">
                <tr>
                  <th className="p-4"></th>
                  <th className="p-4 text-left">EMPLOYEE</th>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">ROLE & DEPT</th>
                  <th className="p-4 text-left">STATUS</th>
                  <th className="p-4 text-left">JOINED DATE</th>
                  <th className="p-4"></th>
                </tr>
              </thead>

              <tbody>
                <EmployeeRow
                  avatar="https://i.pravatar.cc/40?img=1"
                  name="Sarah Smith"
                  email="sarah.smith@example.com"
                  id="#EMP-204"
                  role="Product Designer"
                  dept="Design Team"
                  status="Active"
                  date="Jan 14, 2023"
                />

                <EmployeeRow
                  avatar="https://i.pravatar.cc/40?img=2"
                  name="Michael Foster"
                  email="michael.foster@example.com"
                  id="#EMP-205"
                  role="Front-end Developer"
                  dept="Engineering"
                  status="Active"
                  date="Mar 20, 2023"
                />

                <EmployeeRow
                  avatar="https://i.pravatar.cc/40?img=3"
                  name="Emily Chen"
                  email="emily.chen@example.com"
                  id="#EMP-206"
                  role="HR Specialist"
                  dept="Human Resources"
                  status="On Leave"
                  date="Jun 12, 2023"
                />
              </tbody>
            </table>
          </div>

        </section>
      </main>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function NavItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer
      ${active ? "bg-[#0f1729]/5 font-semibold" : "text-gray-500"}`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      {label}
    </div>
  );
}

function EmployeeRow({ avatar, name, email, id, role, dept, status, date }) {
  const statusClass =
    status === "Active"
      ? "bg-emerald-100 text-emerald-700"
      : status === "On Leave"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-4">
        <input type="checkbox" />
      </td>

      <td className="p-4">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-xs text-gray-400">{email}</p>
          </div>
        </div>
      </td>

      <td className="p-4 font-mono">{id}</td>

      <td className="p-4">
        <p className="font-medium">{role}</p>
        <p className="text-xs text-gray-400">{dept}</p>
      </td>

      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs ${statusClass}`}>
          {status}
        </span>
      </td>

      <td className="p-4">{date}</td>

      <td className="p-4 text-gray-400">
        <span className="material-symbols-outlined">more_vert</span>
      </td>
    </tr>
  );
}
