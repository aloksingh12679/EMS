
import { useEffect, useState } from "react";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  ListTodo, 
  Plus, 
  X,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Building2,
  UserCircle
} from "lucide-react";
import { employeeService } from "../../../services/employeeServices";
import AdminSidebar from "../../../Components/AdminSidebar";
import { useAuth } from "../../../context/AuthContext";

export default function Tasks() {
  const [departmentDetails, setDepartmentDetails] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const { user } = useAuth();
  const [role , setRole] = useState();

  // New Task Form
  const [newTask, setNewTask] = useState({
    taskName: "",
    description: "",
    employeeId: "",
    status: "pending",
    priority: "medium",
    startDate: "",
    dueDate: ""
  });

  useEffect(() => {
    getDepartmentTasks();
  }, []);

  const getDepartmentTasks = async () => {
    try {
      setIsLoading(true);
      const result = await employeeService.getDepartmentTasks();
      console.log(result);
      setRole(result.data.role);
      
      if (result.data.role === "Department Head") {
        if (result && result.data) {
          setDepartmentDetails(result.data.departmentDetails);
          
          const employeesWithTasks = result.data.departmentEmployees.map(emp => {
            const employeeTasks = result.data.departmentTasks.filter(
              task => task.employee === emp._id
            );
            
            return {
              ...emp,
              tasks: employeeTasks.map(task => ({
                id: task._id,
                taskName: task.taskName,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                dueDate: task.dueDate,
                createdAt: task.createdAt
              }))
            };
          });
          
          setEmployees(employeesWithTasks);
        }
      } else if (result.data.role === "Admin") {
        console.log(result);
        if (result && result.data) {
          setDepartments(result.data.departmentDetails || []);
          setEmployees(result.data.departmentEmployees || []);
          setAllTasks(result.data.departmentTasks || []);
        }
      }
    } catch (err) {
      console.log("Get department Tasks", err);
      showToast("Failed to load department tasks", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.taskName || !newTask.description || !newTask.employeeId || 
        !newTask.startDate || !newTask.dueDate) {
      showToast("Please fill all required fields", "error");
      return;
    }
    
    try {
      const result = await employeeService.addTask(newTask.employeeId, newTask);
      if (result && result.success) {
        showToast("Task added successfully!", "success");
        setShowAddTaskModal(false);
        setNewTask({
          taskName: "",
          description: "",
          employeeId: "",
          status: "pending",
          priority: "medium",
          startDate: "",
          dueDate: ""
        });
        setSelectedEmployee(null);
        getDepartmentTasks();
      }
    } catch (err) {
      console.log("Error adding task:", err);
      showToast("Failed to add task", "error");
    }
  };

  const getTaskStats = (employee) => {
    const tasks = employee.tasks || [];
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === "completed").length,
      pending: tasks.filter(t => t.status === "pending").length
    };
  };

  const getTotalStats = () => {
    let total = 0, completed = 0, pending = 0;
    
    employees.forEach(emp => {
      const stats = getTaskStats(emp);
      total += stats.total;
      completed += stats.completed;
      pending += stats.pending;
    });
    
    return { 
      total, 
      completed, 
      pending,
      totalEmployees: employees.length 
    };
  };

  const getDepartmentStats = (deptId) => {
    const deptEmployees = employees.filter(emp => emp.department === deptId);
    const deptTasks = allTasks.filter(task => 
      deptEmployees.some(emp => emp._id === task.employee)
    );
    
    return {
      totalEmployees: deptEmployees.length,
      totalTasks: deptTasks.length,
      completed: deptTasks.filter(t => t.status === "completed").length,
      pending: deptTasks.filter(t => t.status === "pending").length
    };
  };

  const getDepartmentHead = (dept) => {
    if (dept.manager) {
      return `${dept.manager.firstName} ${dept.manager.lastName}`;
    }
    return "Not Allocated";
  };

  const filteredTasks = selectedEmployee?.tasks?.filter(task => {
    if (filterStatus === "All") return true;
    return task.status === filterStatus.toLowerCase();
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="lg:ml-64 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Admin View - Department Cards
  if (role === "Admin") {
    return (
      <>
        {/* Toast */}
        {toast.show && (
          <div className={`fixed top-4 right-4 z-50 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 animate-slideIn max-w-[90%] sm:max-w-md`}>
            <span className="text-xs sm:text-sm">{toast.message}</span>
            <button onClick={() => setToast({ show: false, message: "", type: "" })}>
              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        )}

        <div className="min-h-screen bg-gray-50">
          <AdminSidebar />
          
          <div className="lg:ml-64 p-3 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-5 sm:mb-6">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Department Tasks Overview
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Manage tasks across all departments
              </p>
            </div>

            {/* Department Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {departments.map((dept) => {
                const stats = getDepartmentStats(dept._id);
                
                return (
                  <div
                    key={dept._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all p-4 sm:p-5 border-2 border-gray-200 hover:border-blue-400"
                  >
                    {/* Department Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                            {dept.name}
                          </h3>
                          <p className="text-xs text-gray-500">{dept.code}</p>
                        </div>
                      </div>
                    </div>

                    {/* Department Head */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2 text-sm">
                        <UserCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Head:</span>
                        <span className={`font-semibold ${dept.manager ? 'text-gray-900' : 'text-orange-600'}`}>
                          {getDepartmentHead(dept)}
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-gray-900">{stats.totalEmployees}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">Employees</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <ListTodo className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-gray-900">{stats.totalTasks}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">Total Tasks</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-green-600">{stats.completed}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">Completed</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 text-center">
                        <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-orange-600">{stats.pending}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">Pending</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
          
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </>
    );
  }

  const totalStats = getTotalStats();

  return (
    <>
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 ${
          toast.type === "error" ? "bg-red-500" : "bg-green-500"
        } text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 animate-slideIn max-w-[90%] sm:max-w-md`}>
          <span className="text-xs sm:text-sm">{toast.message}</span>
          <button onClick={() => setToast({ show: false, message: "", type: "" })}>
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-3 sm:p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Add New Task</h3>
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Task Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTask.taskName}
                  onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task name"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Assign To <span className="text-red-500">*</span>
                </label>
                <select
                  value={newTask.employeeId}
                  onChange={(e) => setNewTask({ ...newTask, employeeId: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["low", "medium", "high"].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setNewTask({ ...newTask, priority })}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm capitalize transition-all ${
                        newTask.priority === priority
                          ? priority === "high"
                            ? "bg-red-600 text-white"
                            : priority === "medium"
                            ? "bg-orange-600 text-white"
                            : "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                    className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    min={newTask.startDate}
                    className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        
        <div className="lg:ml-64 p-3 sm:p-6 lg:p-8">
          {!selectedEmployee ? (
            <>
              {/* Header */}
              <div className="text-center mb-5 sm:mb-6">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {departmentDetails?.name || "Department"} Tasks
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Managed by {departmentDetails?.manager?.firstName} {departmentDetails?.manager?.lastName}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 text-center">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                    {totalStats.totalEmployees}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Employees</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 text-center">
                  <ListTodo className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                    {totalStats.total}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Total Tasks</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 text-center">
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1">
                    {totalStats.completed}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Completed</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 text-center">
                  <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1">
                    {totalStats.pending}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Pending</p>
                </div>
              </div>

              {/* Employee Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-3 sm:p-4 border-b">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Department Employees
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Total Tasks
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Completed
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Pending
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {employees.map((employee) => {
                        const stats = getTaskStats(employee);
                        
                        return (
                          <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                                  {employee.firstName.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {employee.firstName} {employee.lastName}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {employee.employeeId} • {employee.position}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-base font-bold text-gray-900">{stats.total}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-base font-bold text-green-600">{stats.completed}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-base font-bold text-orange-600">{stats.pending}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => setSelectedEmployee(employee)}
                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                View Tasks
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 sm:mb-5 font-semibold text-sm sm:text-base hover:gap-3 transition-all"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                Back to Employees
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b-2">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg sm:text-xl lg:text-2xl">
                    {selectedEmployee.firstName.charAt(0)}
                  </div>
                  
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                      {selectedEmployee.employeeId} • {selectedEmployee.position}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setNewTask({ ...newTask, employeeId: selectedEmployee._id });
                    setShowAddTaskModal(true);
                  }}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2 text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
                >
                  <Plus size={18} className="sm:w-5 sm:h-5" />
                  Add Task
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center hover:bg-gray-100 transition-colors">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{getTaskStats(selectedEmployee).total}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Total</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center hover:bg-green-100 transition-colors">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{getTaskStats(selectedEmployee).completed}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Done</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 sm:p-4 text-center hover:bg-orange-100 transition-colors">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600">{getTaskStats(selectedEmployee).pending}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Pending</p>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6">
                {["All", "Pending", "Completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                      filterStatus === status
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="space-y-3 sm:space-y-4">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-10 sm:py-12 text-gray-500">
                    <AlertCircle size={40} className="sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-30" />
                    <p className="text-sm sm:text-base">No {filterStatus.toLowerCase()} tasks</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all hover:border-blue-300"
                    >
                      <div className="flex justify-between items-start mb-2 sm:mb-3">
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base flex-1 leading-tight">{task.taskName}</h4>
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ml-2 whitespace-nowrap ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </div>
                      
                      <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3 ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </span>
                      
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 leading-relaxed">{task.description}</p>
                      
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="flex-shrink-0" />
                          <span className="font-medium">Start: {new Date(task.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="flex-shrink-0" />
                          <span className="font-medium">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}