import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';
import EmployeesSidebar from '../../Components/EmployeesSidebar';
import { employeeService } from '../../services/employeeServices';

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      const response = await employeeService.getTasks();
      console.log(response);
      if(response.success){
setTasks(response.data.taskDetails);
      }

      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      // Update UI optimistically
      setTasks(tasks.map(task => 
        task._id === taskId 
          ? { ...task, status: 'Completed' }
          : task
      ));

      // Call API to update task status
    const response =  await employeeService.updateTask(taskId);

      console.log(response);
      if(response.success){
        
        console.log("updated task");
        fetchTasks();
      }
    } catch (error) {
      console.error('Error completing task:', error);
      
      fetchTasks();
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle2 size={16} className="text-green-600" />;
      case 'in progress':
        return <Clock size={16} className="text-blue-600" />;
      case 'pending':
        return <Circle size={16} className="text-yellow-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };
//   const gettaskStatusColor = (status) => {
//   switch (status?.toLowerCase()) {
//     case 'completed':
//       return '#10b981'; // green
//     case 'in progress':
//       return '#3b82f6'; // blue
//     case 'pending':
//       return '#f59e0b'; // amber
//     default:
//       return '#6b7280'; // gray
//   }
// };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      searchQuery === "" ||
      task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "All" ||
      task.status === filterStatus;
    
    const matchesPriority = 
      filterPriority === "All" ||
      task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-[#f6f8fb] font-sans">
      {/* Sidebar placeholder */}
    
 
  
    <EmployeesSidebar />
  

  {/* Main Content - Shifts right on desktop to accommodate sidebar */}
  <main className="min-h-screen p-4 sm:p-6 lg:p-10 min-[1112px]:ml-64">
    {/* Header */}
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        {/* Mobile Menu Button */}
        
        
        <h1 className="text-2xl text-center sm:text-3xl ml-10 font-bold text-gray-900">My Tasks</h1>
      </div>
      <p className="text-sm sm:text-base text-gray-500 ml-0 min-[1112px]:ml-0">
        Manage and track your assigned tasks
      </p>
    </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={handleCompleteTask}
                formatDate={formatDate}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {!loading && filteredTasks.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                <p className="text-sm text-gray-500">Total Tasks</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {tasks.filter(t => t.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {tasks.filter(t => t.status === 'In Progress').length}
                </p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Task Card Component
const TaskCard = ({ task, onComplete, formatDate, getPriorityColor, getStatusColor, getStatusIcon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{task?.taskName}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{task?.description}</p>
        </div>
      </div>

      {/* Priority & Status */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
          {task.priority} Priority
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(task.status)}`}>
          {getStatusIcon(task.status)}
          {task.status}
        </span>
      </div>

      {/* Dates */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} className="text-gray-400" />
          <span className="font-medium">Start:</span>
          <span>{formatDate(task?.startDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} className="text-gray-400" />
          <span className="font-medium">End:</span>
          <span>{formatDate(task?.dueDate)}</span>
        </div>
      </div>

      {/* Complete Button */}
      {task.status !== 'completed' && (
        <button
          onClick={() => onComplete(task._id)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <CheckCircle2 size={18} />
          Mark as Completed
        </button>
      )}

      {task.status === 'completed' && (
        <div className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
          <CheckCircle2 size={18} />
          Task Completed
        </div>
      )}
    </div>
  );
};