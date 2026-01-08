const User = require("../models/user");
const Department =  require("../models/Department");
const {status} = require("http-status");
const Salary = require("../models/Salary");


const getDashboardstats = async (req,res,next) => {
  try {
    let totalEmployees = await User.countDocuments({role : "employee"});
    let totalDepartments =  await Department.countDocuments({isActive : true});
    let activeEmployess =  await User.countDocuments({
      role : "employee",
      isActive : true});


      const presentToday = await Attendance.countDocuments({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // End of today
      },
      status: { $in: ['present', 'half-day'] } 
    });

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

     // 5. Salary Overview (simple for now)
    // const salaryOverview = await User.aggregate([
    //   {
    //     $match: {
    //       role: "employee",
    //       isActive: true,
    //       salary: { $gt: 0 }
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       avgSalary: { $avg: "$salary" },
    //       totalSalary: { $sum: "$salary" },
    //       minSalary: { $min: "$salary" },
    //       maxSalary: { $max: "$salary" }
    //     }
    //   }
    // ]);

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
    console.log(req.body);
    // console.log(req.file);
const {
  firstName,
  lastName,
  personalEmail,
  contactNumber,
  address,
  department,
  position,
  gender,
  dob,
  baseSalary,
  allowances,
  deductions,
  taxApply,
  joinningDate,
  netSalary,
  jobType = 'full-time'

} =  req.body;


if(!firstName && !personalEmail && !position && !department) {
  return res.status(400).json({
    message : "Please provide necessary details"
  })
}

// checking personal email
if(personalEmail){
  const existingEmail = await User.findOne({personalEmail});
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
    const match = lastEmployee.employeeId.match(/#EMP-(\d+)/);
  
    if(match && match[1]){
      nextNum = parseInt(match[1]) + 1;
    }
  }

  return `#EMP-${nextNum}`;

}

 const employeeId = await generateEmployeeId();
 department.toLowerCase();
 const departmentInfo = await Department.findOne({name : department}).populate("manager" , "name");
 
console.log(departmentInfo);

// saving salary details
 const salaryDetail = new Salary({
  employeeId,
  baseSalary,
  allowances,
  deductions,
  taxApply,
  netSalary
 })

 const employeeSalary = await salaryDetail.save();
 

 
 

 const employee = new User({
    employeeId,
    firstName,
    lastName,
    personalEmail,
    contactNumber,
    address: address || {},
    department: departmentInfo._id || null,
    position,
    gender,
    dob,
    salary : employeeSalary._id,
    reportingManager : departmentInfo.manager.name,
    joiningDate: joinningDate,
    jobType,
    role: 'employee',
    isActive: true,
   


 });


 await employee.save();


 const savedEmployee = await User.findById(employee._id).select('employeeId');
//  console.log(savedEmployee);
  
// updating salarySchema

  await Salary.findOneAndUpdate({ employeeId},
        { $set: { employee: savedEmployee._id}}).then(res => {
          console.log("salary details updated" , res);
        })
  

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

  try {
    const { search, department, status, page = 1, limit = 50 } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Search filter (searches in name, email, employeeId, position)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Department filter
    if (department && department !== 'all') {
      filter.department = { $regex: new RegExp(department, 'i') };
    }
    
    // Status filter
    if (status && status !== 'all') {
      let statusValue = status.toLowerCase();
      // Convert frontend status to backend status
      if (statusValue === 'on leave') statusValue = 'on_leave';
      filter.status = statusValue;
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    filter.role = 'employee';
    const employees = await User.find(filter)
      .select('-__v') // Exclude version key
      .sort({ createdAt: -1 })
      .populate("department" , "name") // Latest first
      .limit(parseInt(limit));
    
    
    const total = await User.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: employees
    });
    
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
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