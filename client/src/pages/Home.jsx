import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import { FiSearch } from "react-icons/fi";
import { MdTune } from "react-icons/md";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setProducts(list);

      // Unique Category List
      const uniqueCategories = [
        "All",
        ...new Set(list.map((p) => p.category || "Other")),
      ];
      setCategories(uniqueCategories);

      setTimeout(() => setLoading(false), 500);
    };

    fetchProducts();
  }, []);

  // Sorting
  const sortProducts = (items) => {
    switch (sortOption) {
      case "Price Low":
        return items.sort((a, b) => a.price - b.price);
      case "Price High":
        return items.sort((a, b) => b.price - a.price);
      case "A-Z":
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case "Z-A":
        return items.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // Filtering Output
  const filteredProducts = sortProducts(
    products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
  ).slice(0, limit);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-all">

      {/* 🔥 TrendHive Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">
          TrendHive 🛍️
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Shop Smart. Live Stylish. 💜
        </p>
      </div>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center px-4">
        <div className="relative w-full max-w-lg">
          <FiSearch className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search products, fashion, electronics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border shadow-md 
            focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>

      {/* 🏷 Category Scroll */}
      <div className="overflow-x-auto flex gap-3 px-4 py-4 no-scrollbar">
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow transition 
              ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort Filter */}
      <div className="flex justify-end px-6 mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="flex items-center border p-2 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="Newest">🆕 Newest</option>
          <option value="Price Low">⬇️ Price Low → High</option>
          <option value="Price High">⬆️ Price High → Low</option>
          <option value="A-Z">🔤 A → Z</option>
          <option value="Z-A">🔤 Z → A</option>
        </select>
      </div>

      {/* 📦 Product Grid */}
      <div className="px-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-44 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        ) : filteredProducts.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300 text-lg py-10">
            😔 No matching products found
          </p>
        )}
      </div>

      {/* Load More */}
      {filteredProducts.length >= limit && (
        <div className="flex justify-center my-8">
          <button
            onClick={() => setLimit((prev) => prev + 10)}
            className="px-6 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition"
          >
            Load More ⬇️
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
