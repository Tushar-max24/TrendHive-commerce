import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";
import { Outlet, useLocation } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import DashboardCharts from "../../components/admin/DashboardCharts";
import { ThemeContext } from "../../context/ThemeContext";

const AdminDashboard = () => {
  const { role } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  const [totalProducts, setTotalProducts] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [syncLoading, setSyncLoading] = useState(false);

  const isHome =
    location.pathname === "/admin" || location.pathname === "/admin/dashboard";

  useEffect(() => {
    const fetchDashboardData = async () => {
      const productSnap = await getDocs(collection(db, "products"));
      setTotalProducts(productSnap.size);

      const pendingQuery = query(
        collection(db, "orders"),
        where("orderStatus", "==", "Pending")
      );
      const pendingSnap = await getDocs(pendingQuery);
      setPendingOrders(pendingSnap.size);

      let revenue = 0;
      const ordersSnap = await getDocs(collection(db, "orders"));

      ordersSnap.forEach((order) => {
        const date = order.data()?.createdAt?.toDate();
        if (date && date.getMonth() === new Date().getMonth()) {
          revenue += order.data()?.totalAmount || 0;
        }
      });

      setMonthlyRevenue(revenue);
    };

    fetchDashboardData();
  }, []);

  const handleSyncProducts = async () => {
    try {
      setSyncLoading(true);

      const res = await fetch("http://localhost:4000/api/admin/sync-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      alert(data.success ? `✅ ${data.message}` : `❌ ${data.message}`);
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong.");
    } finally {
      setSyncLoading(false);
    }
  };

  if (role !== "admin") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-red-500 font-bold text-xl">⛔ Access Denied</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Admin access required.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* ----- Header & Sync Button ----- */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            👑 Admin Dashboard
          </h1>

          <button
            onClick={handleSyncProducts}
            disabled={syncLoading}
            className={`px-5 py-3 rounded-lg text-white font-semibold flex items-center gap-2 shadow-lg transition transform hover:scale-105 ${
              syncLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90"
            }`}
          >
            {syncLoading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Syncing...
              </>
            ) : (
              <>🔄 Sync External Products</>
            )}
          </button>
        </div>

        {/* ----- Dashboard Summary Cards ----- */}
        {isHome && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Card 1 */}
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:scale-[1.02] transition-all border-l-8 border-blue-500">
                <p className="text-gray-500 text-sm">📦 Total Products</p>
                <h2 className="text-4xl font-bold">{totalProducts}</h2>
              </div>

              {/* Card 2 */}
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:scale-[1.02] transition-all border-l-8 border-yellow-500">
                <p className="text-gray-500 text-sm">📝 Pending Orders</p>
                <h2 className="text-4xl font-bold text-yellow-500">
                  {pendingOrders}
                </h2>
              </div>

              {/* Card 3 */}
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:scale-[1.02] transition-all border-l-8 border-green-500">
                <p className="text-gray-500 text-sm">💰 Revenue (This Month)</p>
                <h2 className="text-4xl font-bold text-green-600">
                  ₹ {monthlyRevenue}
                </h2>
              </div>
            </div>

            {/* Charts Section */}
            <DashboardCharts />
          </>
        )}

        {/* Nested Routes Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6 border border-gray-200 dark:border-gray-700">
          <Outlet />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
