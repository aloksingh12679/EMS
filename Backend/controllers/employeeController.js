const User = require("../models/user");
const Department =  require("../models/Department");
const Task =  require("../models/tasks.js");
const Leave = require("../models/Leave.js");


const {status} = require("http-status");
const Attendance = require("../models/Attendance");
const Salary = require("../models/Salary");



const getEmployeedashboard = async(req,res) => {
    try{
      const employeeId = req.user.id;

      const employee = await User.findById(employeeId)
      .select('firstName lastName personalEmail employeeId position department joiningDate leaveBalance')
      .populate('department', 'name code');

      if(!employee){
        return res.status(400).json({
          success : false,
          message : "Employee Not found"
        });
      }
      const salaryDetails = await Salary.find({employee : employeeId});
      const taskDetails = await Task.find({employee : employeeId});
   
      return res.status(200).json({
                success: true,
                data : {
                  employee,
                  salaryDetails,
                  taskDetails
                }
            });





    }catch(err){
console.log("get employee dashboard error" , err);
  
        res.status(500).json({
            success: false,
            message: 'Error deleting employee'
        });
        

    }
}



const getTasks = async(req,res) => {
    try{
      const employeeId = req.user.id;

      const taskDetails = await Task.find({employee : employeeId});


      if(!taskDetails){
        return res.status(400).json({
          success : false,
          message : "no tasks"
        });
      }

   
      return res.status(200).json({
                success: true,
                data : {
                  taskDetails
                }
            });





    }catch(err){
console.log("get tasks error" , err);
  
        res.status(500).json({
            success: false,
            message: 'Error getting tasks'
        });
        

    }
}




const updateTask = async(req,res) => {
    try{
      const {taskId} = req.body;
console.log(taskId);
      const taskDetails = await Task.findByIdAndUpdate(taskId , {
        status : "completed"
      });
      


      if(!taskDetails){
        return res.status(400).json({
          success : false,
          message : "no tasks"
        });
      }

   
      return res.status(200).json({
                success: true,
                data : {
                  taskDetails
                }
            });





    }catch(err){
console.log("updating task error" , err);
  
        res.status(500).json({
            success: false,
            message: 'Error updating tasks'
        });
        

    }
}

const getProfile =  async(req,res) => {
  try{
        const id = req.user.id;
        const profile = await User.findById(id).populate("department" , "name description");
        if(!profile){
           return res.status(400).json({
          message : "no employee with this id",
          success : false
              })
        }

         return res.status(200).json({
          
          success : true,
          data : profile
              })

  }catch(error){
console.error('Error fetching employee profile:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
  }
}


const getAppliedLeave = async(req,res) => {
   try{
    const id = req.user.id;
        const employeeLeaves = await Leave.find({employee : id}).populate("employee" , "firstName employeeId");
        const leaveBalance = await User.findById(id).select("leaveBalance");
        
        console.log(employeeLeaves);
  
        return res.status(200).json({
          message : "working",
          success : true,
          data : {employeeLeaves,
          leaveBalance}
              })
      
  
    }catch(error){
   console.error('Error fetching employees leave detail:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
}

const applyLeave = async(req,res) => {
    try{
      const {leaveData} = req.body;

    
      const appliedLeave = new Leave({
        
        leaveType : leaveData.leaveType,
        startDate : leaveData.fromDate,
        endDate : leaveData.toDate,
        reason : leaveData.reason,
        employee : req.user.id
      })
     
      
              await appliedLeave.save().then((res) => {
                console.log(res);
              });


     

   
      return res.status(200).json({
                success: true,
                message : "leave applied succesfully"
            });





    }catch(err){
console.log("apply leave  error" , err);
  
        res.status(500).json({
            success: false,
            message: 'Error applying leave'
        });
        

    }
} 




// Employee check-in
// route   POST /api/employee/checkin
// access  Private (Employee only)

const checkIn = async(req,res) => {
    try{
      const employeeId = req.user.id;
      const now = new Date();
      const today = new Date();

      today.setHours(0,0,0,0);

      const existingAttendance = await Attendance.findOne({
        employee : employeeId,
        date : {
            $gte : today,
            $lt : new Date(today.getTime() + 24 * 60 * 60 * 1000) // raat 12 se agle din 11:59 raaat tk
        }
      })

      if(existingAttendance && existingAttendance.checkIn){
         return res.status(400).json({
        success: false,
        message: 'Already checked in today'
      });
      }

      let attendance;

      if(existingAttendance) {
        existingAttendance.checkIn = now;
        attendance = await existingAttendance.save();
      }else{
        attendance = await Attendance.create({
            employee :  employeeId,
            date : today,
            checkIn : now,
            status : "Working"
        })
        attendance.save(); //see later
      }

      res.status(status.OK).json({
        success : true,
        message  : "checked in successfully",
        data : {
            checkIn :  attendance.checkIn,
            date : attendance.date,
            status : attendance.status
        }
      });

    }catch(err){
 console.error('Check-in error:', err);
    res.status(500).json({
      success: false,
      message: 'Error during check-in'
    });
    }
}

//  Employee check-in
// route   POST /api/employee/checkOut
// access  Private (Employee only)
const checkOut = async(req,res) => {
  try{
      const employeeId = req.user.id;
      const now = new Date();
      const today = new Date();
 

      today.setHours(0,0,0,0);

      const attendance = await Attendance.findOne({
        employee : employeeId,
        date : {
          $gte : today,
          $lt : new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if(!attendance){
        return res.status(400).json({
        success: false,
        message: 'You need to check in first'
      });
      }

      if(attendance.checkOut) {
         return res.status(400).json({
        success: false,
        message: 'Already checked out today'
      });
      }

      attendance.checkOut = now;
      await attendance.save();

      res.status(status.OK).json({
        message: 'checkout - succesfully',
        data : {
          checkIn : attendance.checkIn,
          checkOut : attendance.checkOut,
          workingHours : attendance.workingHours,
          status : attendance.status  
        }
      })

  }catch(err){

    console.error('Check-out error:', eror);
    res.status(500).json({
      success: false,
      message: 'Error during check-out'
    });
  }
  }

  

module.exports = {
    getEmployeedashboard, 
    getTasks,
    updateTask,
    applyLeave,
    getAppliedLeave,
    getProfile
    
}