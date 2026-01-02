import { Routes, Route } from "react-router-dom";
import Employees from "./pages/admin/EmployeesPage";
import EmployeeDashboard from "./pages/Employee/Dashboard";
import Attendance from "./pages/Employee/Attendance";
import "./App.css";
import "./index.css";

function App() {
  return (
   <Routes>
      <Route path="/admin/employees" element={<Employees />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="/attendance" element={<Attendance />} />
    </Routes>

  );
}

export default App;
