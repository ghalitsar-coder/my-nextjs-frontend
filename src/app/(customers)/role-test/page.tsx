"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type User = {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  address?: string;
};

type RoleStatusResponse = {
  isAdmin: boolean;
  isCashier: boolean;
  isCustomer: boolean;
};

export default function RoleTestPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleStatus, setRoleStatus] = useState<RoleStatusResponse | null>(null);
  const [roleUpdateInput, setRoleUpdateInput] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch user role status
  const checkUserRole = async (userId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/check-role`);
      if (!response.ok) {
        throw new Error("Failed to check user role");
      }
      const data = await response.json();
      setRoleStatus(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const updateUserRole = async (userId: number, role: string) => {
    try {
      setLoading(true);
      setUpdateStatus("");

      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      const updatedUser = await response.json();

      // Update the users list
      setUsers(
        users.map((user) => (user.userId === userId ? updatedUser : user))
      );
      setSelectedUser(updatedUser);
      setUpdateStatus(`Role successfully updated to ${role}`);

      // Refresh role status
      await checkUserRole(userId);
    } catch (err: any) {
      setError(err.message);
      setUpdateStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle user selection
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setError("");
    setUpdateStatus("");
    setRoleUpdateInput(user.role || "");
    checkUserRole(user.userId);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Role Management</h1>
        <p className="text-gray-600">
          Test the role-based functionality in the application
        </p>
        <div className="mt-2">
          <Link href="/" className="text-blue-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Users</h2>
          {loading && !users.length ? (
            <div className="text-center py-4">Loading users...</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li
                  key={user.userId}
                  className={`py-3 px-2 cursor-pointer hover:bg-gray-50 ${
                    selectedUser?.userId === user.userId ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="font-medium">{user.fullName}</div>
                  <div className="text-sm text-gray-500">{user.username}</div>
                  <div className="text-sm mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "cashier"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* User Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">User Details</h2>
          {selectedUser ? (
            <div>
              <div className="mb-4">
                <h3 className="font-bold text-lg">{selectedUser.fullName}</h3>
                <p className="text-sm text-gray-500">
                  ID: {selectedUser.userId}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <span className="font-medium">Username:</span>{" "}
                  {selectedUser.username}
                </div>
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedUser.email}
                </div>
                <div>
                  <span className="font-medium">Role:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${
                      selectedUser.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : selectedUser.role === "cashier"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedUser.role}
                  </span>
                </div>
                {selectedUser.phoneNumber && (
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedUser.phoneNumber}
                  </div>
                )}
                {selectedUser.address && (
                  <div>
                    <span className="font-medium">Address:</span>{" "}
                    {selectedUser.address}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Select a user to view details
            </div>
          )}
        </div>

        {/* Role Management */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Role Management</h2>
          {selectedUser ? (
            <>
              <div className="mb-6">
                <h3 className="font-medium mb-2">Current Role Permissions:</h3>
                {roleStatus ? (
                  <ul className="space-y-1 text-sm">
                    <li
                      className={
                        roleStatus.isAdmin ? "text-green-600" : "text-gray-500"
                      }
                    >
                      {roleStatus.isAdmin ? "✓" : "✗"} Admin Access
                    </li>
                    <li
                      className={
                        roleStatus.isCashier
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {roleStatus.isCashier ? "✓" : "✗"} Cashier Access
                    </li>
                    <li
                      className={
                        roleStatus.isCustomer
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {roleStatus.isCustomer ? "✓" : "✗"} Customer Access
                    </li>
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">
                    Loading role information...
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Update Role:</h3>
                <div className="flex gap-2">
                  <select
                    value={roleUpdateInput}
                    onChange={(e) => setRoleUpdateInput(e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                  >
                    <option value="customer">Customer</option>
                    <option value="cashier">Cashier</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() =>
                      updateUserRole(selectedUser.userId, roleUpdateInput)
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={loading}
                  >
                    Update
                  </button>
                </div>
                {updateStatus && (
                  <div
                    className={`mt-2 text-sm ${
                      updateStatus.startsWith("Error")
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {updateStatus}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Select a user to manage roles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
