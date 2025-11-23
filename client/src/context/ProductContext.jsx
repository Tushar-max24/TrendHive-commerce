import { createContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {

      // --- Fetch Firebase (Admin Products) ---
      const snap = await getDocs(collection(db, "products"));
      const adminProducts = snap.docs.map(doc => ({
        id: doc.id,
        source: "firebase",
        ...doc.data()
      }));

      // --- Fetch API Products ---
      const res = await fetch("https://dummyjson.com/products?limit=100");
      const { products: apiProducts } = await res.json();

      const formattedAPI = apiProducts.map(p => ({
        id: "api_" + p.id,
        name: p.title,
        price: p.price * 82,
        image: p.thumbnail,
        category: p.category,
        source: "api"
      }));

      // Merge both
      setProducts([...adminProducts, ...formattedAPI]);
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};
