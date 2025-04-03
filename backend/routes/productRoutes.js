import express from "express";
import { addProduct, getAllProducts } from "../controllers/productController.js";
import cors from "cors";

const router = express.Router();
router.use(cors())


// 🟢 Create a new product
// router.post("/", async (req, res) => {
//     const { imagesPublicId } = req.body;
//     try {
//       const product = new Product(req.body);
//       await product.save();
//       res.status(201).json(product);
//     } catch (error) {
//       // Cleanup uploaded images
//       for (const publicId of imagesPublicId) {
//         await axios.delete(`https://api.cloudinary.com/v1_1/your-cloud-name/image/destroy`, {
//           data: { public_id: publicId },
//         });
//       }
//       res.status(500).json({ error: "Failed to save product. Please try again." });
//     }
//   });
router.post("/addproduct",addProduct);

// 🟢 Get all products
router.get("/getallproducts",getAllProducts);

// // 🟢 Get a single product by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ error: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 🟢 Update a product
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
//     res.json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 🟢 Delete a product
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//     if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
//     res.json({ message: "Product deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

export default router;
