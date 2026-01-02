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

console.log(firstName);
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
  console.log(lastEmployee);
   let nextNum = 2025;
  if(lastEmployee && lastEmployee.employeeId) { 
    const match = lastEmployee.employeeId.match(/EMP-(\d+)/);
    console.log(match);
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
   


 });


 await employee.save();


 const savedEmployee = await User.findById(employee._id).select('password').populate("department" , "name");

 res.status(status.OK).json({
  success : true,
  message : "Employee created successfully",
  data : savedEmployee
 });

  }catch(err){
  console.log("create employee " , err);
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
    
    if(employee.role != "employee"){
      return res.status(status.NOT_FOUND).json({
        success : false,
        message : "User is not an Employee"
            })
    }

    res.status(200).json({
      success : false,
      data : employee
    })
  }catch(err){

    console.log("get employee error" , err);
   
    if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid employee ID'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error fetching employee'
        });

  }
}

const updateEmployee = async(req,res) => {
 try{
  const {id} = req.params;
  const updatedData = req.body;


  const employee = await User.findByIdAndUpdate(id , { ...updatedData , updatedBy : req.user._id} , {new :true , runValidators : true})
  .select('-password').populate('department' , 'name');


  if(!employee){
    return res.status(status.NOT_FOUND).json({
                success: false,
                message: 'Employee not found'
            });
  }

   res.status(status.OK).json({
            success: true,
            message: 'Employee updated successfully',
            data: employee
        });
 }catch(err){


  console.log("update employee error" , err);
  if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid employee ID'
            });
        }


         res.status(500).json({
            success: false,
            message: 'Error updating employee'
        });


 }
}


const deleteEmployee = async(req,res) => {
  try{
    const {id} = req.params;
    const {hardDelete = false} = req.query;
    if(hardDelete === 'true'){
       const employee = await User.findByIdAndDelete(id);
       if(!employee){
        return res.status(NOT_FOUND).json({
          success : false,
          message : "Employee Not found"
        });
       }

       return res.status(status.OK).json({
                success: true,
                message: 'Employee permanently deleted'
            });
    }
   }catch(err){
    console.log("delete employee error" , deleteEmployee);
    if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid employee ID'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error deleting employee'
        });
   }
}


// route   GET /api/v1/admin/departments
const getAlldepartments =  async(req,res) => {
  try{
    const departments = await Department.find({isActive : true})
    .populate('manager' , 'firstName lastname email')
    .sort({name : 1});

    res.status(status.OK).json({
      success : true,
      data : departments
    })

  }catch(err){
    console.error('Get departments error:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching departments'
        });
  }
}


const createDepartment = async (req,res) => {
  try{
    const {name , code , description , budget , manager} = req.body;

     if(!name && !code && !description){
      return res.status(400).json({
        success :false,
        message : "name , code and decription are required"
      })
     }
      const department = new Department({
            name,
            code,
            description,
            manager,
            budget
        });
        
        await department.save();
         res.status(status.OK).json({
            success: true,
            message: 'Department created successfully',
            data: department
        });
  }catch(err){
 console.error('Create department error:', error);
        
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Department name or code already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error creating department'
        });
  }
}

//todo getAllEmployees 
const getAllEmployees = async(req,res) => {

}
module.exports = {
    getDashboardstats, 
    getAllEmployees,
    getEmployeebyId,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getAlldepartments,
    createDepartment
}