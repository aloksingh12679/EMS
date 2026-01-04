import {
    HiUser,
    HiCurrencyDollar,
    HiUserAdd,
    HiExclamation,
    HiDocumentText,
} from "react-icons/hi";

const RecentActivity = () => {
    return (
        <div className="bg-white rounded-[24px] px-6 py-6 shadow-sm border border-slate-100 h-full">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[16px] font-semibold text-slate-900">
                    Recent Activity
                </h3>
                <span className="text-[13px] font-medium text-blue-600 cursor-pointer">
                    View All
                </span>
            </div>

            {/* Activity List */}
            <div className="space-y-5">
                <ActivityItem
                    icon={<HiUser />}
                    iconBg="bg-slate-100"
                    title="Sarah Johnson"
                    desc="Applied for Sick Leave"
                    time="2m ago"
                />

                <ActivityItem
                    icon={<HiCurrencyDollar />}
                    iconBg="bg-green-100 text-green-600"
                    title="Payroll System"
                    desc="Oct Payroll Processed"
                    time="1h ago"
                />

                <ActivityItem
                    icon={<HiUserAdd />}
                    iconBg="bg-blue-100 text-blue-600"
                    title="New Hire: Mike R."
                    desc="Added to Engineering"
                    time="3h ago"
                />

                <ActivityItem
                    icon={<HiExclamation />}
                    iconBg="bg-yellow-100 text-yellow-600"
                    title="System Alert"
                    desc="Server load peaked 85%"
                    time="5h ago"
                />

                <ActivityItem
                    icon={<HiDocumentText />}
                    iconBg="bg-slate-100"
                    title="Policy Update"
                    desc="Updated WFH policy"
                    time="1d ago"
                />
            </div>
        </div>
    );
};

/* -------- Single Activity Row -------- */

const ActivityItem = ({ icon, iconBg, title, desc, time }) => {
    return (
        <div className="flex items-start justify-between gap-4">

            {/* Left */}
            <div className="flex items-start gap-4">
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}
                >
                    {icon}
                </div>

                <div>
                    <p className="text-[14px] font-medium text-slate-900">
                        {title}
                    </p>
                    <p className="text-[13px] text-slate-500">
                        {desc}
                    </p>
                </div>
            </div>

            {/* Time */}
            <span className="text-[12px] text-slate-400 whitespace-nowrap">
                {time}
            </span>
        </div>
    );
};

export default RecentActivity;
