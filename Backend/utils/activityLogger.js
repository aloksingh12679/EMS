// utils/activityLogger.js
const Activity = require('../models/Activity');

const activityConfig = {
    leave_request: {
        icon: 'user',
        iconColor: 'slate',
        getTitle: (user) => `${user.firstName} ${user.lastName}`,
        getDescription: () => 'Applied for Sick Leave'
    },
    payroll_processed: {
        icon: 'dollar',
        iconColor: 'green',
        getTitle: () => 'Payroll System',
        getDescription: (data) => `${data.month} Payroll Processed`
    },
    employee_added: {
        icon: 'user-plus',
        iconColor: 'blue',
        getTitle: (user) => `New Hire: ${user.firstName} ${user.lastName?.charAt(0)}.`,
        getDescription: (data) => `Added to ${data.department}`
    },
    leave_approved: {
        icon: 'check-circle',
        iconColor: 'green',
        getTitle: (user) => `${user.firstName} ${user.lastName}`,
        getDescription: () => 'Leave Request Approved'
    },
    leave_rejected: {
        icon: 'x-circle',
        iconColor: 'red',
        getTitle: (user) => `${user.firstName} ${user.lastName}`,
        getDescription: () => 'Leave Request Rejected'
    },
    support_ticket: {
        icon: 'message-square',
        iconColor: 'yellow',
        getTitle: (user) => `${user.firstName} ${user.lastName}`,
        getDescription: (data) => `Support Ticket: ${data.subject}`
    }
};

const logActivity = async (type, userId, data = {}) => {
    try {
        const User = require('../models/user');
        const user = await User.findById(userId).select('firstName lastName');

        if (!user) return;

        const config = activityConfig[type];
        if (!config) return;

        await Activity.create({
            type,
            title: config.getTitle(user, data),
            description: config.getDescription(data),
            user: userId,
            targetUser: data.targetUserId || null,
            relatedModel: data.relatedModel || null,
            relatedId: data.relatedId || null,
            metadata: data.metadata || {},
            icon: config.icon,
            iconColor: config.iconColor
        });

    } catch (error) {
        console.error('Activity log error:', error);
    }
};

module.exports = logActivity;