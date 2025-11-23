import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, clearCart, updateQuantity } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [coupon, setCoupon] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = coupon === "WELCOME10" ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const placeOrder = async () => {
    if (!cart.length) return alert("Your cart is empty!");

    setPlacingOrder(true);

    try {
      await addDoc(collection(db, "orders"), {
        items: cart,
        totalAmount: total,
        discountApplied: coupon || "None",
        userEmail: currentUser?.email,
        userId: currentUser?.uid,
        status: "Pending",
        createdAt: Timestamp.now(),
      });

      alert("Order placed successfully!");
      clearCart();
      navigate("/my-orders");

    } catch (err) {
      console.error(err);
      alert("Order failed. Try again.");
    }

    setPlacingOrder(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">

      {/* Left Section - Items */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

        {cart.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded">
            <p className="text-gray-500 dark:text-gray-300">Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <CartItem key={item.id} item={item} updateQuantity={updateQuantity} />
            ))}
          </div>
        )}
      </div>

      {/* Right Section - Summary */}
      {cart.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 sticky top-20 h-fit border">

          {/* Coupon */}
          <p className="font-semibold mb-2">Apply Coupon</p>
          <div className="flex gap-2 mb-5">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter coupon code"
              className="border p-2 rounded w-full dark:bg-gray-700"
            />
            <button
              onClick={() => alert("Coupon Applied (if valid)!")}
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700">
              Apply
            </button>
          </div>

          {/* Price Summary */}
          <h3 className="font-semibold text-lg mb-3">Price Details</h3>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </p>

            {discount > 0 && (
              <p className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </p>
            )}

            <hr className="my-2" />

            <p className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-6 space-y-3">

            <button
              onClick={placeOrder}
              disabled={placingOrder}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
              {placingOrder ? "Processing..." : "Place Order"}
            </button>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
              Proceed to Checkout
            </button>

            <button
              onClick={clearCart}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition">
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
