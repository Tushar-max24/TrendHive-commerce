import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadImageToCloudinary } from "../utils/uploadImage";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    address: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) setUserData((prev) => ({ ...prev, ...snap.data() }));
    };

    fetchUserData();
  }, [currentUser]);

  const handleUpdate = async () => {
    if (!currentUser) return;
    setLoading(true);
    const ref = doc(db, "users", currentUser.uid);
    await updateDoc(ref, userData);
    alert("✅ Profile updated successfully!");
    setLoading(false);
  };

  const handleImageChange = async (file) => {
    setLoading(true);
    const url = await uploadImageToCloudinary(file);
    if (url) setUserData((prev) => ({ ...prev, profileImage: url }));
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 min-h-screen">

      {/* Card */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 transition-all hover:shadow-2xl">

        <h2 className="text-2xl font-bold mb-6 text-center">
          👤 My Profile
        </h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <img
            src={userData.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md transition hover:scale-105"
          />

          <label className="mt-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg transition">
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files[0])}
            />
          </label>
        </div>

        {/* Inputs */}
        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-lg py-3 px-4 dark:bg-gray-700"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border rounded-lg py-3 px-4 dark:bg-gray-700"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          />

          <textarea
            placeholder="Address"
            className="w-full border rounded-lg py-3 px-4 h-24 dark:bg-gray-700"
            value={userData.address}
            onChange={(e) =>
              setUserData({ ...userData, address: e.target.value })
            }
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold text-lg hover:opacity-90 transition"
        >
          {loading ? "Saving..." : "Save Changes ✓"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
