import { NavLink } from "react-router-dom";


const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Projects", path: "/projects" },
    { label: "Tasks", path: "/tasks" },
    { label: "Notifications", path: "/notifications" },
];


function Sidebar() {
    return (
        <aside>
            <div>
                <div>
                    <span>
                        Taskflow
                    </span>
                </div>

                <nav className="flex-1 space-y-1 px-2 pb-4 pt-2">
                    {navItems.map((item) => (

                        <NavLink key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `w-full flex items-center px-3 py-2 rounded-md text-sm font-medium
                            ${isActive
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }
                            `
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}

                </nav>
            </div>
        </aside>
    )
}
export default Sidebar;