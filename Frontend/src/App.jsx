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
import SalaryManagement from "./pages/admin/SalaryManagement";
import AddEmployee from "./pages/admin/AddEmployee";
import LeaveRecord from "./pages/admin/LeaveRecord";
import EmployeeEdit from "./pages/admin/EmployeeEdit";
import MyTasks from "./pages/employee/MyTasks";


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
    
    return <Navigate to="/admin-login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
  
    if (user.role === 'Admin') {
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




         
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/employees" element={<EmployeesList />} />

          <Route path="/admin/employee/:id" element={<EmployeeProfile/>}/>

          <Route path="/admin/attendance" element={<EmployeeAttendance />} />

           <Route path="/admin/salary" element={< SalaryManagement/>} />

           <Route path="/admin/leaves" element={< LeaveRecord/>} />
           <Route path="/admin/employee/add" element={< AddEmployee/>} />

<Route path="/admin/employee/:id/edit" element={<EmployeeEdit />} /> */}
{/* one page og employee side */}

          {/* <Route path="/employee/dashboard" element={<EmployeeDashboard />} /> */}


          {/* Protected Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          
          <Route 
            path="/admin/employees" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <EmployeesList />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/employees/:id" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <EmployeeProfile />
              </ProtectedRoute>
            } 
          /> 

          <Route 
            path="/admin/employees/add" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AddEmployee />
              </ProtectedRoute>
            } 
          /> 

           <Route 
            path="/admin/employees/:id/edit" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <EmployeeEdit/>
              </ProtectedRoute>
            } 
          /> 
           <Route 
            path="/admin/employees/leaves" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <LeaveRecord />
              </ProtectedRoute>
            } 
          /> 
           <Route 
            path="/admin/employees/attendance" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <EmployeeAttendance />
              </ProtectedRoute>
            } 
          /> 

          <Route 
            path="/admin/employees/salary" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <SalaryManagement />
              </ProtectedRoute>
            } 
          /> 

        

          <Route 
            path="/employee/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/employee/mytasks" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <MyTasks />
              </ProtectedRoute>
            } 
          />


        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;