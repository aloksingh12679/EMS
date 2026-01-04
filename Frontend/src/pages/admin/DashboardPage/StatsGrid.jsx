const StatsCard = ({ title, value, badge, badgeType, description, }) => {
    const badgeStyles = {
        positive: "bg-green-100 text-green-700",
        warning: "bg-orange-100 text-orange-700",
        neutral: "bg-slate-100 text-slate-600",
    };

    return (
        <div className="bg-white rounded-[24px] px-6 py-5 border border-slate-100 shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-[14px] font-medium text-slate-500">
                    {title}
                </p>

                <span
                    className={`text-[12px] font-semibold px-3 py-1 rounded-full ${badgeStyles[badgeType]
                        }`}
                >
                    {badge}
                </span>
            </div>

            {/* Value */}
            <h2 className="text-[28px] font-bold text-slate-900 mb-1">
                {value}
            </h2>

            {/* Description */}
            <p className="text-[13px] text-slate-500">
                {description}
            </p>
        </div>
    );
};

export default StatsCard;
