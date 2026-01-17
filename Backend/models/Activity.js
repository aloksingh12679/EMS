// models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: [
            'leave_request',
            'payroll_processed',
            'employee_added',
            'employee_updated',
            'employee_deleted',
            'salary_updated',
            'leave_approved',
            'leave_rejected',
            'support_ticket',
            'attendance_marked'
        ]
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    relatedModel: {
        type: String,
        enum: ['Leave', 'User', 'Salary', 'SupportTicket', 'Attendance', null]
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    icon: {
        type: String,
        default: 'user'
    },
    iconColor: {
        type: String,
        default: 'blue'
    }
}, {
    timestamps: true
});

// Index for faster queries
activitySchema.index({ createdAt: -1 });
activitySchema.index({ type: 1 });

module.exports = mongoose.model('Activity', activitySchema);