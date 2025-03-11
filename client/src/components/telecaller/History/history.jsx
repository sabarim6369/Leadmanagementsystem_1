import React, { useEffect, useState } from "react";
import Sidebar from "../../../utils/sidebar";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

const History = () => {
  const [telecallerId, setTelecallerId] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setTelecallerId(decoded.telecallerId);

      const fetchHistory = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/telecaller/history/${decoded.telecallerId}`,
            { headers: { database: decoded.databaseName } }
          );
          setHistory(response.data.history);
        } catch (error) {
          console.error("Error fetching history:", error);
        }
      };

      fetchHistory();
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="lg:w-[250px] w-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-auto">
        <h1 className="text-3xl font-semibold text-gray-100 border-b border-gray-700 pb-2 mb-6">
          History
        </h1>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <table className="w-full border-collapse text-left text-gray-200">
            <thead>
              <tr className="bg-gray-700 text-gray-100 uppercase text-sm font-semibold">
                <th className="p-4">Lead Name</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Notes</th>
                <th className="p-4">Callback</th>
                <th className="p-4">Notes Taken At</th>
                </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((item, index) => (
                    <tr
                      key={item._id}
                      className={`border-b border-gray-700 ${
                        index % 2 === 0 ? "bg-gray-750" : "bg-gray-700"
                      } hover:bg-gray-600 transition-all`}
                    >
                      <td className="p-4 text-sm font-mono text-gray-300">
                        {item.leadId?.name || "N/A"}
                      </td>
                      <td className="p-4 font-medium text-green-400">
                        {item.leadId?.mobilenumber || "N/A"}
                      </td>
                      <td className="p-4 italic text-gray-400 truncate max-w-xs">
                        {item.notes || "No notes available"}
                      </td>
                      <td className="p-4 italic text-gray-400">
                        {item.callbackScheduled
                          ? formatDate(item.callbackTime)
                          : "No Callback"}
                      </td>
                      <td className="p-4 text-sm text-blue-300">
                        {formatDate(item.timestamp)}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-400">
                    No history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
