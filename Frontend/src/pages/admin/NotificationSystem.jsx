import { useState, useEffect, useRef } from 'react';
import { FiBell, FiX } from 'react-icons/fi';
import { HiOutlineTicket } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeServices';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    // Optional: Set up polling to refresh notifications
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const result = await employeeService.getTickets();
      
      if (result.success) {
        setNotifications(result.tickets || []);
        // Count unread notifications
        const unread = result.tickets.filter(ticket => !ticket.isReadByAdmin).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    setIsOpen(false);
    // Navigate to tickets page with the specific ticket ID
    navigate(`/admin/tickets/${notification._id}`);
  };

  const handleViewAllTickets = () => {
    setIsOpen(false);
    navigate('/admin/tickets');
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
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <FiBell className="text-xl text-slate-600" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-[500px] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <FiX className="text-slate-600" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[400px]">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${
                    !notification.isReadByAdmin ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Avatar or Icon */}
                    <div className="flex-shrink-0">
                      {notification.employee?.profilePhoto && 
                       notification.employee.profilePhoto !== 'default-avatar.png' ? (
                        <img
                          src={notification.employee.profilePhoto}
                          alt={notification.employee.firstName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {notification.employee?.firstName?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {notification.employee?.firstName} {notification.employee?.lastName}
                        </p>
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-1 truncate">
                        {notification.subject}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                        <span className="text-xs text-slate-500">
                          {notification.category}
                        </span>
                      </div>

                      {!notification.isReadByAdmin && (
                        <div className="flex items-center gap-1 mt-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs text-blue-600 font-medium">New</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-12 text-center">
                <HiOutlineTicket className="mx-auto text-slate-300 mb-3" size={48} />
                <p className="text-sm text-slate-500">No notifications</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={handleViewAllTickets}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all tickets
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;