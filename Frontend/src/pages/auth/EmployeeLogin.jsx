export default function EmployeeLogin() {
  return (
    <div className="min-h-screen flex bg-[#f6f7f8] font-[Inter]">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative text-white">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600"
          className="absolute inset-0 w-full h-full object-cover"
          alt="office"
        />
        <div className="absolute inset-0 bg-[#0f1729]/80"></div>

        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">grid_view</span>
            <span className="font-bold">Enterprise EMS</span>
          </div>

          <div>
            <h1 className="text-4xl font-bold leading-tight mb-6">
              Streamlined workforce management for the modern enterprise.
            </h1>

            {/* PROFILE IMAGES */}
            <div className="flex items-center gap-3 text-blue-200 text-sm">
              <div className="flex -space-x-3">
                <img
                  src="https://i.pravatar.cc/40?img=1"
                  className="w-8 h-8 rounded-full border-2 border-white"
                  alt="user1"
                />
                <img
                  src="https://i.pravatar.cc/40?img=2"
                  className="w-8 h-8 rounded-full border-2 border-white"
                  alt="user2"
                />
                <img
                  src="https://i.pravatar.cc/40?img=3"
                  className="w-8 h-8 rounded-full border-2 border-white"
                  alt="user3"
                />
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-xs">
                  +2k
                </div>
              </div>
              Join 2,000+ employees
            </div>
          </div>

          <div className="text-sm text-white/50">
            © 2024 Enterprise Corp · Privacy · Terms
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(#dcdfe4_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative bg-white w-[420px] rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-[#0f1729] mb-2">
            Employee Portal
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            Securely access your dashboard using your unique ID.
          </p>

          <label className="block mb-4">
            <span className="text-sm font-semibold">Employee ID</span>
            <div className="relative mt-2">
              <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">
                badge
              </span>
              <input
                placeholder="Ex: 884-210"
                className="w-full h-12 pl-10 pr-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#0f1729]/20"
              />
            </div>
          </label>

          <button className="w-full h-12 bg-[#0f1729] hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
            Secure Login
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>

          <p className="text-center text-sm text-slate-500 mt-4">
            Forgot ID?
          </p>

          <div className="mt-6 border rounded-xl p-4 bg-slate-50">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                SYSTEM OPERATIONAL
              </span>
              <span className="text-slate-400">v2.4.0</span>
            </div>

            <div className="mt-2 h-1.5 bg-slate-200 rounded-full">
              <div className="h-full w-full bg-[#0f1729] rounded-full"></div>
            </div>
          </div>

          <div className="mt-6 text-xs text-slate-400 flex justify-center items-center gap-1">
            <span className="material-symbols-outlined text-sm">lock</span>
            Protected by Enterprise Grade Security
          </div>
        </div>
      </div>
    </div>
  );
}
