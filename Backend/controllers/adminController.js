const User = require("../models/user");
const Department =  require("../models/Department");
const Leave = require("../models/Leave");
const {status} = require("http-status");
const Salary = require("../models/Salary");
const Task = require("../models/tasks");
const SupportTicket = require("../models/supportTicket");
const {sendEmployeeRegistrationEmail , sendSalaryReceiptEmail} = require("../services/emailService.js");
const mongoose = require("mongoose");
// const logActivity = require("../models/Activity.js");
const logActivity = require("../utils/activityLogger.js");

const getDashboardstats = async (req,res,next) => {
  try {
    let Admin = await User.findOne({_id : req.user._id});
    let totalEmployees = await User.countDocuments({role : "employee"});
    let totalDepartments =  await Department.countDocuments({isActive : true});
    let activeEmployess =  await User.countDocuments({
      role : "employee",
      isActive : true});


const pendingLeaves = await Leave.countDocuments({
      status : "pending",
      });
      const departmentsManager = await Department.find({}).select("name manager").populate("manager" , "firstName");

  

    res.status(200).json({
      success : true,
      data : {
        stats : {
          Admin,
          totalEmployees,
          activeEmployess,
          totalDepartments,
          departmentsManager,
         
          pendingLeaves,
          
        },
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


const createEmployee = async (req, res, next) => {
  try {
    let url = null;
    let filename = null;
    console.log(req.file);
    
    if (req.file) {
      url = req.file.path;
      filename = req.file.filename;
    }

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
    } = req.body;

    console.log(address);

    // Validation
    if (!firstName || !personalEmail || !position || !department) {
      return res.status(400).json({
        success: false,
        message: "Please provide necessary details (firstName, personalEmail, position, department)"
      });
    }

    // Check if personal email already exists
    const existingEmail = await User.findOne({ personalEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Generate employee ID
    const generateEmployeeId = async () => {
      const lastEmployee = await User.findOne(
        { role: "employee" },
        { employeeId: true }
      ).sort({ createdAt: -1 });

      let nextNum = 2025;
      if (lastEmployee && lastEmployee.employeeId) {
        const match = lastEmployee.employeeId.match(/#EMP-(\d+)/);
        if (match && match[1]) {
          nextNum = parseInt(match[1]) + 1;
        }
      }
      return `#EMP-${nextNum}`;
    };

    const employeeId = await generateEmployeeId();

    
    const departmentName = department;
    const departmentInfo = await Department.findOne({ 
      name: departmentName 
    }).populate("manager", "firstName lastName");

    // Check if department exists
    if (!departmentInfo) {
      return res.status(404).json({
        success: false,
        message: `Department '${department}' not found`
      });
    }

    console.log(departmentInfo);

  
    // let parsedAddress = address;
    // if (typeof address === 'string') {
    //   try {
    //     parsedAddress = JSON.parse(address);
    //   } catch (e) {
    //     parsedAddress = address; 
    //   }
    // }

    // Create employee
    const employee = new User({
      employeeId,
      firstName,
      lastName,
      personalEmail,
      contactNumber,
      address,
      department: departmentInfo._id,
      position,
      gender,
      dob,
      reportingManager: departmentInfo?.manager 
        ? `${departmentInfo.manager.firstName} ${departmentInfo.manager.lastName}` 
        : "NOT ALLOTED",
      joiningDate: joinningDate,
      jobType,
      role: 'employee',
      profilePhoto: req.file ? {
        url: url,
        filename: filename
      } : null,
      isActive: true,
    });

  const emp =  await employee.save();

    const salaryDetail = new Salary({
      employee: emp._id, 
      employeeId,
      baseSalary,
      allowances,
      deductions,
      taxApply,
      netSalary
    });

    await salaryDetail.save();

    // Log activity
    await logActivity('employee_added', emp._id , {
      department: departmentInfo.name, 
      targetUserId: employee._id,
      relatedModel: 'User',
      relatedId: employee._id,
      metadata: {
        position: position,
        department: departmentInfo.name,
        email: personalEmail 
      }
    });

    // Return employee data
    const savedEmployee = await User.findById(employee._id)
      .select('employeeId firstName lastName personalEmail position')
      .populate('department', 'name');

    res.status(201).json({ // Use 201 for created
      success: true,
      message: "Employee created successfully",
      data: savedEmployee
    });

  } catch (err) {
    console.log("create employee error:", err);
    res.status(500).json({
      success: false,
      message: 'Error creating employee',
      error: err.message
    });
  }
};

const sentEmail = async(req,res) => {
  try {
    const { employeeId , formData} = req.body;
    

    
    const emailResult = await sendEmployeeRegistrationEmail({
      email: formData.personalEmail,
      employeeId: employeeId,
      name: `${formData.firstName} ${formData.lastName}`
    });
    
    res.status(201).json({
      success: true,
      message: 'Registration email sent.',
    });
    
  } catch (error) {
    console.error('Employee registration error email cant sent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sent email',
      error: error.message
    });
  }
}


const getEmployeebyId = async(req,res,next) => {
  try {
    // console.log(req.params);
    const employee = await User.findById(req.params.id).select("+resetPasswordToken").populate("department" , "name manager code").populate("createdBy" , "firstName lastName");


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
    const employeeLeave = await Leave.find({employee : req.params.id});
       const employeeSalaries = await Salary.find({employee : req.params.id});


    res.status(200).json({
      success : true,
      data : employee,
       tasks : employeeTasks,
leaves : employeeLeave,
Salaries :  employeeSalaries
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

let profilePhoto;
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
       profilePhoto = { url, filename };
    }


  const employee = await User.findByIdAndUpdate(id , { ...updatedData , department : departmentInfo._id , 
        reportingManager : `${departmentInfo?.manager?.firstName || "NOT AllOTED"}`,
        profilePhoto

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
         

 const employee = await User.findByIdAndDelete(id).populate("department" , "name");
          await Salary.deleteMany({employee : employee._id});
          await Task.deleteMany({ employee: employee._id });
          await Leave.deleteMany({employee : employee._id});
          await SupportTicket.deleteMany({employee : employee._id});
await logActivity('employee_deleted', req.user._id, {  // Changed from employee._id to req.user._id
    relatedModel: 'User',
    relatedId: id,
    metadata: {
        employeeName : employee?.firstName,  // Add employee name
        department: employee?.department?.name,  
        email: employee?.personalEmail, 
        deletionType: 'permanent'
    }
});
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
       await logActivity('employee_updated',employee._id, {
          targetUserId: employee._id,
          relatedModel: 'User',
          relatedId: employee._id,
          metadata: {
            action: 'deactivated',
            employeeName: `${employee.firstName} ${employee.lastName}`,
            previousStatus: 'active',
            newStatus: 'inactive'
          }
        });
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
        await logActivity('employee_updated', employee._id, {
          targetUserId: employee._id,
          relatedModel: 'User',
          relatedId: employee._id,
          metadata: {
            action: 'activated',
            employeeName: `${employee.firstName} ${employee.lastName}`,
            previousStatus: 'inactive',
            newStatus: 'active'
          }
        });
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

const leaveAction = async (req, res) => {
  try {
    const { Leaveid, action } = req.body;
    console.log(Leaveid);
    
    const updatedLeave = await Leave.findByIdAndUpdate(
      Leaveid, 
      { status: action },
      { new: true }
    ).populate('employee', 'leaveBalance firstName lastName');

    if (!updatedLeave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (action === 'Approved' || action === 'approved') {
      // Get the employee's current leave balance
      const employee = await User.findById(updatedLeave.employee._id).select('leaveBalance firstName lastName');
      
      if (employee) {
        const leaveType = updatedLeave.leaveType; // 'personal', 'annual', or 'sick'
        const daysToDeduct = updatedLeave.duration || updatedLeave.totalDays;
      
        if (employee.leaveBalance[leaveType] >= daysToDeduct) {
          employee.leaveBalance[leaveType] -= daysToDeduct;
          await employee.save();
          
          console.log(`Deducted ${daysToDeduct} days from ${leaveType} leave`);
        } else {
          throw new Error(`Insufficient ${leaveType} leave balance`);
        }
      }

      // LOG ACTIVITY - Leave Approved
      await logActivity('leave_approved', employee._id, {
        targetUserId: updatedLeave.employee._id,
        relatedModel: 'Leave',
        relatedId: updatedLeave._id,
        metadata: {
          leaveType: updatedLeave.leaveType,
          numberOfDays: updatedLeave.duration || updatedLeave.totalDays,
          employeeName: `${updatedLeave.employee.firstName} ${updatedLeave.employee.lastName}`,
          approvedBy: req.user._id
        }
      });

    } else if (action === 'Rejected' || action === 'rejected') {
      // LOG ACTIVITY - Leave Rejected
      await logActivity('leave_rejected', updatedLeave.employee._id, {
        targetUserId: updatedLeave.employee._id,
        relatedModel: 'Leave',
        relatedId: updatedLeave._id,
        metadata: {
          leaveType: updatedLeave.leaveType,
          numberOfDays: updatedLeave.duration || updatedLeave.totalDays,
          employeeName: `${updatedLeave.employee.firstName} ${updatedLeave.employee.lastName}`,
          rejectedBy: req.user._id,
          reason: updatedLeave.rejectionReason || 'No reason provided'
        }
      });
    }

    console.log(updatedLeave);
    
    return res.status(200).json({
      message: `Successfully ${action} leave`,
      success: true,
    });

  } catch(error) {
    console.error('Error action on leave', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}


const getEmployeesSalary = async (req,res) => {
  try{
      const employeesSalary = await Salary.find({}).populate("employee" , "firstName lastName position jobType status bankDetails");
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
  { $set: { Status: "paid" } }
);
       if(!updatedSalaries){
     return res.status(400).json({
        message : "no salary data to run payroll",
        success : false,
       
            })
  }
      // console.log(updatedSalaries);

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
    

await logActivity('task_assigned', req.user._id, {
      targetUserId: id, // The employee who got the task
      // relatedModel: 'Task',
      relatedId: task._id,
      metadata: {
        taskName,
        priority,
        dueDate,
        assignedTo: id
      }
    });

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


const getDepartmentTasks = async(req,res) => {
  try{
     const {id} = req.user._id;
     let departmentDetails;
     let departmentEmployees;
     let departmentTasks;
     if(req.user.role === "Admin"){
       departmentDetails = await Department.find({}).populate("manager" , "firstName lastName");
      departmentEmployees = await User.find({role : "employee"});
     }else{
 departmentDetails = await Department.findOne({
  manager: new mongoose.Types.ObjectId(id)
}).populate("manager", "firstName lastName");
      departmentEmployees = await User.find({department : departmentDetails._id});

     }
 
     if(!departmentDetails){
      return res.status(201).json({
        success : false,
        message : "No department Details"
     })
     }
     
      departmentTasks = await Task.find({});

     if(!departmentEmployees){
       return res.status(201).json({
        success : false,
        message : "No Employees in the department"
     })
     }
    return res.status(200).json({
      success : true,
      data : {
        role : req.user.role,
        departmentDetails,
        departmentEmployees,
        departmentTasks,

      }
     })
 
  }catch(err){
   console.error('Error getting department Task:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
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
    runPayroll,
    leaveAction,
    sentEmail,
    getDepartmentTasks
}