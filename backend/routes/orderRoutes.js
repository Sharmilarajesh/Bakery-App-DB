const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

router.post("/", async (req, res) => {
  const { customerName, phone, address, products } = req.body;

  console.log(" Order Request Received:", {
    customerName,
    phone,
    address,
    productsCount: products?.length,
  });

  if (!customerName || !phone ||!address ||!products ||products.length === 0) {
    console.error(" Validation failed: Missing required fields");
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    let orderItems = [];
    let totalAmount = 0;

    for (const item of products) {
      const dbProduct = await Product.findById(item.productId);

      if (!dbProduct) {
        console.error(" Product not found:", item.productId);
        return res.status(404).json({
          message: `Product not found`,
          product: item.productId,
        });
      }

      if (dbProduct.quantity < item.quantity) {
        console.error(" Out of stock:", dbProduct.name);
        return res.status(400).json({
          message: `Out of Stock - ${dbProduct.name}. Only ${dbProduct.quantity} item(s) available.`,
        });
      }

      const subtotal = dbProduct.price * item.quantity;

      console.log(
        ` Item added - ${dbProduct.name}: ₹${dbProduct.price} x ${item.quantity} = ₹${subtotal}`,
      );

      orderItems.push({
        productId: dbProduct._id,
        productName: dbProduct.name,
        unitPrice: dbProduct.price,
        quantity: item.quantity,
        subtotal: subtotal,
      });

      totalAmount += subtotal;
    }

    console.log(" Order Total:", totalAmount);

    const order = new Order({
      customerName,
      phone,
      address,
      items: orderItems,
      totalAmount,
    });

    await order.save();

    console.log(" Order saved successfully:", order._id);
    console.log(" Order Details:", JSON.stringify(order, null, 2));

    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      });
    }

    res.status(201).json(order);
  } catch (err) {
    console.error(" Order creation error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
