import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const AdminSidebar = () => {
  const { user } = useAuth();

  return (
    <div className="w-64 bg-gray-800 text-white h-full overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Admin Panel</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your application</p>
      </div>

      <div className="px-4 py-2 bg-gray-900 text-gray-400 text-xs font-semibold">
        ADMIN CONTROLS
      </div>

      <nav className="mt-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white ${
              isActive
                ? "bg-gray-700 text-white border-l-4 border-blue-500"
                : ""
            }`
          }
        >
          <span className="mr-3">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
          </span>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white ${
              isActive
                ? "bg-gray-700 text-white border-l-4 border-blue-500"
                : ""
            }`
          }
        >
          <span className="mr-3">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
          </span>
          User Management
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white ${
              isActive
                ? "bg-gray-700 text-white border-l-4 border-blue-500"
                : ""
            }`
          }
        >
          <span className="mr-3">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </span>
          System Settings
        </NavLink>
      </nav>

      <div className="px-4 py-2 mt-6 bg-gray-900 text-gray-400 text-xs font-semibold">
        APPLICATION
      </div>

      <nav className="mt-2">
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white ${
              isActive
                ? "bg-gray-700 text-white border-l-4 border-blue-500"
                : ""
            }`
          }
        >
          <span className="mr-3">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              ></path>
            </svg>
          </span>
          Projects
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white ${
              isActive
                ? "bg-gray-700 text-white border-l-4 border-blue-500"
                : ""
            }`
          }
        >
          <span className="mr-3">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
          </span>
          Tasks
        </NavLink>
      </nav>

      <div className="px-6 py-4 mt-6 border-t border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-lg font-semibold text-white">
              {user?.name?.charAt(0) || "A"}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">
              {user?.name || "Admin User"}
            </p>
            <p className="text-xs font-medium text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
