const express = require("express");
const router = express.Router();
const Product = require("../models/Product");


router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.put("/:id/quantity", async (req, res) => {
  const { quantity } = req.body;

  if (quantity == null) return res.status(400).json({ message: "Quantity required" });

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.quantity = quantity;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
