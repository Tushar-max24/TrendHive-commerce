import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";

// Styles + PWA
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// Register Service Worker for PWA
serviceWorkerRegistration.register();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <AuthProvider>
      <ThemeProvider>
        <ProductProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ProductProvider>
      </ThemeProvider>
    </AuthProvider>
  </Router>
);
