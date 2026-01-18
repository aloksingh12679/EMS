const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {status} = require('http-status');
const dotenv = require("dotenv");
const Department = require("../models/Department")
dotenv.config();

// api = api/v1/auth/login
const login = async(req,res,next) => {
try {
    console.log("here");
 const {email , password , employeeId , role} = req.body;
    if(!email && !employeeId){
        return res.status(400).json({"message" : "please fill all given fields"});
    }
console.log(employeeId);
 let currUser;
 let loginType;

    if(role === "Admin" && email){
        console.log(role);
        if(!password){
            return res.status(400).json({"message" : "Password is required"})
        }
         
        currUser = await  User.findOne({email : email});
        loginType = 'email';

        if(!currUser){
        return res.status(404).json({"message" : "Wrong email or Password"});
        }
         
        if(currUser.role === 'employee' ){
        return res.status(403).json({"message" : "Access Denied ! only admin can login"});

        }

        const isPasswordValid = await currUser.comparePassword(password);
        // console.log(isPasswordValid);
        if(!isPasswordValid){
            return res.status(400).json({"message" : "wrong Password"});
        }


    }else if(role === "employee" && employeeId){
        currUser = await User.findOne({employeeId : employeeId});
      console.log(currUser);
        loginType = 'employeeId' ; 

        if(!currUser) {
        return res.status(400).json({"message" : "Invalid Employee ID"});
        }
        if(currUser.personalEmail !== email){
            return res.status(400).json({"message" : "Invalid email Id"});
        }

        if(currUser.role !== "employee") {
            return res.status(403).json({"message" : "Access Denied ! only Employee can login"});

        }
        if(password){
        const isPasswordValid = await currUser.comparePassword(password);
        if(!isPasswordValid){
            return res.status(400).json({"message" : "wrong Password"});
        }

        }else{
                        return res.status(403).json({"message" : "Enter password"});

        }
      
        
    }

    if(currUser.isActive === false){
         return res.status(403).json({"message" : "Account is deactivated.  please contact administrator"});
    }

    currUser.lastLogin = new Date();
    await currUser.save();

    const tokenPayload = {
        userId : currUser._id,
        role : currUser.role,
        email : currUser.email, // if logintype email
        employeeId : currUser.employeeId, // if logintype employeeId,
        name : `${currUser.firstName} ${currUser.lastName}`
    };

    const tokenExpiry = currUser.role === 'admin' ? `24h` : `8h`;

    const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
        {expiresIn : tokenExpiry}
    );

    const redirectTo = currUser.role === 'Admin' ? '/admin/dashboard' : '/employee/dashboard';

    const userResponse = {
        id : currUser._id,
        firstName : currUser.firstName,
        lastName : currUser.lastName,
        fullName : currUser.fullName,
        email : currUser.email,
        employeeId : currUser.employeeId,
        role : currUser.role,
        isActive : currUser.isActive,
        lastLogin : currUser.lastLogin
    }

    res.status(200).json({
        success : true,
        message : 'login succesfully',
        token,
        user : userResponse,
        redirectTo,
        loginType,
        expiresIn : tokenExpiry
    });
}catch(err){
    console.log(err);
        return res.status(400).json({"message" : `${err.message}`});
};

}


const logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};





const getCurrentUser = async(req,res,next) => {
    try{
       const user = req.user;
       res.status(status.OK).json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.email,
                employeeId: user.employeeId,
                role: user.role,
                isActive: user.isActive,
                lastLogin: user.lastLogin
            }
        });
    }catch(err){
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

const forgotPassword = async (req,res,next) =>{
    try{
       const {email} = req.body;

       if(!email){
        return res.status(status.NOT_FOUND).json({
            message : "please provide email address",
        });
       }
        const user = await User.findOne({email : email.toLowerCase().trim()});

        if(!user){
            return res.status(OK).json({
                success : true,
                message : 'If an account exists with this email, you will receive a password reset link.'
            })
        }

        // TODO - email sending 

         res.status(200).json({
            success: true,
            message: 'Password reset email sent',
        });

    }catch(err){
        console.log("forgot password error" , err);
  return res.status(500).json({
    success : false,
    message : "server error",
  })
    }
}


const register = async (req, res) => {
    try {
        const {form} = req.body;
        const { 
            fullName, 
            email, 
            mobileNumber, 
            password, //admin123
            confirmPassword,
            department, 
            registerAs, 
            secretKey 
        } = form;
// console.log(req.body);
        // Validation
        if (!fullName || !email || !password || !confirmPassword || !registerAs) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Validate email format
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }


        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

      
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // registerAs
        if (!['Department Head', 'Admin'].includes(registerAs)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid registration type. Must be HR or Admin'
            });
        }

         const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

         const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || nameParts[0];

        const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
        const DEPARTMENT_HEAD_SECRET_KEY= process.env.DEPARTMENT_HEAD_SECRET_KEY;
        
        if (registerAs === 'Admin' && secretKey === ADMIN_SECRET_KEY) {
             const user = await User.create({
    firstName,
    lastName,
    email,
    contactNumber: mobileNumber || null,
    password, // Will be hashed by pre-save middleware
    role: registerAs,
    isActive: true,
    status: 'active'
});
           
        }else if(registerAs === 'Department Head' && secretKey === DEPARTMENT_HEAD_SECRET_KEY){
const user = await User.create({
    firstName,
    lastName,
    email,
    contactNumber: mobileNumber || null,
    password, // Will be hashed by pre-save middleware
    role: registerAs,
    isActive: true,
    status: 'active'
});
const departmentInfo = await Department.findOneAndUpdate(
    { name : department }, 
    { manager: user._id }, 
    { 
        new: true, 
        upsert: false 
    }
);

console.log(departmentInfo);
        
       
const employees = await User.updateMany(
      { department: departmentInfo._id }, 
  { $set: {reportingManager: fullName } }
)
        }else{
             return res.status(403).json({
                success: false,
                message: 'Invalid secret key. Only authorized HRs can register.'
            });
        }

     

        res.status(201).json({
            success: true,
            message: 'Registration successful',
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};



const createPassword = async (req, res) => {
  try {
    const { employeeId, password, confirmPassword } = req.body;

    if (!employeeId || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

   
    const employee = await User.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // 4️⃣ Prevent resetting if password already exists
    if (employee.password) {
      return res.status(400).json({
        success: false,
        message: "Password already created"
      });
    }

    
    employee.password = password;
    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Password created successfully"
    });

  } catch (err) {
    console.error("Password creation error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};




module.exports = {
    login,
    logout,
    forgotPassword,
    getCurrentUser,
    createPassword,
    register
}