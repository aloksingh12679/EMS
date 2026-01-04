const AiAnalyticsCard = () => {
    return (
        <div className="rounded-3xl p-8 bg-gradient-to-br from-[#0B1220] to-[#1E3A8A] h-fit">


            <div>
                <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-white text-sm mb-4">
                    🚀 New Feature
                </span>

                <h3 className="text-2xl text-white font-bold mb-3">
                    AI Analytics Beta
                </h3>

                <p className="text-slate-200 text-sm leading-relaxed">
                    Predict attrition risks and optimize workforce planning
                    with our new AI engine.
                </p>
            </div>

            <button className="mt-4 w-full rounded-lg bg-white py-2 text-sm font-semibold text-primary transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Try it now
            </button>
        </div>
    );
};

export default AiAnalyticsCard;
