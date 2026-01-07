import React, { useState } from "react";
import "../../assets/styles/SalaryManagementStyles/SalaryManagement.css";
import AdminSidebar from "../../Components/AdminSidebar";
const SalaryManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All");

  const employees = [
    {
      id: "#EMP-042",
      name: "Sarah Smith",
      role: "Sr. Product Designer",
      baseSalary: 8500.0,
      netPay: 7150.0,
      status: "Pending",
      avatar: "👩‍🦰",
      department: "Design Dept.",
      employmentType: "Full Time",
      bonus: 500,
      deductions: 150,
    },
    {
      id: "#EMP-043",
      name: "Michael Brown",
      role: "Engineering Lead",
      baseSalary: 10200.0,
      netPay: 8450.0,
      status: "Paid",
      avatar: "👨‍💼",
      department: "Engineering",
      employmentType: "Full Time",
      bonus: 600,
      deductions: 200,
    },
    {
      id: "#EMP-045",
      name: "Jason Doe",
      role: "Marketing Manager",
      baseSalary: 7800.0,
      netPay: 6450.0,
      status: "Pending",
      avatar: "👨",
      department: "Marketing",
      employmentType: "Full Time",
      bonus: 400,
      deductions: 180,
    },
    {
      id: "#EMP-048",
      name: "Emily Blunt",
      role: "HR Specialist",
      baseSalary: 6500.0,
      netPay: 5250.0,
      status: "Paid",
      avatar: "👩",
      department: "HR",
      employmentType: "Full Time",
      bonus: 300,
      deductions: 150,
    },
  ];

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div className="salary-app-container">
      {/* <AdminSidebar /> */}
      
      

      {/* Main Content */}
      <main className="salary-main-content">
        {/* Header */}
        <header className="salary-page-header">
          <div className="salary-breadcrumb">
            <span>Home</span>
            <span className="salary-breadcrumb-separator">›</span>
            <span>Payroll</span>
            <span className="salary-breadcrumb-separator">›</span>
            <span className="salary-breadcrumb-active">Salary Management</span>
          </div>
          <div className="salary-header-actions">
            <div className="salary-search-box">
              <span className="salary-search-icon">🔍</span>
              <input type="text" placeholder="Search..." />
            </div>
            <button className="salary-notification-btn">
              🔔
              <span className="salary-notification-badge">3</span>
            </button>
          </div>
        </header>

        {/* Page Title */}
        <div className="page-title-section">
          <div className="page-title-left">
            <h1 className="page-title">Salary Management</h1>
            <p className="page-subtitle">
              Manage employee roster, adjust bonuses, and process payroll
              cycles.
            </p>
          </div>
          <div className="page-title-actions">
            <button className="btn btn-secondary">
              <span className="btn-icon">⬇</span>
              Export Report
            </button>
            <button className="btn btn-primary">
              <span className="btn-icon">▶</span>
              Run Payroll
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-filter">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Filter by name, ID or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option>All Departments</option>
            <option>Design Dept.</option>
            <option>Engineering</option>
            <option>Marketing</option>
            <option>HR</option>
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>Status: All</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
        </div>

        {/* Employee Table */}
        <div className="main-table-container">
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
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    onClick={() => handleEmployeeClick(employee)}
                    className={
                      selectedEmployee?.id === employee.id ? "selected" : ""
                    }
                  >
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">{employee.avatar}</div>
                        <div className="employee-info">
                          <div className="employee-name">{employee.name}</div>
                          <div className="employee-id">ID: {employee.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="role-cell">{employee.role}</div>
                    </td>
                    <td>
                      <div className="salary-cell">
                        $
                        {employee.baseSalary.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </td>
                    <td>
                      <div className="netpay-cell">
                        $
                        {employee.netPay.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-${employee.status.toLowerCase()}`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn">⋮</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-footer">
              <div className="table-info">Showing 1-4 of 48 employees</div>
              <div className="pagination">
                <button className="pagination-btn">Prev</button>
                <button className="pagination-btn">Next</button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Employee Details */}
          {selectedEmployee && (
            <aside className="right-sidebar">
              <div className="righ-sidebar-child">
                <div className="employee-detail-header">
                  <div className="employee-detail-avatar">
                    {selectedEmployee.avatar}
                  </div>
                  <div className="employee-detail-info">
                    <div className="employee-detail-name">
                      {selectedEmployee.name}
                    </div>
                    <div className="employee-detail-dept">
                      {selectedEmployee.department} •{" "}
                      {selectedEmployee.employmentType}
                    </div>
                  </div>
                  <span className="status-badge-active">ACTIVE</span>
                </div>

                <div className="adjustments-section">
                  <h3 className="section-title">ADJUSTMENTS (OCT 2023)</h3>
                  <div className="adjustments-grid">
                    <div className="adjustment-item">
                      <div className="adjustment-label">Bonus</div>
                      <div className="adjustment-label">Deductions</div>
                    </div>
                    <div className="adjustment-item">
                      <div className="adjustment-value positive">
                        $ {selectedEmployee.bonus}
                      </div>
                      <div className="adjustment-value negative">
                        $ {selectedEmployee.deductions}
                      </div>
                    </div>
                  </div>
                </div>

                <button className="btn btn-update">
                  <span className="btn-icon">📄</span>
                  Update Salary Details
                </button>

                <div className="payslip-section">
                  <div className="payslip-header">
                    <h3 className="section-title">Payslip Preview</h3>
                    <button className="btn-download">
                      <span className="btn-icon">⬇</span>
                      Download PDF
                    </button>
                  </div>

                  <div className="payslip-card">
                    <div className="payslip-card-header">
                      <div className="payslip-title">EMS Portal</div>
                      <div className="payslip-period">
                        Oct 01 - Oct 31
                        <br />
                        <span className="payslip-year">2023</span>
                      </div>
                    </div>
                    <div className="payslip-label">PAYSLIP RECEIPT</div>

                    <div className="payslip-line">
                      <span className="payslip-line-label">Base Salary</span>
                      <span className="payslip-line-value">
                        $
                        {selectedEmployee.baseSalary.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <div className="payslip-line">
                      <span className="payslip-line-label">
                        Bonus & Overtime
                      </span>
                      <span className="payslip-line-value positive">
                        +${selectedEmployee.bonus}.00
                      </span>
                    </div>

                    <div className="payslip-line">
                      <span className="payslip-line-label">
                        Tax & Deductions
                      </span>
                      <span className="payslip-line-value negative">
                        -$1,850.00
                      </span>
                    </div>

                    <div className="payslip-total">
                      <div className="payslip-total-label">NET PAY</div>
                      <div className="payslip-total-value">
                        $
                        {selectedEmployee.netPay.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>

                    <div className="payslip-status">
                      <span className="status-badge-processing">
                        PROCESSING
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}
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
};

export default SalaryManagement;
