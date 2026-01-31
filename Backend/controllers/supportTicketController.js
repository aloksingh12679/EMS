
const User = require('../models/user.js');
const SupportTicket = require('../models/supportTicket.js');


const Department = require('../models/Department.js');

// @desc    Create a new support ticket
// @route   POST /api/support-tickets
// @access  Employee
const createTicket = async (req, res) => {
    try {
        const { subject, category, priority, description } = req.body;
        console.log("=== CREATE TICKET DEBUG ===");
        console.log("Request Body:", req.body);
        console.log("User from middleware:", req.user);

        // Validation: Check required fields
        if (!subject || !category || !priority || !description) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                required: ['subject', 'category', 'priority', 'description']
            });
        }

        // Get employee ID from authenticated user
        const employeeId = req.user._id || req.user.id;
        console.log("Employee ID:", employeeId);

        // Verify the user exists and is an employee
        const employee = await User.findById(employeeId);
        console.log("Employee found:", employee);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        if (employee.role !== 'employee') {
            return res.status(403).json({
                success: false,
                message: 'Only employees can create support tickets',
                currentRole: employee.role
            });
        }

        // Check if employee has a department
        if (!employee.department) {
            return res.status(400).json({
                success: false,
                message: 'Employee is not assigned to any department'
            });
        }

        // Get department details
        const department = await Department.findById(employee.department);
        console.log("Department found:", department);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        // Check if department has a manager
        if (!department.manager) {
        res.status(403).json({
                message : "Your department has no manager assigned"
            })
            
            // // Create ticket without assignedTo (will be assigned later by admin)
            // const ticket = await SupportTicket.create({
            //     employee: employeeId,
            //     subject,
            //     category,
            //     priority,
            //     description,
            //     assignedTo: null, // No manager assigned
            //     status: 'Open'
            // });

            // console.log("Ticket created (no manager):", ticket);

            // // Populate employee details
            // await ticket.populate('employee', 'firstName lastName email employeeId');

            // return res.status(201).json({
            //     success: true,
            //     message: 'Support ticket created successfully. Will be assigned to department head soon.',
            //     ticket
            // });
        }

        // Create ticket with assigned manager
        const ticket = await SupportTicket.create({
            employee: employeeId,
            subject,
            category,
            priority,
            description,
            assignedTo: department.manager,
            status: 'Open'
        });

        console.log("Ticket created:", ticket);

        // Populate fields for response
        await ticket.populate([
            { path: 'employee', select: 'firstName lastName email employeeId' },
            { path: 'assignedTo', select: 'firstName lastName email' }
        ]);

        console.log("Ticket after populate:", ticket);

        // Create notification for department head
        try {
            await Notification.create({
                recipient: department.manager,
                sender: employeeId,
                type: 'Support Ticket',
                title: `New Support Ticket: ${ticket.subject}`,
                message: `${employee.firstName} ${employee.lastName} raised a ${ticket.priority} priority ticket`,
                relatedModel: 'SupportTicket',
                relatedId: ticket._id,
                link: `/admin/support-tickets/${ticket._id}`
            });
            console.log("Notification created successfully");
        } catch (notifError) {
            console.error("Error creating notification:", notifError);
            // Continue even if notification fails
        }

        return res.status(201).json({
            success: true,
            message: 'Support ticket created successfully',
            ticket
        });

    } catch (error) {
        console.error("=== CREATE TICKET ERROR ===");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);

        // Handle specific errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format',
                error: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error creating support ticket',
            error: error.message
        });
    }
};


// Get all tickets for admin (department head)
const getAdminTickets = async (req, res) => {
    try {
        const adminId = req.user.id; 

       const tickets = await SupportTicket.find({ assignedTo: adminId })
       .populate("employee" , "firstName lastName profilePhoto employeeId personalEmail")
    .sort({ createdAt: -1 });
     
    // const id = tickets[0].employee;
    // console.log(id);
    //        const employee = await User.findById(id);
    //        console.log(employee);

        console.log(tickets);

        res.status(200).json({
            success: true,
            count: tickets.length,
            unreadCount: tickets.filter(t => !t.isReadByAdmin).length,
            tickets: tickets
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tickets',
            error: error.message
        });
    }
};


const updateTicket = async(req,res) =>{
    try {
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { isReadByAdmin: true },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// // Get employee's own tickets
// exports.getMyTickets = async (req, res) => {
//     try {
//         const tickets = await SupportTicket.find({ 
//             employeeId: req.user._id 
//         })
//         .populate('assignedTo', 'firstName lastName email')
//         .populate('department', 'departmentName')
//         .sort({ createdAt: -1 });

//         res.status(200).json({
//             success: true,
//             count: tickets.length,
//             tickets
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching tickets',
//             error: error.message
//         });
//     }
// };



// // Get single ticket details
// exports.getTicketById = async (req, res) => {
//     try {
//         const ticket = await SupportTicket.findById(req.params.id)
//             .populate('employeeId', 'firstName lastName email employeeId profilePhoto')
//             .populate('assignedTo', 'firstName lastName email')
//             .populate('department', 'departmentName')
//             .populate('respondedBy', 'firstName lastName')
//             .populate('comments.commentedBy', 'firstName lastName role');

//         if (!ticket) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Ticket not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             ticket
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching ticket',
//             error: error.message
//         });
//     }
// };



module.exports = {
   createTicket,
   getAdminTickets,
   updateTicket
    
}