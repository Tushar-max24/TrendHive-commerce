import axios from "axios";

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  
  formData.append("file", file);
  formData.append("upload_preset", "e-commerce"); // from Cloudinary
  formData.append("cloud_name", "dmgjcryx6");

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dmgjcryx6/image/upload`,
      formData
    );

    return response.data.secure_url; // Image URL
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return null;
  }
};
