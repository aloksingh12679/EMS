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
    createDepartment
} = require("../controllers/adminController.js");

const { protect} = require('../middleware/auth');


// router.use(protect);



// Dashboard routes

router.get("/dashboard/stats" , getDashboardstats);


// Employee management routes

router.route("/employees")
.get(getAllEmployees)
.post(upload.single('profilePhoto') , createEmployee);


router.route("/employees/:id")
.get(getEmployeebyId)
.put(updateEmployee)
.delete(deleteEmployee);



// Department management routes

router.route("/departments")
.get(getAlldepartments)
.post(createDepartment);

module.exports = router;