const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
    employee : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    month : {
        type : String,
        required: true
    },
    basicSalary : {
        type : Number,
        required : true

    },
allowances: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
}
)


salarySchema.index({ employee: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Salary', salarySchema);
