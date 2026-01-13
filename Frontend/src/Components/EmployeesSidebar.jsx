import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    MdDashboard,
    MdPeople,
    MdEventAvailable,
    MdLogout,
    MdMenu,
    MdClose
} from "react-icons/md";
import { useAuth } from '../context/AuthContext';
import { capitalize } from "../utils/helper";

const EmployeesSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { logout, user } = useAuth();

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 1120;
            setIsMobile(mobile);
            if (!mobile) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const menuItems = [
        { icon: <MdDashboard />, label: "Dashboard", path: "/employee/dashboard" },
        { icon: <MdPeople />, label: "Profile", path: "/employee/profile" },
        { icon: <MdEventAvailable />, label: "My tasks", path: "/employee/mytasks" },
        { icon: <MdPeople />, label: "Leaves", path: "/employee/apply-leave" },
        { icon: <MdPeople />, label: "Support System", path: "/employee/support-system" }
    ];

    const handleLogout = () => {
        logout();
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-3 left-4 z-50 p-2 bg-white border border-blue-200 shadow-md text-black rounded-xl hover:bg-blue-50 transition-colors"
                >
                    {isOpen ? <MdClose size={18} /> : <MdMenu size={18} />}
                </button>   
            )}

            {/* Sidebar */}
            <aside 
                className={`
                    fixed w-64 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 border-r border-blue-200 text-gray-800 flex flex-col
                    transform transition-transform duration-300 ease-in-out z-40
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    ${!isMobile ? 'lg:translate-x-0' : ''}
                `}
            >
                {/* LOGO */}
                <div className="px-6 py-5 border-b border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700">
                    <h1 className="text-lg font-bold text-white">EMS Portal</h1>
                    <p className="text-xs text-blue-100">Enterprise Employee</p>
                </div>

                {/* MENU */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {menuItems.map((item, index) => (
                        <MenuItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            active={location.pathname === item.path}
                            onClick={() => {
                                navigate(item.path);
                                if (isMobile) setIsOpen(false);
                            }}
                        />
                    ))}
                </nav>

                {/* USER CARD & LOGOUT */}
                <div className="p-4 border-t border-blue-200 space-y-3 bg-gradient-to-b from-blue-100 to-blue-200">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                            <span className="text-white font-bold text-sm">{capitalize(user?.firstName.charAt(0) + user?.lastName.charAt(0))}</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-900 truncate">{capitalize(user?.firstName + " " + user?.lastName || "E")}</p>
                            <p className="text-xs text-blue-600 font-medium">Employee</p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:scale-[0.97] transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
                    >
                        <MdLogout size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30" 
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* CSS for responsive behavior */}
            <style>{`
                @media (min-width: 1120px) {
                    aside {
                        transform: translateX(0) !important;
                    }
                    button.fixed.top-4.left-4 {
                        display: none !important;
                    }
                }
                
                @media (max-width: 1119px) {
                    aside {
                        transform: translateX(-100%);
                    }
                    aside.translate-x-0 {
                        transform: translateX(0) !important;
                    }
                }
            `}</style>
        </>
    );
};

const MenuItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer
            ${active ? "bg-white text-blue-600 border-l-4 border-blue-600 font-semibold shadow-sm" : "text-gray-700 hover:bg-white/50 hover:text-blue-600"}`}
    >
        <div className={`${active ? "text-blue-600" : "text-gray-600"}`}>
            {icon}
        </div>
        <span className="text-sm">{label}</span>
    </button>
);

export default EmployeesSidebar;