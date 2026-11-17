import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MdDelete, MdModeEdit, MdClose } from "react-icons/md";

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    _id: "",
    name: "",
    email: "",
    role: ""
  });

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/all-user`, {
        method: 'GET',
        credentials: 'include'
      });
      const dataResponse = await response.json();
      if (dataResponse.success) {
        setAllUsers(dataResponse.data);
      } else {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      toast.error("Failed to fetch users.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Handle Role Update Submission
  const handleUpdateUserRole = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-user`, {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: selectedUser._id,
          role: selectedUser.role
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Role updated to ${selectedUser.role}`);
        setOpenUpdateRole(false);
        fetchAllUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update user role.");
      console.error(error);
    }
  };

  // Handle User Deletion
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delete-user`, {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchAllUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete user.");
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Manage All Users</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-100">
              <th className="p-4 font-semibold">#</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {allUsers.map((el, index) => (
              <tr key={el._id} className="hover:bg-slate-50/50">
                <td className="p-4 text-slate-500">{index + 1}</td>
                <td className="p-4 font-medium text-slate-800">{el?.name}</td>
                <td className="p-4 text-slate-600">{el?.email}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${el?.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                    {el?.role}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* Edit Role Button */}
                    <button
                      onClick={() => {
                        setSelectedUser(el);
                        setOpenUpdateRole(true);
                      }}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 p-2 rounded-lg transition"
                      title="Edit User Role"
                    >
                      <MdModeEdit size={18} />
                    </button>

                    {/* Delete User Button */}
                    <button
                      onClick={() => handleDeleteUser(el._id, el.name)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg transition"
                      title="Delete User"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {allUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Change User Role Modal */}
      {openUpdateRole && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Change User Role</h3>
              <button
                onClick={() => setOpenUpdateRole(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <MdClose size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdateUserRole} className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">User Name</p>
                <p className="text-sm font-medium text-slate-800">{selectedUser.name}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Email</p>
                <p className="text-sm text-slate-600">{selectedUser.email}</p>
              </div>

              <div>
                <label className="block text-xs text-slate-500 uppercase font-semibold mb-1.5">
                  Select Role
                </label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenUpdateRole(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;