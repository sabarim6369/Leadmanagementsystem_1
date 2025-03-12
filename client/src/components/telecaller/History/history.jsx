import React, { useEffect, useState } from "react";
import Sidebar from "../../../utils/sidebar";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import useThemeStore from "../../store/themestore";

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

const History = () => {
  const [telecallerId, setTelecallerId] = useState("");
  const [history, setHistory] = useState([]);
  const { isDarkTheme } = useThemeStore();

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
    <div className={`flex h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <div className="lg:w-[250px] w-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-auto">
        <h1 className={`text-3xl font-semibold ${isDarkTheme ? 'text-gray-100 border-gray-700' : 'text-gray-900 border-gray-200'} border-b pb-2 mb-6`}>
          History
        </h1>

        <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
          <table className={`w-full border-collapse text-left ${isDarkTheme ? 'text-gray-200' : 'text-gray-900'}`}>
            <thead>
              <tr className={`${isDarkTheme ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-700'} uppercase text-sm font-semibold`}>
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
                      className={`${
                        isDarkTheme 
                          ? `border-gray-700 ${index % 2 === 0 ? 'bg-gray-750' : 'bg-gray-700'} hover:bg-gray-600` 
                          : `border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`
                      } border-b transition-all`}
                    >
                      <td className={`p-4 text-sm font-mono ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item.leadId?.name || "N/A"}
                      </td>
                      <td className="p-4 font-medium text-green-600">
                        {item.leadId?.mobilenumber || "N/A"}
                      </td>
                      <td className={`p-4 italic ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} truncate max-w-xs`}>
                        {item.notes || "No notes available"}
                      </td>
                      <td className={`p-4 italic ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.callbackScheduled
                          ? formatDate(item.callbackTime)
                          : "No Callback"}
                      </td>
                      <td className={`p-4 text-sm ${isDarkTheme ? 'text-blue-300' : 'text-blue-600'}`}>
                        {formatDate(item.timestamp)}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="5" className={`text-center p-4 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
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