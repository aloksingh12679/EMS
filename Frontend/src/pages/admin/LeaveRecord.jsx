import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import AdminSidebar from '../../Components/AdminSidebar';
import { employeeService } from '../../services/employeeServices';
import { capitalize } from '../../utils/helper';

const LeaveRecord = () => {
  const [leaves, setLeaves] = useState([]);

 useEffect(() => {
  const fetchData = async () => {
try{
 const result = await employeeService.getLeavesdetails();
 console.log(result.data);
 setLeaves(result.data);

}catch(err){
console.log("leave err " , err);
}
  }
  fetchData();
 },[]);

 useEffect(() => {
  console.log(leaves);
 },[leaves]);


  const handleApprove = (id) => {
    setLeaves(leaves.map(leave => 
      leave.id === id ? { ...leave, status: 'approved' } : leave
    ));
  };

  const handleReject = (id) => {
    setLeaves(leaves.map(leave => 
      leave.id === id ? { ...leave, status: 'rejected' } : leave
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getMonthYear = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getLeaveTypeColor = (type) => {
    const colors = {
      annual: 'bg-blue-100 text-blue-800',
      sick: 'bg-red-100 text-red-800',
      personal: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
    
      <div className="flex-1 mt-3   w-full min-w-0 lg:ml-64">
        <div className="p-4 pt-16 md:p-6 md:pt-6 lg:p-8 lg:pt-8">
          <div className="max-w-full">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Leave Management</h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">Review and manage employee leave requests</p>
            </div>

            {/* No Records Message */}
            {leaves.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Leave Requests</h3>
                  <p className="text-gray-500">There are currently no leave requests to display.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Employee</th>
                          <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Month</th>
                          <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Date Range</th>
                          <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Leave Type</th>
                          <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Reason</th>
                          <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                          <th className="px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {leaves.map((leave) => (
                          <tr key={leave.employee._id} className="hover:bg-gray-50">
                            <td className="px-4 lg:px-6 py-3 md:py-4">
                              <div className="min-w-max">
                                <div className="font-medium text-gray-900 text-xs md:text-sm">{capitalize(leave?.employee?.firstName)}</div>
                                <div className="text-xs text-gray-500">{leave?.employee?.employeeId}</div>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-3 md:py-4">
                              <div className="flex items-center text-gray-700 text-xs md:text-sm min-w-max">
                                <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-2 text-gray-400 flex-shrink-0" />
                                <span className="hidden xl:inline">{getMonthYear(leave?.startDate)}</span>
                                <span className="xl:hidden">{new Date(leave?.startDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}</span>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-3 md:py-4">
                              <div className="text-xs md:text-sm text-gray-900 min-w-max">
                                {formatDate(leave?.startDate)} - {formatDate(leave?.endDate)}
                              </div>
                              <div className="text-xs text-gray-500 min-w-max">{leave?.totalDays} {leave?.totalDays === 1 ? 'day' : 'days'}</div>
                            </td>
                            <td className="px-4 lg:px-6 py-3 md:py-4">
                              <span className={`inline-flex px-2 md:px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${getLeaveTypeColor(leave.leaveType)}`}>
                                {leave?.leaveType}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-3 md:py-4">
                              <div className="text-xs md:text-sm text-gray-700 max-w-[200px] min-w-[120px]">{leave?.reason}</div>
                            </td>
                            <td className="px-4 lg:px-6 py-3 md:py-4">
                              <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${getStatusColor(leave.status)}`}>
                                {leave?.status === 'pending' && <Clock className="w-3 h-3 mr-1 flex-shrink-0" />}
                                {leave?.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />}
                                {leave?.status === 'rejected' && <XCircle className="w-3 h-3 mr-1 flex-shrink-0" />}
                                {leave?.status}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-3 md:py-4">
                              {leave.status === 'pending' ? (
                                <div className="flex gap-2 min-w-max">
                                  <button
                                    onClick={() => handleApprove(leave?.id)}
                                    className="flex items-center justify-center gap-1 px-2 md:px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors whitespace-nowrap"
                                  >
                                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    onClick={() => handleReject(leave?.id)}
                                    className="flex items-center justify-center gap-1 px-2 md:px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors whitespace-nowrap"
                                  >
                                    <XCircle className="w-3 h-3 flex-shrink-0" />
                                    <span>Reject</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500 whitespace-nowrap">No action</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View - Visible only on mobile */}
                <div className="md:hidden space-y-4">
                  {leaves.map((leave) => (
                    <div key={leave?.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                      {/* Card Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{capitalize(leave?.employee?.firstName)}</h3>
                            <p className="text-xs text-gray-600">{leave?.employee?.employeeId}</p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(leave.status)}`}>
                            {leave.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {leave.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {leave.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {leave.status}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="px-4 py-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">Date Range</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(leave?.startDate)} - {formatDate(leave?.endDate)}
                            </p>
                            <p className="text-xs text-gray-500">{leave?.totalDays} {leave?.totalDays === 1 ? 'day' : 'days'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Leave Type</p>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getLeaveTypeColor(leave.leaveType)}`}>
                              {leave?.leaveType}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Reason</p>
                            <p className="text-sm text-gray-700">{leave?.reason}</p>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer - Actions */}
                      {leave.status === 'pending' && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
                          <button
                            onClick={() => handleApprove(leave?.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 active:scale-95 transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(leave?.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 active:scale-95 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* Ensure main content adjusts for sidebar on desktop (1120px+) */
        @media (min-width: 1120px) {
          .lg\:ml-64 {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LeaveRecord;