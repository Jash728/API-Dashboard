
import React from "react";

const TimeFilter = ({ filter, setFilter }) => (
  <div className="flex justify-end mb-4">
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="border border-gray-300 rounded px-3 py-1 text-sm"
    >
      <option value="all">All Time</option>
      <option value="week">Last Week</option>
      <option value="month">Last Month</option>
      <option value="year">Last Year</option>
    </select>
  </div>
);

export default TimeFilter;
