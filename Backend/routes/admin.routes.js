const express = require('express').default || require('express');
const router = express.Router();
const multer  = require('multer');
const{storage} = require("../config/cloudConfig.js");
const upload = multer({storage});
const {
    getDashboardstats,
    getAllEmployees,
    createEmployee,
    getEmployeebyId,
    updateEmployee,
    deleteEmployee,
    getAlldepartments,
    createDepartment,
    getleavesDetail,
    getEmployeesSalary,
    addTask,
    updateSalary,
    runPayroll
} = require("../controllers/adminController.js");

const { protect} = require('../middleware/auth');


router.use(protect);



// Dashboard routes

router.get("/dashboard/stats" , getDashboardstats);


// Employee management routes

router.route("/employees")
.get(getAllEmployees)
.post(upload.single('profilePhoto') , createEmployee);


router.route("/employee/:id")
.get(getEmployeebyId)
.put(upload.single('profilePhoto'),updateEmployee)
.delete(deleteEmployee);


router.post("/employee/:id/addtask", addTask);


router.route("/employees/salary")
.get(getEmployeesSalary)
.post(updateSalary);


router.post("/employees/salary/run-payroll" , runPayroll);
// router.get("/employees/salary" ,getEmployeesSalary);
// router.post("/employees/salary/" , updateSalary);


// leaves detail
router.get("/leaves" , getleavesDetail);


// Department management routes

router.route("/departments")
.get(getAlldepartments)
.post(createDepartment);

module.exports = router;