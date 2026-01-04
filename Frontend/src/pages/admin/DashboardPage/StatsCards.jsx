const StatsCard = ({
    title,
    value,
    description,
    badge,
    badgeType = "neutral",
    icon,
    iconBg,
    highlight = false,
}) => {
    const badgeStyles = {
        success: "bg-green-100 text-green-700",
        info: "bg-green-100 text-green-700",
        warning: "bg-orange-100 text-orange-700",
        neutral: "bg-slate-100 text-slate-600",
    };

    return (
        <div
            className={`
        bg-white
        rounded-[28px]
        p-6
        border
        shadow-sm
        transition
        ${highlight
                    ? "border-orange-300"
                    : "border-slate-100"
                }
      `}
        >
            {/* TOP ROW (ICON + BADGE) */}
            {(icon || badge) && (
                <div className="flex items-center justify-between mb-6">
                    {icon ? (
                        <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}
                        >
                            {icon}
                        </div>
                    ) : (
                        <div />
                    )}

                    {badge && (
                        <span
                            className={`text-[13px] font-semibold px-3 py-1 rounded-full ${badgeStyles[badgeType]}`}
                        >
                            {badge}
                        </span>
                    )}
                </div>
            )}

            {/* TITLE */}
            <p className="text-[14px] font-medium text-slate-600 mb-2">
                {title}
            </p>

            {/* VALUE */}
            <h2 className="text-[30px] font-bold text-[#0F1729] leading-tight">
                {value}
            </h2>

            {/* DESCRIPTION (OPTIONAL) */}
            {description && (
                <p className="mt-1 text-[13px] text-slate-500">
                    {description}
                </p>
            )}
        </div>
    );
};

export default StatsCard;
    