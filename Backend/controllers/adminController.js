const User = require("../models/user");
const Department =  require("../models/Department");
const Leave = require("../models/Leave");
const {status} = require("http-status");
const Salary = require("../models/Salary");
const Task = require("../models/tasks");


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
    console.log(req.file);
    
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

console.log(address);
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
 const departmentInfo = await Department.findOne({name : department}).populate("manager" , "firstName lastName");
 
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
    address: address,
    department: departmentInfo._id || null,
    position,
    gender,
    dob,
    reportingManager : `${departmentInfo.manager.firstName} ${departmentInfo.manager.lastName}`,
    salary : employeeSalary._id,
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
    // console.log(req.params);
    const employee = await User.findById(req.params.id).select("+resetPasswordToken").populate("department" , "name manager code").populate("createdBy" , "firstName lastName").populate("salary");


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
    const employeeTasks = await Task.find({employee : req.params.id});
   

    res.status(200).json({
      success : true,
      data : employee,
       tasks : employeeTasks
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

  const {department} = updatedData;
  
 const departmentInfo = await Department.findOne({name : department}).populate("manager" , "firstName lastName");

// updatedBy : req.user._id

  const employee = await User.findByIdAndUpdate(id , { ...updatedData , department : departmentInfo._id , 
        reportingManager : `${departmentInfo.manager.firstName} ${departmentInfo.manager.lastName}`,

  } , {new :true , runValidators : true})
  .select('-password').populate('department' , 'name');

console.log(employee);
  if(!employee){
    return res.status(status.NOT_FOUND).json({
                success: false,
                message: 'Employee not found'
            });
  }

   res.status(status.OK).json({
            success: true,
            message: 'Employee updated successfully',
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
    const { id } = req.params;
    console.log(id);
    const password = req.headers['x-password'];
    const hardDelete = req.headers['x-hard-delete'];
    const status = req.headers['x-status'];
   
    
    if(hardDelete){
     
        const user = req.user;
       const Admin = await User.findOne({_id : user._id}).select("+password");
               const isPasswordValid = await Admin.comparePassword(password);
              

        if(isPasswordValid){
          console.log(isPasswordValid);
         

 const employee = await User.findByIdAndDelete(id);
          await Salary.findByIdAndDelete(employee.salary);

       if(!employee){
        return res.status(400).json({
          success : false,
          message : "Employee Not found"
        });

       }
               return res.status(200).json({
                success: true,
                message: 'Employee permanently deleted'
            });
       }else if(isPasswordValid === false){
         return res.status(400).json({
          success : false,
          message : "Wrong password can't Delete Employee"
        });}

      
    }else{
      if(status === "active"){
 const employee = await User.findByIdAndUpdate(id , {
        status : "inactive",
        isActive : false
      });
       if(!employee){
        return res.status(400).json({
          success : false,
          message : "Employee Not found"
        });
       }
       return res.status(200).json({
        success : true,
         message : "Employee Account deactivated succesfully"
       })
      }else{
        const employee = await User.findByIdAndUpdate(id , {
        status : "active",
        isActive : true
      });
       if(!employee){
        return res.status(400).json({
          success : false,
          message : "Employee Not found"
        });
       }
       return res.status(200).json({
        success : true,
         message : "Employee Activated succesfully"
       })

      }

     

    }
   }catch(err){
    console.log("delete employee error" , err);
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
      .select('-__v')
      .sort({ createdAt: -1 })
      .populate("department" , "name")
      .limit(parseInt(limit));
    
    
    const total = await User.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: employees.length,
      total,
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


const getleavesDetail = async (req,res) => {
  try{
      const employeeLeaves = await Leave.find({}).populate("employee" , "firstName employeeId");
      // console.log(employeeLeaves);

      return res.status(200).json({
        message : "working",
        success : true,
        data : employeeLeaves
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




const getEmployeesSalary = async (req,res) => {
  try{
      const employeesSalary = await Salary.find({}).populate("employee" , "firstName lastName position jobType status");
      // console.log(employeeLeaves);

      return res.status(200).json({
        message : "working",
        success : true,
        data : employeesSalary
            })
    

  }catch(error){
 console.error('Error fetching employees salary details :', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}

const updateSalary = async(req,res) => {
   try{
  const {updateData} = req.body;
  console.log(updateData);
  if(!updateData){
     return res.status(400).json({
        message : "Fill the fields properly",
        success : false,
       
            })
  }

      const updatedSalary = await Salary.findByIdAndUpdate(updateData.id, {
        baseSalary : updateData.baseSalary,
        allowances : updateData.allowances,
        taxApply : updateData.taxApply,
        deductions : updateData.deductions,
        netSalary : updateData.netSalary
      });

       if(!updatedSalary){
     return res.status(400).json({
        message : "no salary data of this employee",
        success : false,
       
            })
  }
      console.log(updatedSalary);

      return res.status(200).json({
        message : "Salary updated succesfully",
        success : true,
      
            })
    

  }catch(error){
 console.error('Error updating salary details :', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}


const runPayroll = async(req,res) => {
   try{
   

const updatedSalaries = await Salary.updateMany(
  { Status: "due" }, 
  { $set: { Status: "processing" } }
);
       if(!updatedSalaries){
     return res.status(400).json({
        message : "no salary data to run payroll",
        success : false,
       
            })
  }
      console.log(updatedSalaries);

      return res.status(200).json({
        message : "succesfully executed payroll",
        success : true,
      
            })
    

  }catch(error){
 console.error('payroll error :', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}



const addTask = async(req,res) => {
  try{
      const {id} = req.params;
      // console.log(req.body);
      const {taskName , description , dueDate , priority} = req.body;
      
      
      const newTask = new Task({

        employee : id,
        taskName,
        description,
        dueDate,
        priority,
        startDate : Date.now()
      });

     const task = await newTask.save();
 



      return res.status(200).json({
        message : "working",
        success : true,
       
            })
    

  }catch(error){
 console.error('Error fetching employees salary details :', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}


















module.exports = {
    getDashboardstats, 
    getAllEmployees,
    getEmployeebyId,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getAlldepartments,
    createDepartment,
    getleavesDetail,
    getEmployeesSalary,
    updateSalary,
    addTask,
    runPayroll
}