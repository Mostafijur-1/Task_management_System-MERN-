import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTasks,
  FaProjectDiagram,
  FaHome,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <FaHome className="mr-2" />,
    },
    { path: "/tasks", name: "Tasks", icon: <FaTasks className="mr-2" /> },
    {
      path: "/projects",
      name: "Projects",
      icon: <FaProjectDiagram className="mr-2" />,
    },
  ];

  return (
    <div
      className={`bg-gray-800 text-white h-screen transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } fixed left-0 top-0 z-10`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        {!collapsed && <h1 className="font-bold text-xl">TaskMaster</h1>}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center py-3 px-4 hover:bg-gray-700 transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-gray-700 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        {!collapsed && (
          <div className="bg-gray-700 rounded-lg p-4 text-sm">
            <p className="font-semibold">Need help?</p>
            <p className="mt-1 text-gray-300">
              Check our documentation or contact support
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
