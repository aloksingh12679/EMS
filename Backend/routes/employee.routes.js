const express = require('express').default || require('express');
const router = express.Router();


const { protect} = require('../middleware/auth');

const {getEmployeedashboard, getTasks, updateTask} = require("../controllers/employeeController.js")
router.use(protect);

router.get("/dashboard" , getEmployeedashboard);


router.get("/tasks" , getTasks);

router.post("/tasks" , updateTask);


// router.route("/tasks")
// .get(getTasks)
// .post(updateTask);


module.exports = router;