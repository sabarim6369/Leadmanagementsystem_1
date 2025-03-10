import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ChangePassword = ({ setIsChangePassword, adminid }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (newPassword !== confirmPassword) {
      toast.warning("New password and confirm password do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/changepassword`,
        { 
          adminid,
          currentPassword,
          newPassword
        }, 
        {
          headers: { "database": "superadmin" }
        }
      );
      
  toast.success(response.data.message || "Password changed successfully!");
  setTimeout(()=>{
    setIsChangePassword(false); 
  },[2000])
     
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1E1F2D] rounded-2xl p-4 md:p-8 shadow-xl">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-8">Security Settings</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 bg-[#2A2B3D] border border-gray-600 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 bg-[#2A2B3D] border border-gray-600 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              placeholder="Enter new password"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-[#2A2B3D] border border-gray-600 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              placeholder="Confirm new password"
              required
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => setIsChangePassword(false)}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-900 transition shadow-lg shadow-indigo-500/20"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default ChangePassword;
