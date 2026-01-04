const SalaryDistribution = () => {
    return (
        <div className="bg-white rounded-[24px] px-8 py-7 shadow-sm border border-slate-100">
            {/* Title */}
            <h3 className="text-[18px] font-semibold text-slate-900 mb-8">
                Salary Distribution
            </h3>

            {/* Bars Container */}
            <div className="grid grid-cols-4 gap-8 items-end h-[200px]">
                <SalaryBar label="<30k" fill="35%" />
                <SalaryBar label="30-50k" fill="55%" />
                <SalaryBar label="50-80k" fill="85%" active />
                <SalaryBar label="80k+" fill="45%" />
            </div>
        </div>
    );
};

/* -------- Bar Component -------- */

const SalaryBar = ({ label, fill, active }) => {
    return (
        <div className="flex flex-col items-center justify-end h-full">

            {/* Bar Background */}
            <div className="w-full h-full bg-slate-100 rounded-[20px] flex items-end overflow-hidden">

                {/* Filled Bar */}
                <div
                    className={`w-full rounded-[20px] ${active ? "bg-[#0B1220]" : "bg-[#111827]"
                        }`}
                    style={{ height: fill }}
                />
            </div>

            {/* Label */}
            <span className="mt-4 text-[13px] font-medium text-slate-500">
                {label}
            </span>
        </div>
    );
};

export default SalaryDistribution;
