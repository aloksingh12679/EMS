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

       const newAdmin = new User({
        email : "admin@gmail.com",
        password : "admin123",
        firstName : "System",
        lastName : "testing",
        role : "admin",
        personalEmail : "admin@gmail.com"
       })

      //  const newEmployee = new User({
      //  firstName : "Neha",
    // lastName : "sharma",
    // personalEmail: "neha@gmail.com",
    // contactNumber : "123456789",
    
    // department: "Finance",
    // position : "HR",
    // salary: 14000,
        

    //    })
    //     await newEmployee.save();
      await newAdmin.save().then(res=> {
        console.log(res)
      }).catch(err => {
        console.log("newAdmin err" , err);
      });
       
    // console.log(departmentData);

    
    
    
    
    
    
    }catch(err){
            console.log(err);
        }
}




intializingBase();