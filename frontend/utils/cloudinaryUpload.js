import axios from 'axios';

const CLOUDINARY_UPLOAD_PRESET = "unimart_products";
// const CLOUDINARY_URL = process.env.CLOUDINARY_URL
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlcjgu1x8/image/upload";

const convertToBlob = async (imageUri) => {
    const response = await fetch(imageUri);
    console.log("Picked Image URI:", imageUri);

    const blob = await response.blob();
    return blob;
  };
  
  // Upload Image to Cloudinary
  export const uploadImageToCloudinary = async (imageUri) => {
    try {
      const formData = new FormData();
      
      // Ensure correct file format (especially for mobile apps)
      formData.append("file", {
        uri: imageUri, 
        type: "image/jpeg",  // or "image/png" based on the image type
        name: "upload.jpg",
      });
  
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Cloudinary Response:", response.data);
  
      return {
        url: response.data.secure_url,
        public_id: response.data.public_id,
      };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error.response?.data || error.message);
      return null;
    }
  };