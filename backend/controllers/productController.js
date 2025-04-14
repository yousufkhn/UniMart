import Product from "../models/ProductModel.js";
import mongoose from "mongoose";


export const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      quantity,
      brand,
      thumbnail,
      images,
      imagesPublicId,
      category,
      location,
      postedBy,
    } = req.body;


    // Validate required fields
    if (!title || !description || !price || !quantity || !category || !location || !images) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    console.log("Received thumbnail:", thumbnail); // Debugging
    console.log("Received images:", images);

    // Create a new product
    const product = new Product({
      title,
      description,
      price,
      quantity,
      brand,
      thumbnail,
      images,
      imagesPublicId,
      category,
      location,
      postedBy,
    });

    // Save the product to the database
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ error: "Failed to add product. Please try again." });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isArchived: false }).populate("postedBy", "studentName studentPicture"); // Fetch all non-archived products from the database
    res.status(200).json(products); // Return the products as JSON
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Failed to fetch products" }); // Return a 500 error with a message
  }
}

export const getProductById = async (req, res) => {
  const { id } = req.params; // Extract product ID from the request parameters

  // Validate the product ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    // Fetch product by ID
    const product = await Product.findById(id);

    // Handle case where product doesn't exist
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return the product data
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error); // Log the error for debugging
    res.status(500).json({ error: "Internal server error" }); // Return a generic error message
  }
};
