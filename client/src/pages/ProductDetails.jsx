import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = doc(db, "products", id);
      const snap = await getDoc(productRef);

      if (snap.exists()) {
        const data = snap.data();
        setProduct(data);

        // Fetch related products
        const allSnap = await getDocs(collection(db, "products"));
        const list = allSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.category === data.category && p.name !== data.name);

        setRelated(list);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <h2 className="text-center mt-10">⏳ Loading...</h2>;
  if (!product) return <h2 className="text-center mt-10 text-red-500">❌ Product not found</h2>;

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Image */}
        <img 
          src={product.image} 
          alt={product.name}
          className="rounded-lg shadow-lg w-full h-80 object-cover"
        />

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-400">{product.category}</p>

          <p className="text-3xl font-bold text-green-500 dark:text-green-400 mt-4">
            ₹{product.price}
          </p>

          <p className="mt-4 text-lg">
            {product.description || "No description available."}
          </p>

          <button
            className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-2 text-white rounded-lg transition"
            onClick={() => addToCart({ id, ...product })}
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">⭐ Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
