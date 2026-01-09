import React, { useState , useEffect} from "react";
import {
  Search,
  Bell,
  Download,
  PlayCircle,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import "../../assets/styles/SalaryManagementStyles/SalaryManagement.css";
import { Calendar} from 'lucide-react';

import AdminSidebar from "../../Components/AdminSidebar";
import { salaryService } from "../../services/salaryServices";
import { capitalize } from "../../utils/helper";

export default function SalaryManagement() {
  const [selectedEmployee, setSelectedEmployee] = useState({});

const [employees , setEmployees] = useState([]);


   useEffect(() => {
      fetchEmployeesSalary();
    }, []);
  
    const fetchEmployeesSalary = async () => {
      try {
        
        const result = await salaryService.getEmployeesSalary();
        console.log(result);
        if (result && result.data && result.success) {
          setEmployees(result.data);
          setSelectedEmployee(result.data[0]);
        }
        // setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        
      }
    };

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
            {/* <span className="breadcrumb-item active">Salary Management</span> */}
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
                  
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr
                      key={emp.employee._id}
                      className={
                        selectedEmployee.employee.id === emp.employee.id ? "selected" : ""
                      }
                      onClick={() =>
                        setSelectedEmployee({
  ...emp,
  type: emp?.employee?.jobType || "Full time",
  status: emp?.employee?.status,
  allowances: emp?.allowances,
  deductions: emp?.deductions,
  netSalary: (
    (parseFloat(emp?.baseSalary) || 0) +
    (parseFloat(emp?.allowances) || 0) -
    (parseFloat(emp?.deductions) || 0) -
    ((parseFloat(emp?.baseSalary) || 0) * (parseFloat(emp?.taxApply) || 0) / 100)
  ).toFixed(2)
})
                      }
                    >
                      <td>
                        <div className="employee-info">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {capitalize(selectedEmployee?.employee?.firstName?.charAt(0)) || 'E'}
                            </div>
                          <div className="employee-details">
                            
                            <div className="name">{capitalize(emp?.employee?.firstName + " " + emp?.employee?.lastName)}</div>
                            <div className="id">ID: {emp.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="role-text">{emp.employee.position}</div>
                      </td>
                      <td>
                        <div className="salary-text">
                          ${emp.baseSalary.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div className="salary-text">
                          ${emp?.netSalary.toLocaleString() || 0}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            emp?.Status === "due"
                              ? "status-pending"
                              : "status-paid"
                          }`}
                        >
                          {capitalize(emp?.Status)}
                        </span>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {/* <div className="pagination">
              <div className="pagination-info">Showing 1-4 of 48 employees</div>
              <div className="pagination-buttons">
                <button className="pagination-btn">Prev</button>
                <button className="pagination-btn">Next</button>
              </div>
            </div> */}
          </div>

          {/* Employee Detail Panel */}
          <div className="card">
            {employees.length ===  0 ? <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No payroll record</h3>
                  <p className="text-gray-500">There are currently no payroll  to display.</p>
                </div>
              </div>  : 

            <div className="detail-panel">
              {/* Employee Header */}
              <div className="employee-header">
                <div className="employee-header-info">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {capitalize(selectedEmployee?.employee?.firstName?.charAt(0) || 'E')}
                            </div>
                  <div className="employee-header-details">
                    <h3>{capitalize(selectedEmployee?.employee?.firstName + " " + selectedEmployee?.employee?.lastName)}</h3>
                    <p>
                      {capitalize(selectedEmployee?.employee?.position)} • {capitalize(selectedEmployee?.employee?.jobType)}
                    </p>
                  </div>
                </div>
                <span className="status-active">{capitalize(selectedEmployee?.employee?.status)}</span>
              </div>

              {/* Adjustments */}
              <div className="adjustments-section">
                <h4 className="section-title">Adjustments ({selectedEmployee?.month} 2026)</h4>
                <div className="adjustment-grid">
                  <div className="adjustment-field">
                    <label>Allowances</label>
                    <div className="adjustment-input-wrapper">
                      <span className="currency-symbol positive">$ {selectedEmployee?.allowances}</span>
                
                    </div>
                  </div>
                  <div className="adjustment-field">
                    <label>Deductions</label>
                    <div className="adjustment-input-wrapper">
                      <span className="currency-symbol negative">$ {selectedEmployee?.deductions}
</span>
            
                    </div>
                  </div>
                </div>
              </div>

              <button className="update-btn">
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
                      <p>{selectedEmployee?.month || "no data"}</p>
                    </div>
                  </div>

                  <div className="payslip-details">
                    <div className="payslip-row">
                      <span className="payslip-label">Base Salary</span>
                      <span className="payslip-value base">
                        ${selectedEmployee?.baseSalary?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="payslip-row">
                      <span className="payslip-label">Bonus & Allowances</span>
                      <span className="payslip-value positive">
                        +${selectedEmployee?.allowances?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="payslip-row">
                      <span className="payslip-label">Tax & Deductions</span>
                      <span className="payslip-value negative">
                        $ {-((parseFloat(selectedEmployee?.baseSalary) || 0) * (parseFloat(selectedEmployee?.taxApply) || 0) / 100).toFixed(2) + (selectedEmployee?.deductions || 0)},

                      </span>
                    </div>
                  </div>

                  <div className="payslip-footer">
                    <div className="net-pay-row">
                      <span className="net-pay-label">NET PAY</span>
                      <span className="net-pay-amount">
                        ${selectedEmployee?.netSalary?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="processing-badge">
                      <span>$ {capitalize(selectedEmployee?.Status || "no data")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
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
