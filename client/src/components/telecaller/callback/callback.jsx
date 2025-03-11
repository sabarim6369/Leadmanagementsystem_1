import React, { useEffect, useState } from 'react';
import Sidebar from '../../../utils/sidebar';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const Callback = () => {
  const [callbacks, setCallbacks] = useState([]);
  const [telecallerid, setTelecallerid] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenvalidation = jwtDecode(token);
      setTelecallerid(tokenvalidation.telecallerId);
    }
  }, []);

  useEffect(() => {
    const fetchCallbacks = async () => {
      if (!telecallerid) return;

      try {
        const token = localStorage.getItem("token");
        const tokenvalidation = jwtDecode(token);
        const databaseName = tokenvalidation.databaseName;

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/telecaller/getTodaysCallbacks/${telecallerid}`, {
          headers: { "database": databaseName },
        });

        setCallbacks(response.data.callbacks || []);
      } catch (error) {
        console.error("Error fetching callback data:", error);
      }
    };

    fetchCallbacks();
  }, [telecallerid]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="lg:w-[250px] w-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Callbacks Scheduled for Today</h1>

        {/* Table Container with Scroll */}
        <div className="overflow-auto max-h-[88vh] border border-gray-700 rounded-lg shadow-lg scrollbar-hide">
          <table className="w-full border-collapse text-white">
            <thead className="bg-gray-800 sticky top-0">
              <tr>
                <th className="border border-gray-700 p-3 text-left">S.No</th>
                <th className="border border-gray-700 p-3 text-left">Lead Name</th>
                <th className="border border-gray-700 p-3 text-left">Email</th>
                <th className="border border-gray-700 p-3 text-left">Mobile Number</th>
                <th className="border border-gray-700 p-3 text-left">Callback Timing</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800">
              {callbacks.length > 0 ? (
                callbacks.map((callback, index) => (
                  <tr key={callback._id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="border border-gray-700 p-3">{index + 1}</td>
                    <td className="border border-gray-700 p-3">{callback.leadId?.name || "N/A"}</td>
                    <td className="border border-gray-700 p-3">{callback.leadId?.email || "N/A"}</td>
                    <td className="border border-gray-700 p-3">{callback.leadId?.mobilenumber || "N/A"}</td>
                    <td className="border border-gray-700 p-3">
                      {callback.callbackTime ? new Date(callback.callbackTime).toLocaleString() : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-400">No callbacks scheduled</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Callback;
