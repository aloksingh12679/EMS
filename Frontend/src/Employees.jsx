import React from "react";
import "./Employees.css";

const employees = [
  {
    id: "#EMP-204",
    name: "Sarah Smith",
    email: "sarah.smith@example.com",
    role: "Product Designer",
    dept: "Design Team",
    status: "Active",
    date: "Jan 14, 2023",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "#EMP-205",
    name: "Michael Foster",
    email: "michael.foster@example.com",
    role: "Front-end Developer",
    dept: "Engineering",
    status: "Active",
    date: "Mar 20, 2023",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: "#EMP-206",
    name: "Emily Chen",
    email: "emily.chen@example.com",
    role: "HR Specialist",
    dept: "Human Resources",
    status: "On Leave",
    date: "Jun 12, 2023",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "#EMP-198",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "Backend Engineer",
    dept: "Engineering",
    status: "Terminated",
    date: "Dec 04, 2022",
    avatar: "https://i.pravatar.cc/40?img=4",
  },
  {
    id: "#EMP-210",
    name: "Jessica Lee",
    email: "jessica.lee@example.com",
    role: "Sales Manager",
    dept: "Sales",
    status: "Active",
    date: "Sep 15, 2023",
    avatar: "https://i.pravatar.cc/40?img=5",
  },
];

function Employees() {
  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Enterprise EMS</h2>
        <ul>
          <li>Dashboard</li>
          <li className="active">Group Employees</li>
          <li>Payroll</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>

        <div className="profile">
          <img src="https://i.pravatar.cc/50" alt="profile" />
          <div>
            <strong>Alex Morgan</strong>
            <small>HR Director</small>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content">
        <div className="header">
          <h1>Employee List</h1>
          <button className="add-btn">+ Add Employee</button>
        </div>

        <div className="filters">
          <input placeholder="Search by name, ID, or role..." />
          <select>
            <option>All Depts</option>
          </select>
          <select>
            <option>All Status</option>
          </select>
          <button className="export-btn">Export</button>
        </div>

        <table className="employee-table">
          <thead>
            <tr>
              <th></th>
              <th>EMPLOYEE</th>
              <th>ID</th>
              <th>ROLE & DEPT</th>
              <th>STATUS</th>
              <th>JOINED DATE</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" />
                </td>

                <td className="emp-info">
                  <img src={emp.avatar} alt="" />
                  <div>
                    <strong>{emp.name}</strong>
                    <small>{emp.email}</small>
                  </div>
                </td>

                <td>{emp.id}</td>

                {/* 🔥 FIXED ROLE & DEPT */}
                <td className="role-dept">
                  <strong>{emp.role}</strong>
                  <small>{emp.dept}</small>
                </td>

                <td>
                  <span className={`status ${emp.status.replace(" ", "")}`}>
                    {emp.status}
                  </span>
                </td>

                <td>{emp.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Employees;
