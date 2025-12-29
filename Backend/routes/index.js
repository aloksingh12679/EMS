const express = require('express').default || require('express');
const router = express.Router();

const authRoutes = require("./auth.routes");

router.use('/auth' , authRoutes);



module.exports = router;