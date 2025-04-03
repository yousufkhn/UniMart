
import { Schema } from "mongoose";
import mongoose from "mongoose";

const productSchema = new Schema(
  {
    title: { type: String, required: [true, "Product title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    price: { type: Number, min: 1, required: [true, "Please enter a valid price"] },
    quantity: { type: Number, min: 1, required: [true, "Quantity required"] },
    brand: { type: String },
    thumbnail: { type: String, required: [true, "Thumbnail is required"] },
    images: [{ type: String, required: [true, "Product images are required"] }],
    imagesPublicId: [{ type: String, required: [true, "Image public ID is required"] }],
    category: { type: String, required: [true, "Category is required"] },
    location: { type: String, required: [true, "Location is required"] },
    date: { type: Date, default: Date.now },
    postedBy: { type: String, required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
