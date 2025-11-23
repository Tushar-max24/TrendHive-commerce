import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { removeFromCart } = useContext(CartContext);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "10px",
      }}
    >
      <img
        src={item.image}
        alt={item.name}
        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
      />

      <div>
        <h3>{item.name}</h3>
        <p>Price: ₹{item.price}</p>
        <p>Quantity: {item.qty}</p>
      </div>

      <button
        onClick={() => removeFromCart(item.id)}
        style={{ background: "red", color: "white", border: "none", padding: "8px" }}
      >
        Remove ❌
      </button>
    </div>
  );
};

export default CartItem;
