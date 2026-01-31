import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSearch, FiFilter, FiX, FiCheck, FiAlertCircle, FiUser, FiCalendar, FiArrowLeft } from "react-icons/fi";
import { HiOutlineTicket } from "react-icons/hi";
import AdminSidebar from "../../Components/AdminSidebar";
import { employeeService } from "../../services/employeeServices";

export default function Tickets() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, filterStatus, filterPriority]);

  useEffect(() => {
    if (ticketId && tickets.length > 0) {
      const ticket = tickets.find(t => t._id === ticketId);
      if (ticket) {
        setSelectedTicket(ticket);
      }
    }
  }, [ticketId, tickets]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const result = await employeeService.getTickets();
      
      if (result.success) {
        setTickets(result.tickets || []);
        setFilteredTickets(result.tickets || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(ticket => 
        ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.employee?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.employee?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      if (filterStatus === "unread") {
        filtered = filtered.filter(ticket => !ticket.isReadByAdmin);
      } else if (filterStatus === "read") {
        filtered = filtered.filter(ticket => ticket.isReadByAdmin);
      } else {
        filtered = filtered.filter(ticket => ticket.status?.toLowerCase() === filterStatus);
      }
    }

    // Priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter(ticket => 
        ticket.priority?.toLowerCase() === filterPriority.toLowerCase()
      );
    }

    setFilteredTickets(filtered);
  };

  const handleMarkAsRead = async (ticketId) => {
    try {
      await employeeService.updateTicket(ticketId);
      
      // Update local state
      setTickets(prev =>
        prev.map(ticket =>
          ticket._id === ticketId ? { ...ticket, isReadByAdmin: true } : ticket
        )
      );

      if (selectedTicket?._id === ticketId) {
        setSelectedTicket(prev => ({ ...prev, isReadByAdmin: true }));
      }
    } catch (error) {
      console.error('Error marking ticket as read:', error);
    }
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    navigate(`/admin/tickets/${ticket._id}`);
  };

  const handleCloseDetail = () => {
    setSelectedTicket(null);
    navigate('/admin/tickets');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in progress':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const unreadCount = tickets.filter(t => !t.isReadByAdmin).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AdminSidebar />
      
      {/* Main Content - Responsive Padding for Sidebar */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header - Responsive */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              {/* Title Section */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2">
                  Support Tickets
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                  Manage and respond to employee support requests
                </p>
              </div>
              
              {/* Stats Cards - Responsive Grid */}
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-1 sm:flex-none bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2">
                    <HiOutlineTicket className="text-blue-600" size={18} />
                    <div>
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="text-base sm:text-lg font-bold text-slate-900">{tickets.length}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 sm:flex-none bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2">
                    <FiAlertCircle className="text-red-600" size={18} />
                    <div>
                      <p className="text-xs text-slate-500">Unread</p>
                      <p className="text-base sm:text-lg font-bold text-slate-900">{unreadCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid - Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Tickets List - Full width on mobile, 1 col on desktop when detail is open */}
            <div className={`${selectedTicket ? 'hidden lg:block lg:col-span-1' : 'lg:col-span-3'} transition-all duration-300`}>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Search and Filter */}
                <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50">
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-3 sm:px-4 py-2 rounded-lg border transition-colors ${
                        showFilters 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <FiFilter size={16} />
                    </button>
                  </div>

                  {/* Filter Options - Responsive */}
                  {showFilters && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="open">Open</option>
                        <option value="in progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="all">All Priority</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Tickets List - Responsive Height */}
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                  ) : filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <div
                        key={ticket._id}
                        onClick={() => handleTicketClick(ticket)}
                        className={`p-3 sm:p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-all ${
                          !ticket.isReadByAdmin ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        } ${selectedTicket?._id === ticket._id ? 'bg-blue-100' : ''}`}
                      >
                        <div className="flex gap-3">
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            {ticket.employee?.profilePhoto && 
                             ticket.employee.profilePhoto !== 'default-avatar.png' ? (
                              <img
                                src={ticket.employee.profilePhoto}
                                alt={ticket.employee.firstName}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm sm:text-lg">
                                  {ticket.employee?.firstName?.charAt(0) || 'U'}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                              <div>
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                  {ticket.employee?.firstName} {ticket.employee?.lastName}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {ticket.employee?.employeeId}
                                </p>
                              </div>
                              <span className="text-xs text-slate-500 whitespace-nowrap">
                                {formatTimeAgo(ticket.createdAt)}
                              </span>
                            </div>
                            
                            <p className="text-sm font-medium text-slate-900 mb-1 truncate">
                              {ticket.subject}
                            </p>
                            
                            <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                              {ticket.description}
                            </p>
                            
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 sm:py-1 rounded-full font-medium border ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                              </span>
                              <span className={`text-xs px-2 py-0.5 sm:py-1 rounded-full font-medium border ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                              </span>
                              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 sm:py-1 rounded-full hidden sm:inline">
                                {ticket.category}
                              </span>
                            </div>

                            {!ticket.isReadByAdmin && (
                              <div className="flex items-center gap-1 mt-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-blue-600 font-medium">Unread</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-12 text-center">
                      <HiOutlineTicket className="mx-auto text-slate-300 mb-3" size={48} />
                      <p className="text-slate-500 font-medium">No tickets found</p>
                      <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ticket Detail - Full width on mobile, 2 cols on desktop */}
            {selectedTicket && (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  {/* Detail Header - Responsive */}
                  <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-start justify-between mb-4">
                      <button
                        onClick={handleCloseDetail}
                        className="lg:hidden p-2 hover:bg-white rounded-lg transition-colors"
                      >
                        <FiArrowLeft className="text-slate-600" size={20} />
                      </button>
                      
                      {!selectedTicket.isReadByAdmin && (
                        <button
                          onClick={() => handleMarkAsRead(selectedTicket._id)}
                          className="ml-auto flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                        >
                          <FiCheck size={16} />
                          <span>Mark as Read</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Employee Avatar */}
                      <div className="flex-shrink-0">
                        {selectedTicket.employee?.profilePhoto && 
                         selectedTicket.employee.profilePhoto !== 'default-avatar.png' ? (
                          <img
                            src={selectedTicket.employee.profilePhoto}
                            alt={selectedTicket.employee.firstName}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-md">
                            <span className="text-white font-bold text-lg sm:text-2xl">
                              {selectedTicket.employee?.firstName?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Employee Info */}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 truncate">
                          {selectedTicket.employee?.firstName} {selectedTicket.employee?.lastName}
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <FiUser size={14} />
                            {selectedTicket.employee?.employeeId}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar size={14} />
                            {formatDate(selectedTicket.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detail Content - Responsive Padding */}
                  <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                    {/* Subject */}
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Subject
                      </h3>
                      <p className="text-lg sm:text-xl font-semibold text-slate-900">
                        {selectedTicket.subject}
                      </p>
                    </div>

                    {/* Tags - Responsive Grid */}
                    <div className="mb-4 sm:mb-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                            Priority
                          </p>
                          <span className={`inline-block text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-semibold border ${getPriorityColor(selectedTicket.priority)}`}>
                            {selectedTicket.priority}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                            Status
                          </p>
                          <span className={`inline-block text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-semibold border ${getStatusColor(selectedTicket.status)}`}>
                            {selectedTicket.status}
                          </span>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                            Category
                          </p>
                          <span className="inline-block text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {selectedTicket.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Description
                      </h3>
                      <div className="bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-200">
                        <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {selectedTicket.description}
                        </p>
                      </div>
                    </div>

                    {/* Additional Info - Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Created
                        </p>
                        <p className="text-sm text-slate-900 font-medium">
                          {formatDate(selectedTicket.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Last Updated
                        </p>
                        <p className="text-sm text-slate-900 font-medium">
                          {formatDate(selectedTicket.updatedAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Read Status
                        </p>
                        <p className={`text-sm font-medium ${selectedTicket.isReadByAdmin ? 'text-green-600' : 'text-orange-600'}`}>
                          {selectedTicket.isReadByAdmin ? 'Read by Admin' : 'Unread'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Employee Status
                        </p>
                        <p className={`text-sm font-medium ${selectedTicket.isReadByEmployee ? 'text-green-600' : 'text-orange-600'}`}>
                          {selectedTicket.isReadByEmployee ? 'Read' : 'Unread'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        /* Ensure main content adjusts for sidebar on desktop */
        @media (min-width: 1120px) {
          .lg\\:ml-64 {
            margin-left: 16rem; /* 256px - same as sidebar width */
          }
        }
        
        /* Mobile: No margin */
        @media (max-width: 1119px) {
          .lg\\:ml-64 {
            margin-left: 0 !important;
          }
        }

        /* Custom scrollbar for better UX */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}