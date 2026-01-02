const User = require("../models/user");
const Department =  require("../models/Department");
const {status} = require("http-status");
const Attendance = require("../models/Attendance");


const getEmployeedashboard = async(req,res) => {
    try{
      const employeeId = req.user.id;

      const employee = await User.findById(employeeId)
      .select('firstName lastName personalEmail employeeId position department joiningDate salary')
      .populate('department', 'name code');
      
      const today = new Date();
      today.setHours(0,0,0,0); // set time raat ke 12 vje
 
      const todayAttendance = await Attendance.findOne({ //aaj ki attendance ka record
        employee : employeeId,
        date : {
            $gte : today, 
            $lt : new Date(today.getTime() + + 24 * 60 * 60 * 1000) 
        }
      });

    //   const startOfmonth = new Date(today.getFullYear() , today.getMonth() , 1); // iss saal ka current month ka 1 day; (2026 , january , 1);
    //   const monthlyAttendance = await Attendance.aggregate([
    //     {
    //         $match : {
    //             employee : employeeId,
    //             date : {$gte : startOfmonth},
    //             status : {$in : ["present" , "half-day" , "absent"]}
    //         }
    //     },
    //     {
    //         $group : {
    //             _id : 
    //         }
    //     }
    //   ])






    }catch(err){

        

    }
}

// desc    Employee check-in
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
 console.error('Check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during check-in'
    });
    }
}