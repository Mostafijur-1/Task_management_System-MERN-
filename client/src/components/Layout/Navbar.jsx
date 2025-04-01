import React, { useContext } from "react";
import { FaBell, FaSearch, FaUserCircle, FaCog } from "react-icons/fa";
import { AuthContext } from "../Auth/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (dropdownOpen) setDropdownOpen(false);
  };

  return (
    <div className="bg-white shadow-md fixed top-0 right-0 left-0 z-10 ml-64">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center rounded-md bg-gray-100 px-3 py-2 w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            className="bg-transparent border-none outline-none w-full text-gray-700"
            type="text"
            placeholder="Search tasks, projects..."
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200 relative"
            >
              <FaBell className="text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-bold text-gray-700">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-800">
                      New task assigned to you
                    </p>
                    <p className="text-xs text-gray-500 mt-1">3 minutes ago</p>
                  </div>
                  <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-800">
                      Project deadline approaching
                    </p>
                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                  </div>
                </div>
                <div className="p-2 text-center">
                  <button className="text-sm text-blue-500 hover:text-blue-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2"
            >
              <FaUserCircle className="text-gray-600 text-2xl" />
              <span className="font-medium text-gray-700">
                {user?.name || "User"}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <div className="flex items-center">
                    <FaCog className="mr-2" />
                    Settings
                  </div>
                </button>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
