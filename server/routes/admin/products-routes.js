const express = require("express");

const {
  handleImageUpload,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} = require("../../controllers/admin/products-controller");
const { addProduct } = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add-product", addProduct);

router.put("/edit-product/:id", editProduct);
router.get("/all-products", fetchAllProducts);
router.delete("/delete-product/:id", deleteProduct);





module.exports = router;
