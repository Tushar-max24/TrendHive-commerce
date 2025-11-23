import React, { useContext, useState } from "react";
import { uploadImageToCloudinary } from "../utils/uploadImage";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

const AddProduct = () => {
  const { role } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Other");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (role !== "admin") {
    return (
      <h2 className="text-center text-red-500 text-xl font-semibold mt-10">
        ⛔ Access Denied — Only Admin Can Add Products
      </h2>
    );
  }

  const handleAddProduct = async () => {
    if (!name || !price || !file || !category)
      return alert("⚠ Please fill all fields before submitting");

    setLoading(true);

    try {
      const imageURL = await uploadImageToCloudinary(file);
      if (!imageURL) return alert("❌ Image upload failed");

      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        image: imageURL,
        category,
        createdAt: new Date(),
      });

      alert("🎉 Product added successfully!");

      // Reset fields
      setName("");
      setPrice("");
      setFile(null);
      setCategory("Other");
      setPreview(null);

    } catch (err) {
      console.error(err);
      alert("❌ Error adding product");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl p-6 mt-10 rounded-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex gap-2">➕ Add Product</h2>

      {/* Name */}
      <label className="text-gray-600 font-medium">Product Name</label>
      <input
        type="text"
        placeholder="Enter product name"
        className="w-full p-2 border rounded mb-3 mt-1 focus:ring focus:ring-blue-300"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Price */}
      <label className="text-gray-600 font-medium">Price (₹)</label>
      <input
        type="number"
        placeholder="Enter price"
        className="w-full p-2 border rounded mb-3 mt-1 focus:ring focus:ring-blue-300"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* Category */}
      <label className="text-gray-600 font-medium">Category</label>
      <select
        className="w-full p-2 border rounded mb-3 mt-1 focus:ring focus:ring-blue-300"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Clothing">Clothing</option>
        <option value="Electronics">Electronics</option>
        <option value="Accessories">Accessories</option>
        <option value="Food">Food</option>
        <option value="Home">Home</option>
        <option value="Beauty">Beauty</option>
        <option value="Other">Other</option>
      </select>

      {/* Image Upload */}
      <label className="text-gray-600 font-medium">Product Image</label>
      <input
        type="file"
        accept="image/*"
        className="w-full border p-2 rounded mb-3 mt-1"
        onChange={(e) => {
          setFile(e.target.files[0]);
          setPreview(URL.createObjectURL(e.target.files[0]));
        }}
      />

      {/* Preview Image */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 object-cover rounded border mb-4"
        />
      )}

      <button
        onClick={handleAddProduct}
        disabled={loading}
        className="w-full bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition font-semibold shadow-md"
      >
        {loading ? "Uploading..." : "Add Product"}
      </button>
    </div>
  );
};

export default AddProduct;
