import { useState } from "react";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { uploadImageToCloudinary } from "../../utils/uploadImage";
import { motion } from "framer-motion";

const EditProductModal = ({ product, close, refresh }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(product.image);

  const updateProduct = async () => {
    setSaving(true);

    let imageURL = product.image;

    if (file) {
      imageURL = await uploadImageToCloudinary(file);
    }

    await updateDoc(doc(db, "products", product.id), {
      name,
      price: Number(price),
      image: imageURL,
      updatedAt: new Date(),
    });

    setSaving(false);
    refresh();
    close();
    alert("✔ Product Updated Successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-[380px] shadow-2xl"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          ✏️ Edit Product
        </h2>

        {/* Image Preview */}
        <div className="w-full flex justify-center mb-4">
          <img
            src={preview}
            alt="Preview"
            className="w-28 h-28 rounded-lg border shadow-md object-cover"
          />
        </div>

        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
          Product Name
        </label>
        <input
          className="w-full border p-2 rounded-lg mb-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
          Price (₹)
        </label>
        <input
          type="number"
          className="w-full border p-2 rounded-lg mb-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
          Upload New Image
        </label>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
          className="w-full border p-2 rounded mb-4 dark:bg-gray-700"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={close}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition"
          >
            Cancel
          </button>

          <button
            onClick={updateProduct}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save ✔"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditProductModal;
