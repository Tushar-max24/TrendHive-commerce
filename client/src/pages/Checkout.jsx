import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51SWWRMJZdnC8wgOO7FwMMEQKnZxPRSQP6k2JxVmpotsLAzC2T5pz7W4fmIEmIgazeSC1Rc14wiSx7trJB5TSOxeI002Y5Gv2sc"
);

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("stripe");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    email: currentUser?.email || "",
  });

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const isAddressValid = () => {
    return (
      address.fullName &&
      address.phone.length >= 10 &&
      address.street &&
      address.city &&
      address.state &&
      address.pincode.length >= 4 &&
      address.email
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const saveOrder = async (paymentType, paymentStatus) => {
    await addDoc(collection(db, "orders"), {
      userId: currentUser?.uid,
      userEmail: currentUser?.email,
      items: cart,
      shippingDetails: address,
      totalAmount: total,
      paymentType,
      paymentStatus,
      orderStatus: "Processing",
      createdAt: serverTimestamp(),
    });

    clearCart();
    navigate("/my-orders");
  };

  const payWithStripe = async () => {
    const stripe = await stripePromise;

    const response = await fetch("https://trendhive-commerce-1.onrender.com/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const data = await response.json();

    if (data.id) {
      await stripe.redirectToCheckout({ sessionId: data.id });
      saveOrder("Stripe", "Paid");
    } else {
      alert("❌ Payment session failed");
    }
  };

  const handleCheckout = () => {
    if (!isAddressValid()) {
      alert("⚠ Please fill all shipping details correctly.");
      return;
    }

    if (paymentMethod === "cod") {
      saveOrder("COD", "Pending");
    } else {
      payWithStripe();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">Checkout 🛒</h2>

      {/* Address Card */}
      <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          🏠 Shipping Details
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name *"
            className="input-box"
            value={address.fullName}
            onChange={handleAddressChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone *"
            className="input-box"
            value={address.phone}
            onChange={handleAddressChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email *"
            className="input-box col-span-2"
            value={address.email}
            onChange={handleAddressChange}
          />

          <input
            type="text"
            name="street"
            placeholder="House / Street *"
            className="input-box col-span-2"
            value={address.street}
            onChange={handleAddressChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City *"
            className="input-box"
            value={address.city}
            onChange={handleAddressChange}
          />

          <input
            type="text"
            name="state"
            placeholder="State *"
            className="input-box"
            value={address.state}
            onChange={handleAddressChange}
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode *"
            className="input-box"
            value={address.pincode}
            onChange={handleAddressChange}
          />

          <input
            type="text"
            name="landmark"
            placeholder="Landmark (optional)"
            className="input-box col-span-2"
            value={address.landmark}
            onChange={handleAddressChange}
          />
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold mb-4">💳 Select Payment Method</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-2 border p-3 rounded-lg cursor-pointer hover:border-blue-500 transition">
            <input
              type="radio"
              checked={paymentMethod === "stripe"}
              onChange={() => setPaymentMethod("stripe")}
            />
            <p>Card / UPI (Stripe Payment)</p>
          </label>

          <label className="flex items-center gap-2 border p-3 rounded-lg cursor-pointer hover:border-blue-500 transition">
            <input
              type="radio"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            <p>Cash On Delivery</p>
          </label>
        </div>
      </div>

      {/* Summary & Place Order */}
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
        <p className="text-lg">Order Total</p>
        <h1 className="text-3xl font-bold mt-1 mb-5">₹{total}</h1>

        <button
          onClick={handleCheckout}
          className="w-full py-4 text-lg font-semibold bg-yellow-400 text-black rounded-xl hover:bg-yellow-500 transition transform hover:scale-105"
        >
          {paymentMethod === "cod" ? "Place Order" : "Pay Securely"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
