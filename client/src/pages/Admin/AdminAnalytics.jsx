import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Line, Doughnut } from "react-chartjs-2";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminAnalytics = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const delivered = orders.filter((o) => o.orderStatus === "Delivered").length;
  const pending = orders.filter((o) => o.orderStatus === "Processing").length;
  const cancelled = orders.filter((o) => o.orderStatus === "Cancelled").length;

  // Graph Data
  const statusData = {
    labels: ["Delivered", "Processing", "Cancelled"],
    datasets: [
      {
        data: [delivered, pending, cancelled],
        backgroundColor: ["#22c55e", "#3b82f6", "#ef4444"],
      },
    ],
  };

  const revenueTrendData = {
    labels: orders.slice(-7).map((o) =>
      new Date(o.createdAt?.toDate()).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Revenue Last 7 Orders",
        data: orders.slice(-7).map((o) => o.totalAmount),
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.3)",
      },
    ],
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-5">📊 Analytics Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded-lg text-center font-semibold">Total Orders: {orders.length}</div>
        <div className="p-4 bg-green-100 rounded-lg text-center font-semibold">Delivered: {delivered}</div>
        <div className="p-4 bg-yellow-100 rounded-lg text-center font-semibold">Processing: {pending}</div>
        <div className="p-4 bg-red-100 rounded-lg text-center font-semibold">Cancelled: {cancelled}</div>
      </div>

      <h3 className="text-xl font-bold mb-3">💰 Total Revenue: ₹{totalRevenue}</h3>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-4 shadow rounded-lg bg-white">
          <h4 className="font-semibold mb-3">📈 Revenue Trend</h4>
          <Line data={revenueTrendData} />
        </div>

        <div className="p-4 shadow rounded-lg bg-white">
          <h4 className="font-semibold mb-3">📊 Order Status Chart</h4>
          <Doughnut data={statusData} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
