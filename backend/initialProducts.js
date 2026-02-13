const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const initialProducts = [
  { name: "Chocolate Cake", price: 450, category: "Cake", img: "/products/chocolate-cake.jpeg", quantity: 10 },
  { name: "Vanilla Cake", price: 400, category: "Cake", img: "/products/vanilla-cake.jpg", quantity: 8 },
  { name: "Red Velvet Cake", price: 520, category: "Cake", img: "/products/red-velvet-cake.jpeg", quantity: 5 },
  { name: "Butter Cookies", price: 180, category: "Cookies", img: "/products/butter-cookie.jpeg", quantity: 15 },
  { name: "Choco Chip Cookies", price: 220, category: "Cookies", img: "/products/choco-chip-cookie.jpeg", quantity: 12 },
  { name: "White Bread", price: 60, category: "Bread", img: "/products/white-bread.jpeg", quantity: 20 },
  { name: "Brown Bread", price: 80, category: "Bread", img: "/products/brown-bread.jpg", quantity: 18 },
  { name: "Blueberry Muffin", price: 120, category: "Muffin", img: "/products/blueberry-muffin.jpeg", quantity: 10 },
  { name: "Chocolate Muffin", price: 130, category: "Muffin", img: "/products/chocolate-muffin.jpeg", quantity: 7 },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected, adding initial products...");
    await Product.deleteMany({});
    await Product.insertMany(initialProducts);
    console.log("Initial products added!");
    process.exit();
  })
  .catch((err) => console.log(err));
