const express = require('express').default || require('express');
const router = express.Router();

const authRoutes = require("./auth.routes.js");
const adminRoutes = require("./admin.routes.js");



router.use('/auth' , authRoutes);
router.use('/admin' , adminRoutes);


module.exports = router;