const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
// const crypto = require('crypto');

const userSchema = new mongoose.Schema({
     
    // for admin login activity

    email : {
        type : String,
        required : function(){
            return this.role === 'admin';
        },
        unique : true,
        sparse : true,
        lowercase : true,
        trim : true
    },

    password : {
        type :  String,
        required : function(){
            return this.role === 'admin';
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
    trim:true
},
personalEmail : {
    type : String,
    trim : true,
    required : true
},
//  employment (naukri) information company mai 
department : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
},

position : {
    type : String,
    trim: true
},

salary : {
    type : Number,
    default : 0,
    min : [0]
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
    city : String,
    state : String,
    country : {
        type : String,
        default : 'india'
    },
    pincode : String
    
}, 


//    others credentials - system needs
    role : {
        type : String,
        enum : ['admin' , 'employee'],
        required : true
    },

    isActive: {
        type: Boolean,
        default: true
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


userSchema.pre('save', async function() {
   
    if (!this.isModified('password')) {
        return;
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    
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