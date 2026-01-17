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
    runPayroll,
    leaveAction,
    sentEmail
} = require("../controllers/adminController.js");

const { protect} = require('../middleware/auth');
const { getAdminTickets, updateTicket } = require('../controllers/supportTicketController.js');
const {ActivatePaymentMode ,  UpdateBankDetails} = require("../controllers/paymentController.js");

router.use(protect);



// Dashboard routes

router.get("/dashboard/stats" , getDashboardstats);
router.get("/tickets" ,getAdminTickets);
router.patch("/support-tickets/:id/mark-read",updateTicket);

// Employee management routes

router.route("/employees")
.get(getAllEmployees)
.post(upload.single('profilePhoto') , createEmployee);

// after registraion
router.post("/employees/sent-email" , sentEmail );


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
router.route("/employees/leaves")
.get(getleavesDetail)
.post(leaveAction);

// bank secure activity
router.route("/employees/salary/paymentmode")
.post(ActivatePaymentMode)
.put(UpdateBankDetails);

// Department management routes

router.route("/departments")
.get(getAlldepartments)
.post(createDepartment);

module.exports = router;