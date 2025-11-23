import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const provider = new GoogleAuthProvider();

  const handleAuth = async () => {
    if (!email || !password) return alert("Fill all fields ❗");
    setLoading(true);

    try {
      if (isSignup) {
        const user = await createUserWithEmailAndPassword(auth, email, password);

        // Default role: user
        await setDoc(
          doc(db, "users", user.user.uid),
          { email, role: "user" },
          { merge: true }
        );

        alert("🎉 Account Created!");
        navigate("/home");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/home");
      }
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        { email: user.email, role: "user" },
        { merge: true }
      );

      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="bg-white rounded-xl shadow-xl p-8 w-96 text-center">

        {/* Logo */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
          alt="logo"
          className="w-20 mx-auto mb-4"
        />

        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          TrendHive🛒
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          {isSignup ? "Create an account to continue" : "Welcome back 👋"}
        </p>

        {/* Input Fields */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-3 outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login/Signup Button */}
        <button
          onClick={handleAuth}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium"
          disabled={loading}
        >
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
        </button>

        {/* Switch mode */}
        <p className="mt-4 text-gray-600 text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>

        {/* Divider */}
        <div className="flex items-center my-4">
          <span className="flex-grow border-t border-gray-300"></span>
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <span className="flex-grow border-t border-gray-300"></span>
        </div>

        {/* Google Login */}
        <button
          onClick={googleLogin}
          className="w-full bg-white border py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5"
            alt="Google"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
