const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
// const crypto = require('crypto');

const userSchema = new mongoose.Schema({
     
    // for admin login activity

    email : {
        type : String,
        required : function(){
            return this.role === 'Admin';
        },
        unique : true,
        sparse : true,
        lowercase : true,
        trim : true
    },

    password : {
        type :  String,
        required : function(){
            return this.role === 'Admin';
        },
        unique : true,
        sparse : true,
        trim : true,
        select : false
    } ,

   
    // for employee

    employeeId : {
        type : String,
        required : function(){
            return this.role === 'employee'
        },
        sparse : true,
        unique : true,
        trim :  true
    } ,

    // info of admin and employees depend on the user role
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    
    lastName: {
        type: String,
        required: true,
        trim: true
    },

contactNumber : {
    type : Number,
     required : function(){
            return this.role === 'employee'
        },
},
personalEmail : {
    type : String,
    trim : true,
     required : function(){
            return this.role === 'employee'
        },
},
dob: Date,
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
//  employment (naukri) information company mai 
department : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
},

 // Leave balance
    leaveBalance: {
        personal: { type: Number, default: 12 },
        sick: { type: Number, default: 10 },
        annual: { type: Number, default: 15 },
    },


     profilePhoto: {
        type: String,
        default  : 'default-avatar.png'
    },


position : {
    type : String,
    trim: true,
    default : function(){
        if(this.role == "Admin"){
          return "manager"
        }
    }
},

salary : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Salary'
}, 
 
joiningDate : {
    type : Date,
    default : Date.now
},

jobType : {
    type : String,
    enum : ['full-time' , 'part-time' , 'intern'],
    default : 'full-time'
}, 

address : {
 type : String,
 default  : "India"
    
}, 


//    others credentials - system needs
    role : {
        type : String,
        enum : ['Admin' , 'employee'],
        required : true
    },
    reportingManager : {
        type : String,
        default : "not alloted"
    }
,
    isActive: {
        type: Boolean,
        default: true
    },
    status: {
    type: String,
    enum: ['active', 'inactive', 'on leave'],  
    default: 'active' 
  },
    lastLogin: {
        type: Date
    },

    //  For password reset functionality
    resetPasswordToken: String,
    resetPasswordExpire: Date,


    // mainly for employees
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    } ,
    updatedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
}   , {
    timestamps : true   // createdAt and CreatedBy
})


userSchema.pre('save', async function(next) {
  try {
  
    if (this.password) {
     
      const isAlreadyHashed = this.password.startsWith('$2b$');
      
      if (!isAlreadyHashed) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
    }
    return;
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function(enteredCurrPass){
     if (!this.password) {
        const userWithPassword = await this.constructor.findById(this._id).select('+password');
        return await bcrypt.compare(enteredCurrPass, userWithPassword.password);
    }
        return await bcrypt.compare(enteredCurrPass,this.password);
};
const User = mongoose.model("User", userSchema);

module.exports = User;

