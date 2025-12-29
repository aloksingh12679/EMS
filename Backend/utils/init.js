const mongoose = require('mongoose');
const User = require('../models/user');
const Department = require("../models/Department");
const {departmentData} = require("./departmentData");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });


const intializingBase = async() => {
    try{
     console.log(`🔗 Connecting to: ${process.env.MONGODB_URL}`);
        const conn = await mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/ems_database');
        console.log(`mongodb(database) connected successfully`);

        await Department.deleteMany({});

       await Department.insertMany(departmentData).then( () => {
        console.log("Departments succesfully created");
       });

       
        
       
    // console.log(departmentData);

    
    
    
    
    
    
    }catch(err){
            console.log(err);
        }
}




intializingBase();