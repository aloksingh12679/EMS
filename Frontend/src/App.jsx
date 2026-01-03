import { Routes, Route } from "react-router-dom";
import Employees from "./pages/admin/EmployeesPage";
import EmployeeDashboard from "./pages/Employee/Dashboard";
import Attendance from "./pages/Employee/Attendance";
import "./App.css";
import "./index.css";
import Login from "./pages/auth/LoginPage";
import EmployeesList from "./pages/admin/EmployeesList";

function App() {
  return (
   <Routes>
      <Route path="/admin/employees" element={<EmployeesList />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="/attendance" element={<Login />} />


    </Routes>

  );
}

export default App;
