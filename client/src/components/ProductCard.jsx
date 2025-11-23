import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div
      className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:text-gray-200 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer max-w-[220px]"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />

      <h3 className="font-semibold text-lg truncate hover:text-blue-500 dark:hover:text-blue-300">
        {product.name}
      </h3>

      <p className="text-xl font-bold text-green-600 dark:text-green-400 my-2">
        ₹{product.price}
      </p>

      <button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition mt-3"
        onClick={(e) => {
          e.stopPropagation(); // prevents navigation on button click
          addToCart(product);
        }}
      >
        🛒 Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
