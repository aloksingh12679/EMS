const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {status} = require('http-status');

// api = api/v1/auth/login
const login = async(req,res,next) => {
try {
 const {email , password , employeeId} = req.body;
    if(!email && !employeeId){
        return res.status(400).json({"message" : "please fill all given fields"});
    }
console.log(email);
 let currUser;
 let loginType;

    if(email){
        if(!password){
            return res.status(400).json({"message" : "Password is required"})
        }
         
        currUser = await  User.findOne({email : email});
        loginType = 'email';

        if(!currUser){
        return res.status(status.NOT_FOUND).json({"message" : "Wrong email or Password"});
        }
         
        if(currUser.role !== 'admin'){
        return res.status(403).json({"message" : "Access Denied ! only admin can login"});

        }

        const isPasswordValid = await currUser.comparePassword(password);
        // console.log(isPasswordValid);
        if(!isPasswordValid){
            return res.status(status.NOT_FOUND).json({"message" : "wrong Password"});
        }


    }else if(employeeId){
        currUser = User.findOne({employeeId : employeeId.trim().toUppercase()});

        loginType = 'employeeId' ; 

        if(!currUser) {
        return res.status(status.NOT_FOUND).json({"message" : "Invalid Employee ID"});
        }

        if(currUser.role !== "employee") {
            return res.status(403).json({"message" : "Access Denied ! only Employee can login"});

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

    const redirectTo = currUser.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';

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

    res.status(status.OK).json({
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


module.exports = {
    login,
    logout,
    forgotPassword,
    getCurrentUser
}