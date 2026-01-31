import { useEffect } from "react";
import AdminSidebar from "../../Components/AdminSidebar";
import { employeeService } from "../../services/employeeServices";

export default function Tickets(){
    useEffect(() => {
        fetchNotifications();
    })

    const fetchNotifications = async () => {
        try {
         
          const result = await employeeService.getTickets();
         
          console.log(result);
         
          }
         catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      return(
        <div>
            <AdminSidebar />
        </div>
      )
}