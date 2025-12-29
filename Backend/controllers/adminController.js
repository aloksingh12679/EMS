const User = require("../models/user");
const Department =  require("../models/Department");
const {status} = require("http-status");


const getDashboardstats = async (req,res,next) => {
  try {
    let totalEmployees = await User.countDocuments({role : "employee"});
    let totalDepartments =  await Department.countDocuments({isActive : true});
    let activeEmployess =  await User.countDocuments({
      role : "employee",
      isActive : true});


      let presentToday = activeEmployess;
// Todo 
    const pendingLeaves = 0;

    const recentEmployees = await User.find({role : 'employee'}).sort({createdAt : -1}).limit(5)
    .select('firstname lastname employeeId department position joiningDate')
    .populate('department' , 'name');

    // check later (updated info or not)
    // departments stats

    const departmentStats = await Department.aggregate([
      {
        $lookup : {
          from : "users",
          localField : "_id",
          foreignField : "_department",
          as : "employees"
        }
      },
      {
        $project : {
          name : 1,
          employeeCount : {$size : '$employees'}
        }
      }
    ]);

    res.status(status.OK).json({
      success : true,
      data : {
        stats : {
          totalEmployees,
          activeEmployess,
          totalDepartments,
          presentToday,
          pendingLeaves,
          
        },
        recentEmployees,
        departmentStats
      }
    })

   
  }catch(err){
    console.log("Dashboard data Error" , err);
   res.status(500).json({
    success : "false",
    message : "error fetching dashboard details"
   })
  }
}


const createEmployee = async (req,res,next) => {
  try {
const {
  firstName,
  lastName,
  email,
  contactNumber,
  address,
  department,
  position,
  salary,
  joinningDate,
  jobType = 'full-time'

} =  req.body;

if(!firstName && !email && !position){
  return res.status(400).json({
    message : "Please provide necessary details"
  })
}
// checking personal email
if(email){
  const existingEmail = await User.findOne({personalEmail : email});
  if(existingEmail){
    return res.status(400).json({
      message : "Email already exists"
    })
  }

}

const generateEmployeeId = async () => {
  const lastEmployee = await User.findOne({role : "employee"} , {employeeId :  true} , {sort : {createdAt : -1}});
  //  let intialNum = 2025;
   let nextNum = 2025;
  if(lastEmployee && lastEmployee.employeeId) { 
    const match = lastEmployee.employeeId.match(/EMP(\d+)/);
    if(match && match[1]){
      nextNum = parseInt(match[1]) + 1;
    }
  }

  return `EMP-${nextNum}`;

}

 const employeeId = await generateEmployeeId();

 const employee = new User({
    employeeId,
    firstName,
    lastName,
    personalEmail: email,
    contactNumber,
    address: address || {},
    department: department || null,
    position,
    salary: salary || 0,
    joiningDate: joinningDate || new Date(),
    jobType,
    role: 'employee',
    isActive: true,
    createdBy: req.user._id 


 });


 await employee.save();


 const savedEmployee = await User.findById(employee._id).select('password').populate("department" , "name");

 res.status(status.OK).json({
  success : true,
  message : "Employee created successfully",
  data : savedEmployee
 });

  }catch(err){

      res.status(500).json({
            success: false,
            message: 'Error creating employee'
        });
  }
}



const getEmployeebyId = async(req,res,next) => {
  try {
    const employee = await User.findById(req.params.id).select("-password +resetPasswordToken").populate("department" , "name code").populate("createdBy" , "firstName lastName");

    if(!employee){
      return res.status(status.NOT_FOUND).json({
        success : false,
        message : "Employee Not found"
            })
    }
    
  }catch(err){

  }
}
module.exports = {
    getDashboardstats
}