const Topbar = () => {
    return (
        <div className="flex items-start justify-between mb-10">

            {/* LEFT */}
            <div>
                <h1 className="text-[32px] font-bold text-slate-900 mb-2">
                    Welcome back, Alex 👋
                </h1>
                <p className="text-slate-500 text-[15px]">
                    Here's what's happening in your organization today.
                </p>
            </div>

            {/* RIGHT STATUS */}
            <div className="flex items-center gap-3">
                

                <button className="bg-black text-white py-2 px-5 rounded-[15px] hover:bg-[#0F1729]/90">
                    Add Employee
                </button>
            </div>
        </div>
    );
};

export default Topbar;
