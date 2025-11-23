import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";

// Components
import Navbar from "./components/Navbar";

// User Pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import OrderDetails from "./pages/OrderDetails";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import AdminOrders from "./pages/Admin/AdminOrders";

// Context
import { AuthContext } from "./context/AuthContext";


// ---------------- PROTECTED ROUTE ----------------
const ProtectedRoute = ({ children, allowed }) => {
  const { currentUser, role, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="text-center p-6 text-lg">⏳ Checking authentication...</div>
    );

  if (!currentUser) return <Navigate to="/login" replace />;

  if (allowed && role !== allowed) {
    return (
      <h2 className="text-center text-red-500 text-2xl mt-10">
        ⛔ Access Restricted — Admin Only
      </h2>
    );
  }

  return children;
};


// ---------------- MAIN ROUTES ----------------
function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* Default to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* USER ROUTES */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route
          path="/order/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />


        {/* ADMIN SECTION */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowed="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<h2 className="text-lg font-semibold">📊 Admin Overview</h2>} />
          <Route path="products" element={<AddProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="order/:orderId" element={<OrderDetails />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default AppContent;
