import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const LoginRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login Successful 🎉");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account Created Successfully 🥳");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <input type="email" placeholder="Email..." onChange={(e) => setEmail(e.target.value)} /> <br />
      <input type="password" placeholder="Password..." onChange={(e) => setPassword(e.target.value)} /> <br />
      <button onClick={handleAuth}>{isLogin ? "Login" : "Register"}</button>

      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", color: "blue" }}>
        {isLogin ? "No account? Register" : "Already have an account? Login"}
      </p>
    </div>
  );
};

export default LoginRegister;
