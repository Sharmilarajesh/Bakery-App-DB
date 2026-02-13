const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

router.post("/", async (req, res) => {
  const { customerName, phone, address, products } = req.body;

  if (!customerName || !phone || !address || !products ||products.length === 0) {
    console.log("Request body:", req.body);
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    for (const product of products) {
      const dbProduct = await Product.findById(product.productId);

      if (!dbProduct) {
        return res.status(404).json({
          message: `Product not found`,
          product: product.productId,
        });
      }

      if (dbProduct.quantity < product.quantity) {
        return res.status(400).json({
          message: `Out of Stock - ${dbProduct.name}. Only ${dbProduct.quantity} item(s) available.`,
        });
      }
    }

 
    const items = products.map((p) => ({productId: p.productId,quantity: p.quantity,}));

    const order = new Order({customerName,phone,address,items,});

    await order.save();

    for (const product of products) {
      await Product.findByIdAndUpdate(
        product.productId,
        { $inc: { quantity: -product.quantity } },
        { new: true },
      );
    }

    res.json(order);
  } catch (err) {
    console.error("Order creation error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({}).populate("items.productId");
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
