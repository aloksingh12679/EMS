import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Download,
  PlayCircle,
  ChevronDown,
  MoreVertical,
  X,
  Play,
} from "lucide-react";
import jsPDF from "jspdf";
import "../../assets/styles/SalaryManagementStyles/SalaryManagement.css";
import { Calendar } from "lucide-react";

import AdminSidebar from "../../Components/AdminSidebar";
import { salaryService } from "../../services/salaryServices";
import { capitalize } from "../../utils/helper";

export default function SalaryManagement() {
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRunPayrollModal, setShowRunPayrollModal] = useState(false);
  const [isRunningPayroll, setIsRunningPayroll] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    baseSalary: "",
    allowances: "",
    taxApply: "",
    deductions: "",
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const handleUpdateClick = () => {
    setUpdateFormData({
      id: selectedEmployee?._id,
      baseSalary: selectedEmployee?.baseSalary || "",
      allowances: selectedEmployee?.allowances || "",
      taxApply: selectedEmployee?.taxApply || "",
      deductions: selectedEmployee?.deductions || "",
    });
    setShowUpdateModal(true);
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({
      ...updateFormData,
      [name]: value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseSalary = parseFloat(updateFormData.baseSalary) || 0;
      const allowances = parseFloat(updateFormData.allowances) || 0;
      const deductions = parseFloat(updateFormData.deductions) || 0;
      const taxApply = parseFloat(updateFormData.taxApply) || 0;

      const taxAmount = (baseSalary * taxApply) / 100;
      const netSalary = baseSalary + allowances - deductions - taxAmount;

      const updateData = {
        ...updateFormData,
        netSalary: netSalary.toFixed(2),
      };

      const updatedEmployees = employees.map((emp) =>
        emp._id === selectedEmployee._id ? { ...emp, ...updateData } : emp
      );
      const response = await salaryService.updateEmployeeSalary(updateData);
      if (response.success) {
        setEmployees(updatedEmployees);
        setSelectedEmployee({ ...selectedEmployee, ...updateData });

        showToast("Salary updated successfully!", "success");
        setShowUpdateModal(false);
      }
    } catch (error) {
      console.error("Error updating salary:", error);
      showToast("Failed to update salary", "error");
    }
  };

  const handleRunPayroll = async () => {
    setIsRunningPayroll(true);

    try {
      const dueEmployees = employees.filter(
        (emp) => emp.Status.toLowerCase() === "due"
      );

      if (dueEmployees.length === 0) {
        showToast("No employees with 'due' status found", "error");
        setIsRunningPayroll(false);
        setShowRunPayrollModal(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedEmployees = employees.map((emp) =>
        emp.Status.toLowerCase() === "due"
          ? { ...emp, Status: "Processing" }
          : emp
      );

      const response = await salaryService.runEmployeePayroll();
      if (response.success) {
        setEmployees(updatedEmployees);

        if (selectedEmployee.Status?.toLowerCase() === "due") {
          setSelectedEmployee({ ...selectedEmployee, Status: "Processing" });
        }

        showToast(
          `Payroll processed for ${dueEmployees.length} employee(s)!`,
          "success"
        );
      }
      setShowRunPayrollModal(false);
    } catch (error) {
      console.error("Error running payroll:", error);
      showToast("Failed to run payroll", "error");
    } finally {
      setIsRunningPayroll(false);
    }
  };

  // Download Payslip Function
  const handleDownloadPayslip = () => {
    if (!selectedEmployee || !selectedEmployee.employee) {
      showToast("No employee selected", "error");
      return;
    }

    try {
      const doc = new jsPDF();

      // Set font
      doc.setFont("helvetica");

      // Header Background
      doc.setFillColor(15, 23, 41); // #0F1729
      doc.rect(0, 0, 210, 40, "F");

      // Company Logo/Name
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("Graphura EMS Portal", 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("PAYSLIP RECEIPT", 105, 30, { align: "center" });

      // Employee Details Section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Employee Details", 20, 55);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const employeeName = `${capitalize(
        selectedEmployee?.employee?.firstName || ""
      )} ${capitalize(selectedEmployee?.employee?.lastName || "")}`;
      doc.text(`Name: ${employeeName}`, 20, 65);
      doc.text(`Employee ID: ${selectedEmployee?.employeeId || "N/A"}`, 20, 72);
      doc.text(
        `Position: ${capitalize(
          selectedEmployee?.employee?.position || "N/A"
        )}`,
        20,
        79
      );
      doc.text(
        `Department: ${capitalize(
          selectedEmployee?.employee?.department || "N/A"
        )}`,
        20,
        86
      );

      // Payment Period
      doc.text(
        `Payment Period: ${selectedEmployee?.month || "N/A"} 2026`,
        120,
        65
      );
      doc.text(
        `Payment Date: ${new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`,
        120,
        72
      );
      doc.text(
        `Status: ${capitalize(selectedEmployee?.Status || "N/A")}`,
        120,
        79
      );

      // line drawing
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 95, 190, 95);

      // Earnings Section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Earnings", 20, 105);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      const baseSalary = parseFloat(selectedEmployee?.baseSalary) || 0;
      const allowances = parseFloat(selectedEmployee?.allowances) || 0;

      doc.text("Base Salary", 20, 115);
      doc.text(
        `$${baseSalary.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        190,
        115,
        { align: "right" }
      );

      doc.text("Allowances & Bonuses", 20, 122);
      doc.text(
        `$${allowances.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        190,
        122,
        { align: "right" }
      );

      // Separator Line
      doc.line(20, 130, 190, 130);

      // Deductions Section
      doc.setFont("helvetica", "bold");
      doc.text("Deductions", 20, 140);

      doc.setFont("helvetica", "normal");

      const taxApply = parseFloat(selectedEmployee?.taxApply) || 0;
      const taxAmount = (baseSalary * taxApply) / 100;
      const deductions = parseFloat(selectedEmployee?.deductions) || 0;

      doc.text(`Tax (${taxApply}%)`, 20, 150);
      doc.text(
        `$${taxAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        190,
        150,
        { align: "right" }
      );

      doc.text("Other Deductions", 20, 157);
      doc.text(
        `$${deductions.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        190,
        157,
        { align: "right" }
      );

      // Separator Line
      doc.line(20, 165, 190, 165);

      // Net Pay Section
      const netSalary = parseFloat(selectedEmployee?.netSalary) || 0;

      doc.setFillColor(240, 240, 240);
      doc.rect(20, 172, 170, 15, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("NET PAY", 25, 182);
      doc.setFontSize(14);
      doc.text(
        `$${netSalary.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        185,
        182,
        { align: "right" }
      );

      // Footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "This is a computer-generated payslip and does not require a signature.",
        105,
        200,
        { align: "center" }
      );
      doc.text("For any queries, please contact HR department.", 105, 206, {
        align: "center",
      });

      // Bottom line
      doc.setDrawColor(15, 23, 41);
      doc.setLineWidth(0.5);
      doc.line(20, 215, 190, 215);

      doc.setFontSize(7);
      doc.text("© 2026 EMS Portal - Enterprise Management System", 105, 220, {
        align: "center",
      });

      // Save the PDF
      const fileName = `Payslip_${employeeName.replace(/\s+/g, "_")}_${
        selectedEmployee?.month || "Unknown"
      }_2026.pdf`;
      doc.save(fileName);

      showToast("Payslip downloaded successfully!", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast("Failed to download payslip", "error");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    let matchesSearch = true;
    if (searchQuery !== "") {
      const searchLower = searchQuery.toLowerCase();
      const fullName =
        `${emp.employee.firstName} ${emp.employee.lastName}`.toLowerCase();
      const employeeId = emp.employeeId.toLowerCase();
      const position = emp.employee.position.toLowerCase();

      matchesSearch =
        fullName.includes(searchLower) ||
        employeeId.includes(searchLower) ||
        position.includes(searchLower);
    }

    const matchesStatus =
      selectedStatus === "All" ||
      emp.Status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const statusOptions = ["All", "Paid", "Due", "Processing"];
  const dueCount = employees.filter(
    (emp) => emp.Status.toLowerCase() === "due"
  ).length;

  return (
    <div className="salary-management">
      <AdminSidebar />

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px]`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              toast.type === "error" ? "bg-red-300" : "bg-green-300"
            }`}
          ></div>
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, message: "", type: "" })}
            className="ml-auto text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Run Payroll Confirmation Modal */}
      {showRunPayrollModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Run Payroll</h3>
              <button
                onClick={() => setShowRunPayrollModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isRunningPayroll}
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <PlayCircle className="text-blue-600" size={32} />
              </div>
              <p className="text-center text-gray-600 mb-4">
                You are about to process payroll for{" "}
                <strong>{dueCount} employee(s)</strong> with "Due" status.
              </p>
              <p className="text-center text-sm text-gray-500">
                This will change their status from "Due" to "Processing"
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowRunPayrollModal(false)}
                disabled={isRunningPayroll}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRunPayroll}
                disabled={isRunningPayroll}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-400 flex items-center justify-center gap-2"
              >
                {isRunningPayroll ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Run Payroll
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Salary Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Update Salary Details of {selectedEmployee?.employeeId || ""}
              </h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Base Salary ($)
                </label>
                <input
                  type="number"
                  name="baseSalary"
                  value={updateFormData.baseSalary}
                  onChange={handleUpdateFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Allowances ($)
                </label>
                <input
                  type="number"
                  name="allowances"
                  value={updateFormData.allowances}
                  onChange={handleUpdateFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tax (%)
                </label>
                <input
                  type="number"
                  name="taxApply"
                  value={updateFormData.taxApply}
                  onChange={handleUpdateFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deductions ($)
                </label>
                <input
                  type="number"
                  name="deductions"
                  value={updateFormData.deductions}
                  onChange={handleUpdateFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Calculated Net Salary Preview */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">
                  Calculated Net Salary:
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  $
                  {(
                    (parseFloat(updateFormData.baseSalary) || 0) +
                    (parseFloat(updateFormData.allowances) || 0) -
                    (parseFloat(updateFormData.deductions) || 0) -
                    ((parseFloat(updateFormData.baseSalary) || 0) *
                      (parseFloat(updateFormData.taxApply) || 0)) /
                      100
                  ).toFixed(2)}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Update Salary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <nav className="breadcrumb"></nav>
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
        <div className="title-section">
          <div className="title-info">
            <h1>Salary Management</h1>
            <div className="title-info-para">
              <p>
                Manage employee roster, adjust bonuses, and process payroll
                cycles.
              </p>
            </div>
          </div>

          {/* Run Payroll Button */}
          <button
            onClick={() => setShowRunPayrollModal(true)}
            className="run-payroll hover:bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold flex items-center gap-2"
            disabled={dueCount === 0}
          >
            <PlayCircle size={20} />
            Run Payroll ({dueCount})
          </button>
        </div>

        <div className="content-grid">
          {/* Employee Table */}
          <div className="card">
            <div className="filter-section">
              <div className="filter-container">
                <div className="filter-input-wrapper">
                  <Search className="filter-icon" size={20} />
                  <input
                    type="text"
                    placeholder="Filter by name, ID or role..."
                    className="filter-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div
                  className="filter-select"
                  style={{ position: "relative", cursor: "pointer" }}
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  <span>Status: {selectedStatus}</span>
                  <ChevronDown size={16} />

                  {showStatusDropdown && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        marginTop: "4px",
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        zIndex: 1000,
                        overflow: "hidden",
                      }}
                    >
                      {statusOptions.map((status) => (
                        <div
                          key={status}
                          style={{
                            padding: "10px 16px",
                            cursor: "pointer",
                            backgroundColor:
                              selectedStatus === status ? "#f3f4f6" : "white",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#f9fafb")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor =
                              selectedStatus === status ? "#f3f4f6" : "white")
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStatus(status);
                            setShowStatusDropdown(false);
                          }}
                        >
                          {status}
                        </div>
                      ))}
                    </div>
                  )}
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
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: "center", padding: "40px" }}
                      >
                        <div style={{ color: "#666" }}>
                          <Search
                            size={48}
                            style={{ opacity: 0.3, margin: "0 auto 16px" }}
                          />
                          <p>No employees found matching your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr
                        key={emp._id}
                        className={
                          selectedEmployee._id === emp._id ? "selected" : ""
                        }
                        style={{
                          backgroundColor:
                            selectedEmployee._id === emp._id
                              ? "#dbeafe"
                              : "transparent",
                          cursor: "pointer",
                        }}
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
                              ((parseFloat(emp?.baseSalary) || 0) *
                                (parseFloat(emp?.taxApply) || 0)) /
                                100
                            ).toFixed(2),
                          })
                        }
                      >
                        <td>
                          <div className="employee-info">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {capitalize(
                                emp?.employee?.firstName?.charAt(0)
                              ) || "E"}
                            </div>
                            <div className="employee-details">
                              <div className="name">
                                {capitalize(
                                  emp?.employee?.firstName +
                                    " " +
                                    emp?.employee?.lastName
                                )}
                              </div>
                              <div className="id">ID: {emp.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="role-text">
                            {capitalize(emp?.employee?.position)}
                          </div>
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
                              emp?.Status.toLowerCase() === "due"
                                ? "status-pending"
                                : emp?.Status.toLowerCase() === "processing"
                                ? "status-processing"
                                : "status-paid"
                            }`}
                          >
                            {capitalize(emp?.Status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Employee Detail Panel */}
          <div className="card">
            {employees.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No payroll record
                  </h3>
                  <p className="text-gray-500">
                    There are currently no payroll to display.
                  </p>
                </div>
              </div>
            ) : (
              <div className="detail-panel">
                {/* Employee Header */}
                <div className="employee-header">
                  <div className="employee-header-info">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {capitalize(
                        selectedEmployee?.employee?.firstName?.charAt(0) || "E"
                      )}
                    </div>
                    <div className="employee-header-details">
                      <h3>
                        {capitalize(
                          selectedEmployee?.employee?.firstName +
                            " " +
                            selectedEmployee?.employee?.lastName
                        )}
                      </h3>
                      <p>
                        {capitalize(selectedEmployee?.employee?.position)} •{" "}
                        {capitalize(selectedEmployee?.employee?.jobType)}
                      </p>
                    </div>
                  </div>
                  <span className="status-active">
                    {capitalize(selectedEmployee?.employee?.status)}
                  </span>
                </div>

                {/* Adjustments */}
                <div className="adjustments-section">
                  <h4 className="section-title">
                    Adjustments ({selectedEmployee?.month} 2026)
                  </h4>
                  <div className="adjustment-grid">
                    <div className="adjustment-field">
                      <label>Allowances</label>
                      <div className="adjustment-input-wrapper">
                        <span className="currency-symbol positive">
                          $ {selectedEmployee?.allowances || 0}
                        </span>
                      </div>
                    </div>
                    <div className="adjustment-field">
                      <label>Deductions</label>
                      <div className="adjustment-input-wrapper">
                        <span className="currency-symbol negative">
                          $ {selectedEmployee?.deductions || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="update-btn" onClick={handleUpdateClick}>
                  <span>Update Salary Details</span>
                </button>

                {/* Payslip Preview */}
                <div className="payslip-section">
                  <div className="payslip-header">
                    <h4>Payslip Preview</h4>
                    <button
                      onClick={handleDownloadPayslip}
                      className="download-link"
                      style={{
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                      }}
                    >
                      <Download size={14} />
                      <span>Download PDF</span>
                    </button>
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
                        <span className="payslip-label">
                          Bonus & Allowances
                        </span>
                        <span className="payslip-value positive">
                          +$
                          {selectedEmployee?.allowances?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="payslip-row">
                        <span className="payslip-label">Tax & Deductions</span>
                        <span className="payslip-value negative">
                          $-{" "}
                          {(
                            ((parseFloat(selectedEmployee?.baseSalary) || 0) *
                              (parseFloat(selectedEmployee?.taxApply) || 0)) /
                              100 +
                            (parseFloat(selectedEmployee?.deductions) || 0)
                          ).toFixed(2)}
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
                        <span>
                          {capitalize(selectedEmployee?.Status || "no data")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
