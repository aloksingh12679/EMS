import { Routes, Route } from "react-router-dom";
import Employees from "./pages/admin/EmployeesPage";
import EmployeeDashboard from "./pages/Employee/Dashboard";
import Attendance from "./pages/Employee/Attendance";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import EmployeeProfile from "./pages/admin/EmployeeProfile.jsx"
import "./App.css";
import SalaryManagement from "./pages/SalaryManagement/SalaryManagement";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employeeprofile" element={<EmployeeProfile />} />
        <Route path="/salarymanagement" element={<SalaryManagement/>}/>
      </Routes>
    </>
  );
}

export default App;
