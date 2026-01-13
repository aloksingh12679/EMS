const express = require('express').default || require('express');
const router = express.Router();


const { protect} = require('../middleware/auth');

const {getEmployeedashboard, getTasks, getProfile, updateTask, applyLeave, getAppliedLeave} = require("../controllers/employeeController.js");
const { createTicket } = require('../controllers/supportTicketController.js');
router.use(protect);

router.get("/dashboard" , getEmployeedashboard);


router.get("/tasks" , getTasks);

router.post("/tasks" , updateTask);


router.post("/support/tickets" , createTicket );
router.get("/me" , getProfile);

router.route("/apply-leave")
.get(getAppliedLeave)
.post(applyLeave);
// router.post("/apply-leave" , applyLeave);


// router.route("/tasks")
// .get(getTasks)
// .post(updateTask);


module.exports = router;