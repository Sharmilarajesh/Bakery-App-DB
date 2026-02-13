import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition">
      <div className="h-40 w-full rounded-lg overflow-hidden">
        <img src={product.img} alt={product.name} className="object-cover w-full h-full" />
      </div>
      <h3 className="mt-4 text-lg font-medium">{product.name}</h3>
      <p className="mt-2 text-gray-700">₹{product.price}</p>
      <button
        className="mt-4 bg-[#C97C5D] text-white px-4 py-2 rounded-full hover:bg-[#b56d50] transition"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
