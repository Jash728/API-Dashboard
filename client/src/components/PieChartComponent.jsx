import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#00C49F", "#FF4C4C"]; // Success green, Error red

const PieChartComponent = ({ success, failed }) => {
  const data = [
    { name: "Successful", value: success },
    { name: "Failed", value: failed },
  ];

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Success vs Failed API Calls</h2>
      <PieChart width={300} height={250}>
        <Pie
          data={data}
          cx={150}
          cy={125}
          innerRadius={50}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
