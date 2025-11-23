import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import AdminLayout from "../../components/admin/AdminLayout";
import { Button, Select, MenuItem, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { sendStatusEmail } from "../../utils/sendEmail";

const statusOptions = [
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancel Requested",
  "Cancelled",
];

const statusColors = {
  Processing: "warning",
  Packed: "info",
  Shipped: "secondary",
  "Out for Delivery": "primary",
  Delivered: "success",
  Cancelled: "error",
  "Cancel Requested": "warning",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      setOrders(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = orders
    .filter((o) => {
      const s = search.toLowerCase();
      return (
        (o.userEmail || "").toLowerCase().includes(s) ||
        (o.id || "").toLowerCase().includes(s) ||
        o.items?.some((i) => (i.name || "").toLowerCase().includes(s))
      );
    })
    .filter((o) => (filterStatus ? o.orderStatus === filterStatus : true))
    .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

  const updateStatus = async (id, newStatus, order) => {
    if (newStatus === order.orderStatus) return;

    try {
      setLoadingId(id);
      await updateDoc(doc(db, "orders", id), { orderStatus: newStatus });
      await sendStatusEmail(order.userEmail, id, newStatus, order.totalAmount);
      alert(`📩 Status Updated & Email Sent To ${order.userEmail}`);
    } catch (error) {
      alert("❌ Update failed.");
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">

        {/* Page Title */}
        <h1 className="text-4xl font-semibold mb-6">📦 Manage Orders</h1>

        {/* Search + Filters */}
        <div className="bg-white shadow-md p-4 rounded-lg flex flex-wrap gap-4 sticky top-0 z-20 border">
          <input
            type="text"
            placeholder="🔍 Search by email, ID, product..."
            className="flex-1 border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-4 py-2 rounded-lg text-gray-600"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">📌 All Orders</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-auto rounded-xl mt-6 shadow-lg border bg-white">
          <table className="w-full text-[15px]">
            <thead className="bg-blue-50 text-gray-700 sticky top-0">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-center">Total</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <td className="p-4">
                    <p className="font-semibold">{order.userEmail}</p>
                    <span className="text-xs text-gray-500">
                      📅 {new Date(order.createdAt?.toDate()).toLocaleString()}
                    </span>
                  </td>

                  <td className="p-4 text-sm">
                    {order.items?.map((item, idx) => (
                      <p key={idx}>🛍 {item.name} × {item.qty}</p>
                    ))}
                  </td>

                  <td className="p-4 text-center font-bold text-green-600">
                    ₹{order.totalAmount}
                  </td>

                  <td className="p-4 text-center">
                    <Chip
                      label={order.orderStatus}
                      color={statusColors[order.orderStatus]}
                      className={`mb-2 ${
                        order.orderStatus === "Cancel Requested"
                          ? "animate-pulse"
                          : ""
                      }`}
                    />
                    <Select
                      value={order.orderStatus}
                      disabled={loadingId === order.id}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value, order)
                      }
                      size="small"
                      fullWidth
                    >
                      {statusOptions.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </td>

                  <td className="p-4 text-center space-x-2">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/admin/order/${order.id}`)}
                    >
                      View
                    </Button>

                    {order.orderStatus === "Cancel Requested" ? (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() =>
                          updateStatus(order.id, "Cancelled", order)
                        }
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() =>
                          updateStatus(order.id, "Delivered", order)
                        }
                      >
                        Delivered
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              ❌ No orders found.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
