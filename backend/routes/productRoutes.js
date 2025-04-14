import express from "express";
import cors from "cors";

import {
  addProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productController.js";


const router = express.Router();
router.use(cors());

// 🟢 Add a new product
router.post("/addproduct", addProduct);

// 🟢 Get all products
router.get("/getallproducts", getAllProducts);

// 🟢 Get a single product by ID
router.get("/getproduct/:id", getProductById);

// 🟢 Update a product

// 🟢 Delete a product

export default router;
