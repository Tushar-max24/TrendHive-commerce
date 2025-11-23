import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import EditProductModal from "./EditProductModal";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    await fetchProducts();
    alert("Deleted Successfully ❌");
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">📦 Manage Products</h2>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 p-2 rounded-lg shadow-inner w-64">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            placeholder="Search product..."
            className="bg-transparent w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-500">⏳ Loading products...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No products found 😔</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover hover:scale-110 transition cursor-pointer shadow-md"
                    />
                  </td>

                  <td className="p-4 font-semibold">{product.name}</td>
                  <td className="p-4">{product.category || "—"}</td>
                  <td className="p-4 font-bold text-green-600">
                    ₹{product.price}
                  </td>

                  <td className="p-4 flex justify-center gap-4">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      <FiEdit2 /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          close={() => setSelectedProduct(null)}
          refresh={fetchProducts}
        />
      )}
    </>
  );
};

export default ProductsTable;
