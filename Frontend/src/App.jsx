import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";
import "./index.css";

// pages
import EmployeeLogin from "./pages/auth/EmployeeLogin";
import EmployeesList from "./pages/admin/EmployeesList";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HomePage from "./pages/common/HomePage";
import EmployeeProfile from "./pages/admin/EmployeeProfile";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeAttendance from "./pages/admin/EmployeeAttendance";
import SalaryManagement from "./pages/admin/SalaryManagement";
import AddEmployee from "./pages/admin/AddEmployee";
import LeaveRecord from "./pages/admin/LeaveRecord";
import EmployeeEdit from "./pages/admin/EmployeeEdit";
import MyTasks from "./pages/employee/MyTasks";
import Support from "./pages/employee/SupportSystem";
import EmployeeLeave from "./pages/employee/ApplyLeave/EmployeeLeave";
import MyProfile from "./pages/employee/MyProfile";
import Register from "./pages/auth/Register";


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
          <Route path="/register" element={<Register />} />



{/* admin pages */}
         
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/employees" element={<EmployeesList />} />

          <Route path="/admin/employee/:id" element={<EmployeeProfile/>}/>
           <Route path="/admin/employee/add" element={< AddEmployee/>} />

          <Route path="/admin/attendance" element={<EmployeeAttendance />} />


           <Route path="/admin/employees/salary" element={< SalaryManagement/>} />

           <Route path="/admin/employees/leaves" element={< LeaveRecord/>} />
           

<Route path="/admin/employees/:id/edit" element={<EmployeeEdit />} /> */}

{/*employee side pages*/}

          {/* <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/profile" element={<MyProfile />} />
                    <Route path="/employee/mytasks" element={<MyTasks />} />
<Route path="/employee/apply-leave" element={<EmployeeLeave />} /> 
<Route path="/employee/support-system" element={<Support/>} />  */}





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

        
{/* employes protected route */}
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

          
          <Route 
            path="/employee/support-system" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <Support/>
              </ProtectedRoute>
            } 
          />
 <Route 
            path="/employee/apply-leave" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeLeave/>
              </ProtectedRoute>
            } 
          />

           <Route 
            path="/employee/support-system" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <Support/>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/employee/profile" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <MyProfile/>
              </ProtectedRoute>
            } 
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;