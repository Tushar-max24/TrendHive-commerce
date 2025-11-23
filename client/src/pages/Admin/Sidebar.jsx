import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FiPackage, FiUsers, FiBarChart2, FiShoppingBag, FiChevronLeft } from "react-icons/fi";

const Sidebar = () => {
  const { role } = useContext(AuthContext);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (role !== "admin") return null;

  // Helper to check active route
  const isActive = (path) =>
    location.pathname.startsWith(path) ? "bg-purple-600 text-white" : "hover:bg-gray-800";

  return (
    <div
      className={`transition-all duration-300 bg-gray-900 text-white min-h-screen shadow-xl ${
        collapsed ? "w-20" : "w-64"
      } flex flex-col justify-between`}
    >
      {/* ---- Top Section ---- */}
      <div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          {!collapsed && <h2 className="text-xl font-bold">⚙️ Admin</h2>}

          <button
            className="text-gray-300 hover:text-white transition text-xl"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FiChevronLeft
              className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* ---- Navigation Links ---- */}
        <nav className="mt-6 space-y-3 px-3">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive("/admin/dashboard")}`}
          >
            <FiShoppingBag className="text-xl" />
            {!collapsed && "Dashboard"}
          </Link>

          <Link
            to="/admin/products"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive("/admin/products")}`}
          >
            <FiPackage className="text-xl" />
            {!collapsed && "Manage Products"}
          </Link>

          <Link
            to="/admin/orders"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive("/admin/orders")}`}
          >
            <FiShoppingBag className="text-xl" />
            {!collapsed && "Orders"}
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive("/admin/users")}`}
          >
            <FiUsers className="text-xl" />
            {!collapsed && "Users"}
          </Link>

          <Link
            to="/admin/analytics"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive("/admin/analytics")}`}
          >
            <FiBarChart2 className="text-xl" />
            {!collapsed && "Analytics"}
          </Link>
        </nav>
      </div>

      {/* ---- Footer ---- */}
      <div className="p-4 text-center text-gray-400 text-xs border-t border-gray-700">
        {!collapsed && "© 2025 TrendHive Admin"}
      </div>
    </div>
  );
};

export default Sidebar;
