import React, { useEffect, useState, useContext } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import OrderStatusTracker from "../components/OrderStatusTracker";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", currentUser.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">🧾 My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-lg">
          No orders yet. Start shopping! 🛍️
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-5 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-200"
            >
              {/* Top Row */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold text-sm">
                    Order ID: <span className="text-blue-500">{order.id.slice(0, 10)}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    📅 {new Date(order.createdAt?.toDate()).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-lg font-semibold tracking-wide
                    ${
                      {
                        Processing: "bg-blue-500 text-white",
                        Packed: "bg-yellow-400 text-black",
                        Shipped: "bg-purple-500 text-white",
                        "Out for Delivery": "bg-orange-500 text-white",
                        Delivered: "bg-green-500 text-white",
                        Cancelled: "bg-red-500 text-white",
                      }[order.orderStatus] || "bg-gray-400 text-white"
                    }
                  `}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* Status Tracker */}
              <OrderStatusTracker status={order.orderStatus} />

              {/* Items Preview */}
              <div className="mt-4 border-t pt-4 space-y-2">
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm border p-2 rounded-lg bg-gray-50"
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/50"}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">
                        ₹{item.price} × {item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-5">
                <h3 className="text-xl font-bold">₹{order.totalAmount}</h3>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg shadow hover:opacity-90 transition"
                  >
                    Track Order 🚚
                  </button>

                  <button className="border rounded-lg px-5 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    Download Invoice 📄
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
