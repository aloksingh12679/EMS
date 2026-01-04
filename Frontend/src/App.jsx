import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";
import "./index.css";

// pages
import EmployeeLogin from "./pages/auth/EmployeeLogin";
import EmployeesList from "./pages/admin/EmployeesList";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminDashboard from "./pages/admin/DashboardPage/AdminDashboard";
import HomePage from "./pages/common/HomePage";
import EmployeeProfile from "./pages/admin/EmployeeProfile";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeAttendance from "./pages/admin/EmployeeAttendance";


const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading} = useAuth();
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if(!localStorage.getItem('token')) {
    
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
  
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />




         
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/employees" element={<EmployeesList />} />

          <Route path="/admin/employee/profile" element={<EmployeeProfile/>}/>


          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

          <Route path="/employee/attendance" element={<EmployeeAttendance />} />


          {/* Protected Admin Routes */}
          {/* <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          /> */}

          
          {/* <Route 
            path="/admin/employees" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EmployeesList />
              </ProtectedRoute>
            } 
          /> */}

          {/* <Route 
            path="/admin/employee/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EmployeeProfile />
              </ProtectedRoute>
            } 
          /> */}

          {/* <Route 
            path="/employee/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          /> */}

          {/* <Route 
            path="/employee/attendance" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeAttendance />
              </ProtectedRoute>
            } 
          /> */}


        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;