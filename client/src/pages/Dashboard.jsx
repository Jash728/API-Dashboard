import React, { useEffect, useState } from "react";
import axios from "axios";
import PieChartComponent from "../components/PieChartComponent";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { saveAs } from "file-saver";
import { utils, write } from "xlsx";

const Dashboard = () => {
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("7");

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://api-dashboard-1.onrender.com/api/usage?period=${selectedPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsageData(res.data);
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [selectedPeriod]);

  const handleExportCSV = () => {
    const ws = utils.json_to_sheet(usageData.usageTimeline);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Usage Report");
    const blob = new Blob([write(wb, { bookType: "csv", type: "buffer" })]);
    saveAs(blob, "api_usage_report.csv");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 relative">
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center sm:text-left">
    📊 API Usage Dashboard
  </h1>

  <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer text-sm self-center sm:self-auto"
  >
    Logout
  </button>
</div>


    
      {usageData.errorRate > 10 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-6 text-sm md:text-base">
          ⚠️ High Error Rate: {usageData.errorRate}% of your API requests failed. Please investigate.
        </div>
      )}

      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700 text-sm">Filter by:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 cursor-pointer focus:outline-none focus:ring focus:border-blue-300 text-sm"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="365">Last 1 Year</option>
          </select>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer transition text-sm"
        >
          Export CSV
        </button>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { title: "Total Requests", value: usageData.totalRequests },
          { title: "Successful Requests", value: usageData.successRequests },
          { title: "Failed Requests", value: usageData.failedRequests },
          { title: "Error Rate", value: `${usageData.errorRate}%` },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 p-5 rounded-lg text-center shadow-sm hover:shadow-md transition cursor-default"
          >
            <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
            <p className="text-xl font-semibold text-gray-900 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      
      <div className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-100 mb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
          📎 Request Breakdown
        </h2>
        <PieChartComponent
          success={usageData.successRequests}
          failed={usageData.failedRequests}
        />
      </div>

      
      <div className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-100">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
          📈 Daily Usage Trends
        </h2>
        {usageData.usageTimeline.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageData.usageTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#4f46e5" name="Total Requests" />
              <Line type="monotone" dataKey="success" stroke="#10b981" name="Successful" />
              <Line type="monotone" dataKey="failed" stroke="#ef4444" name="Failed" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">No usage data available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
