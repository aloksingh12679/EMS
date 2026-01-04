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

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { logout } = useAuth();

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 1120;
            setIsMobile(mobile);
            // On mobile, sidebar starts closed
            // On desktop, sidebar starts open
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
        { icon: <MdDashboard />, label: "Dashboard", path: "/admin/dashboard" },
        { icon: <MdPeople />, label: "Employees", path: "/admin/employees" },
        { icon: <MdEventAvailable />, label: "Attendance", path: "/admin/attendance" },
        { icon: <MdPeople />, label: "Leaves", path: "/admin/leaves" },
        { icon: <MdPeople />, label: "Payroll", path: "/admin/salary" }
    ];

    const handleLogout = () => {
        logout();
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Mobile Hamburger Button - Always show on mobile */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-3 bg-white border border-gray-200 shadow-md text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    {isOpen ? <MdClose size={18} /> : <MdMenu size={18} />}
                </button>
            )}

            {/* Sidebar */}
            <aside 
                className={`
                    fixed w-64 min-h-screen bg-white border-r border-gray-200 text-gray-800 flex flex-col
                    transform transition-transform duration-300 ease-in-out z-40
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    ${!isMobile ? 'lg:translate-x-0' : ''}
                `}
            >
                {/* LOGO */}
                <div className="px-6 py-5 border-b border-gray-200 bg-white">
                    <h1 className="text-lg font-bold text-gray-900">EMS Portal</h1>
                    <p className="text-xs text-gray-500">Enterprise Admin</p>
                </div>

                {/* MENU */}
                <nav className="flex-1 px-3 py-4 space-y-1 bg-white">
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
                <div className="p-4 border-t border-gray-200 space-y-4 bg-gray-50">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Alex Morgan</p>
                            <p className="text-xs text-gray-500">Super Admin</p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 font-medium text-sm shadow-sm"
                    >
                        <MdLogout size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile when sidebar is open */}
            {isMobile && isOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30" 
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* CSS for responsive behavior */}
            <style>{`
                /* On screens 1120px and above, sidebar is always visible */
                @media (min-width: 1120px) {
                    aside {
                        transform: translateX(0) !important;
                    }
                    /* Hide hamburger button on desktop */
                    button.fixed.top-4.left-4 {
                        display: none !important;
                    }
                }
                
                /* On screens below 1120px */
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
            ${active ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
    >
        <div className={`${active ? "text-blue-600" : "text-gray-500"}`}>
            {icon}
        </div>
        <span className="text-sm">{label}</span>
    </button>
);

export default AdminSidebar;