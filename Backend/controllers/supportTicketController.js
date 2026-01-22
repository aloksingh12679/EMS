
const User = require('../models/user.js');
const SupportTicket = require('../models/supportTicket.js');


const Department = require('../models/Department.js');

// @desc    Create a new support ticket
// @route   POST /api/support-tickets
// @access  Employee
const createTicket = async (req, res) => {
    try {
        const { subject, category, priority, description} = req.body;
        console.log(req.body);
        const employeeId = req.user.id; // From auth middleware
        console.log(employeeId);

        // Verify the user is an employee
        const employee = await User.findById(employeeId);
        if (!employee || employee.role !== 'employee') {
            return res.status(403).json({
                success: false,
                message: 'Only employees can create support tickets'
            });
        }
        const department = await Department.findById(employee.department);

        const ticket = await SupportTicket.create({
            employee: employeeId,
            subject,
            category,
            priority,
            description,
            assignedTo : department.manager
            
        });

        // Populate fields for response
        await ticket.populate('assignedTo', 'firstName lastName email');
        // await ticket.populate('department', 'departmentName');

        // // Create notification for department head
        // await Notification.create({
        //     recipient: ticket.assignedTo,
        //     sender: req.user._id,
        //     type: 'Support Ticket',
        //     title: `New Support Ticket: ${ticket.subject}`,
        //     message: `${employee.firstName} ${employee.lastName} raised a ${ticket.priority} priority ticket`,
        //     relatedModel: 'SupportTicket',
        //     relatedId: ticket._id,
        //     link: `/admin/support-tickets/${ticket._id}`
        // });

        res.status(200).json({
            success: true,
            message: 'Support ticket created successfully',
            ticket
        });

    } catch (error) {
        res.status(500).json({
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