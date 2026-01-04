import { FaUserPlus } from "react-icons/fa";
import { MdOutlineApproval } from "react-icons/md";
import { HiCurrencyDollar } from "react-icons/hi";

const QuickActions = () => {
    return (
        <div className="grid grid-cols-3 gap-6">
            <QuickActionCard
                icon={<FaUserPlus />}
                label="Add Employee"
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
            />
            <QuickActionCard
                icon={<MdOutlineApproval />}
                label="Approve Leave"
                iconBg="bg-orange-50"
                iconColor="text-orange-500"
            />
            <QuickActionCard
                icon={<HiCurrencyDollar />}
                label="Run Payroll"
                iconBg="bg-green-50"
                iconColor="text-green-600"
            />
        </div>
    );
};

/* -------- Card -------- */

const QuickActionCard = ({ icon, label, iconBg, iconColor }) => {
    return (
        <div
            className=" flex items-center gap-5 bg-white px-6 py-5 rounded-[20px] border border-slate-100 shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-[1px]
      "
        >
            {/* Icon */}
            <div className={` w-11 h-11 flex items-center justify-center rounded-[14px] ${iconBg} ${iconColor} text-lg`}>
                {icon}
            </div>

            {/* Text */}
            <span className="text-[15px] font-semibold text-slate-900">
                {label}
            </span>
        </div>
    );
};

export default QuickActions;
