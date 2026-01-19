import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  Filter,
  Search,
  ChevronDown,
  Target,
  TrendingUp,
  ListTodo,
  Sparkles,
  Activity,
  BarChart3,
  ClipboardList,
  FolderKanban,
  Zap,
  Award,
  TrendingDown,
  PlayCircle
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
    <div className="min-h-screen bg-white font-sans">
      {/* Sidebar placeholder */}
    
 
  
    <EmployeesSidebar />
  

  {/* Main Content - Shifts right on desktop to accommodate sidebar */}
  <main className="min-h-screen p-4 sm:p-6 lg:p-10 min-[1112px]:ml-64 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
    {/* Header Section with Gradient */}
    <div className="mb-8">
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-3xl p-8 mb-6 shadow-2xl relative overflow-hidden transform transition-all hover:shadow-blue-500/20 group">
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-700/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:rotate-2 transition-transform duration-300">
              <FolderKanban size={32} className="text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">My Tasks</h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-blue-50 drop-shadow-md flex items-center gap-2">
            <Zap size={20} className="text-yellow-300 animate-bounce" />
            Manage and track your assigned tasks with ease
          </p>
        </div>
      </div>
    </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-6 mb-8 transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-2.5 rounded-xl transition-transform duration-500">
              <Filter size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Filter Tasks</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Search */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-blue-600 to-blue-400 p-1.5 rounded-lg transition-all duration-300">
                <Search className="text-white" size={16} />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white transition-all duration-200 font-medium"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ClipboardList size={18} className="text-blue-600" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white transition-all duration-200 font-medium text-gray-700 appearance-none cursor-pointer"
              >
                <option value="All">📋 All Status</option>
                <option value="Pending">⏳ Pending</option>
                <option value="In Progress">🔄 In Progress</option>
                <option value="Completed">✅ Completed</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Award size={18} className="text-blue-600" />
              </div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white transition-all duration-200 font-medium text-gray-700 appearance-none cursor-pointer"
              >
                <option value="All">🎯 All Priority</option>
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🟢 Low Priority</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FolderKanban size={24} className="text-blue-600 animate-pulse" />
                </div>
              </div>
              <p className="text-gray-700 text-lg font-semibold">Loading your tasks...</p>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-16 text-center">
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No tasks found</h3>
            <p className="text-gray-600 text-lg">Try adjusting your filters or check back later for new tasks</p>
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
          <div className="mt-10 bg-white rounded-3xl shadow-xl border border-blue-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-2.5 rounded-xl animate-bounce">
                <BarChart3 size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Task Statistics</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="group text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="bg-gradient-to-br from-blue-600 to-blue-400 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                  <FolderKanban size={28} className="text-white" />
                </div>
                <p className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">{tasks.length}</p>
                <p className="text-sm text-gray-700 font-semibold group-hover:text-blue-700 transition-colors duration-300">Total Tasks</p>
              </div>
              <div className="group text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border-2 border-yellow-200 hover:border-yellow-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                  <TrendingDown size={28} className="text-white animate-pulse" />
                </div>
                <p className="text-4xl font-bold text-yellow-600 mb-2 group-hover:scale-105 transition-transform duration-300">
                  {tasks.filter(t => t.status === 'pending' || t.status === 'Pending').length}
                </p>
                <p className="text-sm text-gray-700 font-semibold group-hover:text-yellow-700 transition-colors duration-300">Pending</p>
              </div>
              <div className="group text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border-2 border-indigo-200 hover:border-indigo-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                  <PlayCircle size={28} className="text-white animate-spin" style={{animationDuration: '3s'}} />
                </div>
                <p className="text-4xl font-bold text-indigo-600 mb-2 group-hover:scale-105 transition-transform duration-300">
                  {tasks.filter(t => t.status === 'In Progress').length}
                </p>
                <p className="text-sm text-gray-700 font-semibold group-hover:text-indigo-700 transition-colors duration-300">In Progress</p>
              </div>
              <div className="group text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 hover:border-green-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                  <CheckCircle2 size={28} className="text-white" />
                </div>
                <p className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-105 transition-transform duration-300">
                  {tasks.filter(t => t.status === 'completed' || t.status === 'Completed').length}
                </p>
                <p className="text-sm text-gray-700 font-semibold group-hover:text-green-700 transition-colors duration-300">Completed</p>
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
    <div className="group bg-gradient-to-br from-white via-white to-blue-50/30 rounded-3xl shadow-xl border-2 border-blue-100/50 p-7 hover:shadow-lg hover:-translate-y-1 hover:border-blue-300 hover:scale-[1.01] transition-all duration-500 overflow-hidden relative cursor-pointer backdrop-blur-sm">
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
      
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-3 rounded-xl shadow-lg group-hover:scale-105 group-hover:rotate-6 group-hover:shadow-blue-500/30 transition-all duration-300">
                <Target size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:scale-102 transition-all duration-300 leading-tight">{task?.taskName}</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 ml-14 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed">{task?.description}</p>
          </div>
        </div>

        {/* Priority & Status */}
        <div className="flex items-center gap-3 mb-6 flex-wrap ml-14">
          <span className={`px-5 py-2.5 rounded-xl text-xs font-bold border-2 ${getPriorityColor(task.priority)} shadow-md flex items-center gap-2 hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer backdrop-blur-sm`}>
            <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse shadow-lg"></div>
            <span className="tracking-wide">{task.priority} Priority</span>
          </span>
          <span className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${getStatusColor(task.status)} shadow-md hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer backdrop-blur-sm`}>
            {getStatusIcon(task.status)}
            <span className="tracking-wide">{task.status}</span>
          </span>
        </div>

        {/* Dates */}
        <div className="space-y-4 mb-7 bg-gradient-to-br from-slate-50/80 via-blue-50/80 to-indigo-50/80 rounded-2xl p-5 border-2 border-blue-200/50 group-hover:border-blue-300/70 group-hover:bg-gradient-to-br group-hover:from-blue-50/80 group-hover:to-indigo-50/80 group-hover:shadow-sm transition-all duration-500 backdrop-blur-sm">
          <div className="flex items-center gap-4 text-sm">
            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-2xl p-3.5 shadow-lg group-hover:scale-105 group-hover:rotate-3 group-hover:shadow-blue-500/30 transition-all duration-300">
              <Calendar size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <span className="font-bold text-gray-900 block mb-1 text-xs uppercase tracking-wider">Start Date</span>
              <span className="text-gray-800 font-semibold text-base">{formatDate(task?.startDate)}</span>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
          <div className="flex items-center gap-4 text-sm">
            <div className="bg-gradient-to-br from-red-600 via-red-500 to-red-400 rounded-2xl p-3.5 shadow-lg group-hover:scale-105 group-hover:-rotate-3 group-hover:shadow-red-500/30 transition-all duration-300">
              <Clock size={20} className="text-white animate-pulse" />
            </div>
            <div className="flex-1">
              <span className="font-bold text-gray-900 block mb-1 text-xs uppercase tracking-wider">Due Date</span>
              <span className="text-gray-800 font-semibold text-base">{formatDate(task?.dueDate)}</span>
            </div>
          </div>
        </div>

        {/* Complete Button */}
        {task.status !== 'completed' && task.status !== 'Completed' ? (
          <button
            onClick={() => onComplete(task._id)}
            className="w-full bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 hover:from-green-700 hover:via-green-600 hover:to-emerald-700 text-white py-4 px-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/30 active:scale-98 hover:scale-102 group/btn border border-green-400/30"
          >
            <CheckCircle2 size={22} className="group-hover/btn:rotate-[360deg] transition-transform duration-700" />
            <span className="text-base tracking-wide">Mark as Completed</span>
          </button>
        ) : (
          <div className="w-full bg-gradient-to-br from-green-100 via-emerald-50 to-green-50 text-green-800 py-4 px-5 rounded-2xl font-bold flex items-center justify-center gap-3 border-2 border-green-400/60 shadow-lg shadow-green-200/50">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-full p-2 shadow-md">
              <CheckCircle2 size={18} className="text-white" />
            </div>
            <span className="text-base tracking-wide">Task Completed Successfully</span>
          </div>
        )}
      </div>
    </div>
  );
};