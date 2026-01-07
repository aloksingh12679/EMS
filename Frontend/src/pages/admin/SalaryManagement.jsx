import React, { useState } from "react";
import {
  Search,
  Bell,
  Download,
  PlayCircle,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import "../../assets/styles/SalaryManagementStyles/SalaryManagement.css";
import AdminSidebar from "../../Components/AdminSidebar";

export default function SalaryManagement() {
  const [selectedEmployee, setSelectedEmployee] = useState({
    name: "Sarah Smith",
    id: "#EMP-042",
    role: "Sr. Product Designer",
    dept: "Design Dept.",
    type: "Full Time",
    status: "ACTIVE",
    baseSalary: 8500.0,
    bonus: 500,
    deductions: 150,
    netPay: 7150.00,
    taxDeductions: 1850.0,
    avatar: "👩‍🦰",
  });

  const employees = [
    {
      name: "Sarah Smith",
      id: "#EMP-042",
      role: "Sr. Product Designer",
      baseSalary: 8500.0,
      netPay: 7150.0,
      status: "Pending",
      avatar: "👩‍🦰",
      dept: "Design Dept.",
    },
    {
      name: "Michael Brown",
      id: "#EMP-043",
      role: "Engineering Lead",
      baseSalary: 10200.0,
      netPay: 8450.0,
      status: "Paid",
      avatar: "👨‍💼",
      dept: "Engineering",
    },
    {
      name: "Jason Doe",
      id: "#EMP-045",
      role: "Marketing Manager",
      baseSalary: 7800.0,
      netPay: 6450.0,
      status: "Pending",
      avatar: "👨",
      dept: "Marketing",
    },
    {
      name: "Emily Blunt",
      id: "#EMP-048",
      role: "HR Specialist",
      baseSalary: 6500.0,
      netPay: 5250.0,
      status: "Paid",
      avatar: "👩",
      dept: "HR",
    },
  ];

  return (
    <div className="salary-management">
      <AdminSidebar/>
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <nav className="breadcrumb">
            {/* <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-item">Payroll</span>
            <span className="breadcrumb-separator">›</span> */}
            <span className="breadcrumb-item active">Salary Management</span>
          </nav>
          <div className="header-actions">
            <div className="search-box">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div>
            <button className="notification-btn">
              <Bell size={24} />
              <span className="notification-badge">1</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="salary-main-content">
        {/* Title Section */}
        <div className="title-section">
          <div className="title-info">
            <h1>Salary Management</h1>
            <p>
              Manage employee roster, adjust bonuses, and process payroll
              cycles.
            </p>
          </div>
          <div className="action-buttons">
            <button className="btn btn-outline">
              <Download size={16} />
              <span>Export Report</span>
            </button>
            <button className="btn btn-primary">
              <PlayCircle size={16} />
              <span>Run Payroll</span>
            </button>
          </div>
        </div>

        <div className="content-grid">
          {/* Employee Table */}
          <div className="card">
            {/* Filter Section */}
            <div className="filter-section">
              <div className="filter-container">
                <div className="filter-input-wrapper">
                  <Search className="filter-icon" size={20} />
                  <input
                    type="text"
                    placeholder="Filter by name, ID or role..."
                    className="filter-input"
                  />
                </div>
                <div className="filter-select">
                  <span>All Departments</span>
                  <ChevronDown size={16} />
                </div>
                <div className="filter-select">
                  <span>Status: All</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>EMPLOYEE</th>
                    <th>ROLE</th>
                    <th>BASE SALARY</th>
                    <th>NET PAY</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, idx) => (
                    <tr
                      key={idx}
                      className={
                        selectedEmployee.id === emp.id ? "selected" : ""
                      }
                      onClick={() =>
                        setSelectedEmployee({
                          ...emp,
                          type: "Full Time",
                          status: "ACTIVE",
                          bonus: emp.name === "Sarah Smith" ? 500 : 300,
                          deductions: emp.name === "Sarah Smith" ? 150 : 200,
                          taxDeductions:
                            emp.baseSalary -
                            emp.netPay -
                            (emp.name === "Sarah Smith" ? 500 : 300) +
                            (emp.name === "Sarah Smith" ? 150 : 200),
                        })
                      }
                    >
                      <td>
                        <div className="employee-info">
                          <div className="employee-avatar">{emp.avatar}</div>
                          <div className="employee-details">
                            <div className="name">{emp.name}</div>
                            <div className="id">ID: {emp.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="role-text">{emp.role}</div>
                      </td>
                      <td>
                        <div className="salary-text">
                          ${emp.baseSalary.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div className="salary-text">
                          ${emp.netPay.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            emp.status === "Paid"
                              ? "status-paid"
                              : "status-pending"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn">
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <div className="pagination-info">Showing 1-4 of 48 employees</div>
              <div className="pagination-buttons">
                <button className="pagination-btn">Prev</button>
                <button className="pagination-btn">Next</button>
              </div>
            </div>
          </div>

          {/* Employee Detail Panel */}
          <div className="card">
            <div className="detail-panel">
              {/* Employee Header */}
              <div className="employee-header">
                <div className="employee-header-info">
                  <div className="employee-header-avatar">
                    {selectedEmployee.avatar}
                  </div>
                  <div className="employee-header-details">
                    <h3>{selectedEmployee.name}</h3>
                    <p>
                      {selectedEmployee.dept} • {selectedEmployee.type}
                    </p>
                  </div>
                </div>
                <span className="status-active">{selectedEmployee.status}</span>
              </div>

              {/* Adjustments */}
              <div className="adjustments-section">
                <h4 className="section-title">Adjustments (Oct 2023)</h4>
                <div className="adjustment-grid">
                  <div className="adjustment-field">
                    <label>Bonus</label>
                    <div className="adjustment-input-wrapper">
                      <span className="currency-symbol positive">$</span>
                      <input
                        type="number"
                        value={selectedEmployee.bonus}
                        className="adjustment-input positive"
                        onChange={(e) =>
                          setSelectedEmployee({
                            ...selectedEmployee,
                            bonus: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="adjustment-field">
                    <label>Deductions</label>
                    <div className="adjustment-input-wrapper">
                      <span className="currency-symbol negative">$</span>
                      <input
                        type="number"
                        value={selectedEmployee.deductions}
                        className="adjustment-input negative"
                        onChange={(e) =>
                          setSelectedEmployee({
                            ...selectedEmployee,
                            deductions: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button className="update-btn">
                <Download size={16} />
                <span>Update Salary Details</span>
              </button>

              {/* Payslip Preview */}
              <div className="payslip-section">
                <div className="payslip-header">
                  <h4>Payslip Preview</h4>
                  <a className="download-link">
                    <Download size={14} />
                    <span>Download PDF</span>
                  </a>
                </div>

                <div className="payslip-preview">
                  <div className="payslip-border"></div>

                  <div className="payslip-title-section">
                    <div className="payslip-title">
                      <h5>EMS Portal</h5>
                      <p>PAYSLIP RECEIPT</p>
                    </div>
                    <div className="payslip-date">
                      <p>Oct 01 - Oct 31</p>
                      <p>2023</p>
                    </div>
                  </div>

                  <div className="payslip-details">
                    <div className="payslip-row">
                      <span className="payslip-label">Base Salary</span>
                      <span className="payslip-value base">
                        ${selectedEmployee.baseSalary.toLocaleString()}
                      </span>
                    </div>
                    <div className="payslip-row">
                      <span className="payslip-label">Bonus & Overtime</span>
                      <span className="payslip-value positive">
                        +${selectedEmployee.bonus.toLocaleString()}
                      </span>
                    </div>
                    <div className="payslip-row">
                      <span className="payslip-label">Tax & Deductions</span>
                      <span className="payslip-value negative">
                        -${selectedEmployee.taxDeductions.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="payslip-footer">
                    <div className="net-pay-row">
                      <span className="net-pay-label">NET PAY</span>
                      <span className="net-pay-amount">
                        ${selectedEmployee.netPay.toLocaleString()}
                      </span>
                    </div>
                    <div className="processing-badge">
                      <span>PROCESSING</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
       {/* <style>{`
        @media (min-width: 1120px) {
          .main-content {
            margin-left: 256px;
            width: calc(100% - 256px);
          }
        }
        @media (max-width: 1119px) {
          .main-content {
            margin-left: 0;
            width: 100%;
          }
        }
      `}</style> */}
    </div>
  );
}
