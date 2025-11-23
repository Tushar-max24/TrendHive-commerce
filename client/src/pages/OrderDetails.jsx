import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import OrderStatusTracker from "../components/OrderStatusTracker";
import { generateInvoice } from "../utils/generateInvoice";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const docRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(docRef);

      if (orderSnap.exists()) {
        setOrder({ id: orderId, ...orderSnap.data() });
      }
    };

    fetchOrder();
  }, [orderId]);

  const requestCancel = async () => {
    await updateDoc(doc(db, "orders", orderId), {
      orderStatus: "Cancel Requested",
    });

    setOrder({ ...order, orderStatus: "Cancel Requested" });
    alert("🚨 Cancellation request sent. Admin will review.");
  };

  if (!order) return <p className="p-6">Loading order details...</p>;

  const statusColors = {
    Processing: "bg-blue-500",
    Packed: "bg-yellow-500",
    Shipped: "bg-purple-500",
    "Out for Delivery": "bg-orange-500",
    Delivered: "bg-green-600",
    Cancelled: "bg-red-500",
    "Cancel Requested": "bg-yellow-600",
  };

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800 dark:text-white transition">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-2xl font-bold">📦 Order Details</h2>

          <button
            onClick={() => generateInvoice(order)}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:scale-105 transition"
          >
            📄 Invoice
          </button>
        </div>

        {/* Order ID + Status */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">Order ID: {orderId}</p>

          <span
            className={`text-white text-sm px-3 py-1 rounded-full inline-block mt-2 ${statusColors[order.orderStatus]}`}
          >
            {order.orderStatus}
          </span>
        </div>

        {/* Progress Tracker */}
        <OrderStatusTracker status={order.orderStatus} />

        {/* Order Summary */}
        <h3 className="font-semibold text-lg mt-6">🛍 Items</h3>
        <div className="border p-4 rounded-lg mt-2 bg-gray-50 dark:bg-gray-700">
          {order.items?.map((item) => (
            <p className="text-gray-700 dark:text-gray-200 py-1" key={item.name}>
              {item.name} — ₹{item.price} × {item.qty}
            </p>
          ))}
        </div>

        {/* Delivery Address */}
        <h3 className="font-semibold text-lg mt-6">📍 Delivery Details</h3>
        <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700 mt-2">
          <p className="font-semibold">{order.shippingDetails?.fullName}</p>
          <p>{order.shippingDetails?.phone}</p>
          <p>{order.shippingDetails?.street}</p>
          <p>
            {order.shippingDetails?.city}, {order.shippingDetails?.state} -{" "}
            {order.shippingDetails?.pincode}
          </p>
        </div>

        {/* Payment Section */}
        <h3 className="font-semibold text-lg mt-6">💳 Payment</h3>
        <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700 mt-2">
          <p>Payment Method: {order.paymentType}</p>
          <p>Status: {order.paymentStatus}</p>
          <p className="font-bold text-xl mt-2">Total: ₹{order.totalAmount}</p>
        </div>

        {/* Cancellation Button */}
        {order.orderStatus === "Cancel Requested" && (
          <p className="mt-4 text-yellow-600 font-semibold text-center">
            ⏳ Cancellation request submitted.
          </p>
        )}

        {order.orderStatus !== "Delivered" &&
          order.orderStatus !== "Cancelled" &&
          order.orderStatus !== "Cancel Requested" && (
            <button
              onClick={requestCancel}
              className="mt-6 w-full px-4 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition hover:scale-105"
            >
              ❌ Request Cancellation
            </button>
          )}
      </div>
    </div>
  );
};

export default OrderDetails;
