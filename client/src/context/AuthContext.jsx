import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setRole("guest");
        setLoading(false);
        return;
      }

      setCurrentUser(user);

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        const detectedRole = snap.exists() ? snap.data().role : "user";

        if (!snap.exists()) {
          await setDoc(userRef, { email: user.email, role: "user" });
        }

        setRole(detectedRole);

        // Redirect ONLY when user logs in, NOT while navigating
        if (detectedRole === "admin" && !window.location.pathname.startsWith("/admin")) {
          navigate("/admin/dashboard", { replace: true });
        } else if (detectedRole === "user" && window.location.pathname === "/login") {
          navigate("/home", { replace: true });
        }

      } catch (err) {
        console.error(err);
        setRole("user");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setRole("guest");
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
