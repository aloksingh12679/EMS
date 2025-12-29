const express = require('express');
const router = express.Router();

const {login , logout , getCurrentUser , forgotPassword} = require('../controllers/authController');

const {protect} = require("../middleware/auth");
const { getDashboardstats } = require('../controllers/adminController');

router.post("/login" ,login);
router.post("/forgot-password" , forgotPassword);


router.post("/logout" , protect , logout);
router.get("/me" , protect , getCurrentUser);
router.get("/test",getDashboardstats);


module.exports = router;