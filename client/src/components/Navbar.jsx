import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import Notifications from "./Notifications";
import { AiOutlineShoppingCart, AiFillHome } from "react-icons/ai";
import { MdAdminPanelSettings } from "react-icons/md";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { currentUser, role, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const avatar = currentUser?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png";

  return (
    <nav className="backdrop-blur-lg bg-white/10 dark:bg-gray-900/70 border-b border-gray-700 sticky top-0 z-50 shadow-lg transition">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link 
          to="/home" 
          className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-purple-400 text-transparent bg-clip-text hover:opacity-90"
        >
          TrendHive
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-lg">

          <Link to="/home" className="hover:text-yellow-400 flex gap-1 items-center transition">
            <AiFillHome /> Home
          </Link>

          {role === "user" && (
            <Link to="/my-orders" className="hover:text-yellow-400 transition">
              📦 Orders
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative hover:text-yellow-400 transition">
            <AiOutlineShoppingCart size={28} />
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-sm px-2 rounded-full">
              {cart.length}
            </span>
          </Link>

          {/* Admin Panel */}
          {role === "admin" && (
            <Link 
              to="/admin/dashboard" 
              className="text-yellow-400 hover:text-white flex items-center gap-1 transition"
            >
              <MdAdminPanelSettings size={24} /> Admin
            </Link>
          )}

          {/* Notifications */}
          {currentUser && <Notifications />}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          >
            {theme === "light" ? <BsMoonStarsFill /> : <BsSunFill />}
          </button>

          {/* Profile */}
          {currentUser ? (
            <div className="relative">
              <img
                src={avatar}
                alt="profile"
                className="w-10 h-10 rounded-full border cursor-pointer hover:ring-2 ring-yellow-400 transition"
                onClick={() => setProfileOpen(!profileOpen)}
              />

              {profileOpen && (
                <div className="absolute right-0 mt-3 bg-gray-800 text-white w-48 border border-gray-700 rounded-lg p-4 space-y-3 shadow-lg">
                  <p className="text-xs opacity-70">{currentUser.email}</p>

                  <button 
                    onClick={() => navigate("/profile")}
                    className="w-full text-left hover:text-yellow-400"
                  >
                    👤 Profile
                  </button>

                  <button 
                    onClick={logout}
                    className="w-full text-left text-red-400 hover:text-red-600"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full text-white font-semibold hover:opacity-90 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 text-white text-center py-5 space-y-4 border-t border-gray-700">
          <Link to="/home" onClick={() => setMenuOpen(false)}>Home</Link>

          {role === "user" && (
            <Link to="/my-orders" onClick={() => setMenuOpen(false)}>📦 Orders</Link>
          )}

          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            🛒 Cart ({cart.length})
          </Link>

          {role === "admin" && (
            <Link 
              to="/admin/dashboard" 
              onClick={() => setMenuOpen(false)}
              className="text-yellow-400"
            >
              🛠 Admin Panel
            </Link>
          )}

          <button onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>

          {currentUser ? (
            <button onClick={logout} className="text-red-400">Logout</button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
