import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar.jsx";
import { employeeService } from "../../services/employeeServices.js";

export default function EmployeesList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([
    {
      id: "1",
      firstName: "Virat",
      personalEmail: "Virat@gmail.com",
      employeeId: "EMP-2026",
      position: "Routine Checkup",
      department: { name: "Quality Assurance" },
      status: "active",
      joiningDate: "2026-01-04"
    },
    {
      id: "2",
      firstName: "Neha",
      personalEmail: "Neha@gmail.com",
      employeeId: "EMP-2025",
      position: "Sales",
      department: { name: "Marketing" },
      status: "active",
      joiningDate: "2026-01-04"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const result = await employeeService.getAllEmployees();
      if (result && result.data) {
        setEmployees(result.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === "" || 
      (employee.firstName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (employee.personalEmail?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (employee.employeeId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (employee.position?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesDept = departmentFilter === "all" || 
      (employee.department?.name?.toLowerCase() || "") === departmentFilter.toLowerCase();
    
    const matchesStatus = statusFilter === "all" || 
      (employee.status?.toLowerCase() || "") === statusFilter.toLowerCase().replace(" ", "_");
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddEmployee = () => {
    navigate("/admin/employee/add");
  };

  const handleEmployeeClick = (employeeId) => {
    navigate(`/admin/employee/${employeeId}`);
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <AdminSidebar/>
      
      {/* Main Content Area */}
      <div className="main-content w-full">
        {/* Top Navigation */}
        <header className="bg-white border-b px-4 py-3">
          <div className="flex justify-end">
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <span className="material-symbols-outlined">help</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee List</h1>
                <p className="text-gray-600 mt-1">
                  {loading ? "Loading..." : `${filteredEmployees.length} employees found`}
                </p>
              </div>
              <button 
                onClick={handleAddEmployee}
                className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors w-full sm:w-auto justify-center"
              >
                <span className="material-symbols-outlined">add</span>
                Add Employee
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="space-y-4">
              {/* Search Input */}
              <div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by name, ID, email, or role..."
                />
              </div>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <select 
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1"
                >
                  <option value="all">All Departments</option>
                  <option value="quality assurance">Quality Assurance</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="engineering">Engineering</option>
                  <option value="hr">Human Resources</option>
                </select>

                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employee Table */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading employees...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <span className="material-symbols-outlined text-gray-400 text-4xl mb-3">search_off</span>
              <p className="text-gray-600">No employees found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-700 text-sm font-semibold">
                      <th className="p-4 pl-6">EMPLOYEE</th>
                      <th className="p-4">ID</th>
                      <th className="p-4">ROLE & DEPT</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4 pr-6">JOINED DATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredEmployees.map((employee) => (
                      <tr 
                        key={employee.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleEmployeeClick(employee.id)}
                      >
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {employee.firstName?.charAt(0) || 'E'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{employee.firstName}</p>
                              <p className="text-xs text-gray-500 mt-1">{employee.personalEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-gray-700 font-medium">{employee.employeeId}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">{employee.position}</p>
                            <p className="text-xs text-gray-500 mt-1">{employee.department?.name}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {employee.status === 'active' ? 'Active' : employee.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6">
                          <span className="text-gray-700">
                            {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CSS for responsive layout */}
      <style>{`
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
      `}</style>
    </div>
  );
}