import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  ChevronDown,
  Search,
  Filter,
} from "lucide-react";
import authService from "../services/authService";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await authService.deleteUser(userId);
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await authService.updateUserRole(userId, newRole);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, roles: [newRole] } : user
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" || (user.roles && user.roles.includes(roleFilter));

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => {
            setCurrentUser(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <UserPlus size={18} className="mr-2" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="flex items-center">
              <Filter size={18} className="text-gray-400 mr-2" />
              <select
                className="appearance-none px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="text-sm bg-gray-100 border border-gray-300 rounded-md px-2 py-1"
                      value={
                        user.roles && user.roles[0] ? user.roles[0] : "user"
                      }
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="user">User</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No users match your current search criteria
            </p>
          </div>
        )}
      </div>

      {/* User Modal would go here */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {currentUser ? "Edit User" : "Add New User"}
            </h2>
            {/* User form would go here */}
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                onClick={() => setShowModal(false)}
              >
                {currentUser ? "Update User" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
