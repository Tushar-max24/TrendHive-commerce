import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const salesData = [
  { month: "Jan", sales: 1200 },
  { month: "Feb", sales: 2100 },
  { month: "Mar", sales: 1800 },
  { month: "Apr", sales: 2600 },
  { month: "May", sales: 3200 },
  { month: "Jun", sales: 4000 },
];

const categoryData = [
  { name: "Electronics", qty: 35 },
  { name: "Clothes", qty: 55 },
  { name: "Shoes", qty: 25 },
  { name: "Books", qty: 40 },
];

const DashboardCharts = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      {/* 📈 Animated Sales Line Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`p-5 rounded-lg shadow-xl ${isDark ? "bg-gray-800 text-white" : "bg-white"}`}
      >
        <h2 className="font-bold text-lg mb-3">📈 Monthly Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#555" : "#ccc"} />
            <XAxis dataKey="month" stroke={isDark ? "#ddd" : "#333"} />
            <YAxis stroke={isDark ? "#ddd" : "#333"} />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#4ADE80" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 📊 Animated Category Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`p-5 rounded-lg shadow-xl ${isDark ? "bg-gray-800 text-white" : "bg-white"}`}
      >
        <h2 className="font-bold text-lg mb-3">📊 Top Categories</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#555" : "#ccc"} />
            <XAxis dataKey="name" stroke={isDark ? "#ddd" : "#333"} />
            <YAxis stroke={isDark ? "#ddd" : "#333"} />
            <Tooltip />
            <Bar dataKey="qty" fill="#38BDF8" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

    </div>
  );
};

export default DashboardCharts;
