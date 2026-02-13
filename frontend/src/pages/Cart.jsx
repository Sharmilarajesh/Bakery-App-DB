import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { createOrder, getImageUrl } from "../services/api";

const Cart = () => {
  const { cartItems, increaseQty, decreaseQty, removeFromCart, clearCart } =
    useContext(CartContext);

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0,
  );

  const handleCheckout = () => {
    setShowCheckoutForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePay = async () => {
    // Validate form
    if (
      !formData.customerName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);
    try {
      // Prepare order data
      const orderData = {
        customerName: formData.customerName,
        phone: formData.phone,
        address: formData.address,
        products: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.cartQuantity,
        })),
      };

      // Create order via API
      await createOrder(orderData);

      // Show success message
      setShowPaymentSuccess(true);
      setShowCheckoutForm(false);

      // Clear cart after a delay
      setTimeout(() => {
        clearCart();
        setFormData({ customerName: "", phone: "", address: "" });
      }, 2000);
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to place order. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !showPaymentSuccess)
    return (
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-3xl font-bold mb-4 text-[#C97C5D]">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-6">Add some delicious treats!</p>
        {/* CHANGE THIS: Use Link instead of <a> */}
        <Link
          to="/products"
          className="px-6 py-3 bg-[#C97C5D] text-white font-medium rounded-full hover:bg-[#B36A50] transition-colors inline-block"
        >
          Browse Products
        </Link>
      </div>
    );

  // Payment Success Message
  if (showPaymentSuccess) {
    return (
      <div className="max-w-md mx-auto px-6 pt-24 pb-16 text-center">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 mb-6">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-green-700 mb-2">₹{total} has been paid</p>
          <p className="text-gray-600 font-semibold">
            Your order will be delivered soon!
          </p>
        </div>
        <Link
          to="/products"
          className="px-6 py-3 bg-[#C97C5D] text-white font-medium rounded-full hover:bg-[#B36A50] transition-colors inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Checkout Form
  if (showCheckoutForm) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#C97C5D]">Checkout</h1>
          <p className="text-gray-600">Please provide your details</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97C5D]"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97C5D]"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97C5D]"
                placeholder="Enter your delivery address"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Order Total</h3>
            <p className="text-2xl font-bold text-[#C97C5D]">₹{total}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowCheckoutForm(false)}
            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Back to Cart
          </button>
          <button
            onClick={handlePay}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-[#C97C5D] text-white font-medium rounded-lg hover:bg-[#B36A50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : `Pay ₹${total}`}
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 bg-red-50 border border-red-300 rounded-lg p-4 text-center">
            <p className="text-red-700 font-medium">⚠️ {errorMessage}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#C97C5D]">Your Cart</h1>
        <p className="text-gray-600">{cartItems.length} items</p>
      </div>

 
      <div className="space-y-6 mb-8">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow p-6 flex items-center justify-between border border-gray-200 hover:shadow-md transition-shadow duration-300 fade-in-up"
          >
            {/* Left: Product Info */}
            <div className="flex items-center gap-4">
              <img
                src={getImageUrl(item.img)}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-[#C97C5D] font-semibold">₹{item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => decreaseQty(item.id)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700"
                disabled={item.cartQuantity <= 1}
              >
                -
              </button>
              <span className="text-xl font-bold w-8 text-center">
                {item.cartQuantity}
              </span>
              <button
                onClick={() => increaseQty(item.id, item.quantity)}
                className="w-8 h-8 rounded-full bg-[#C97C5D] hover:bg-[#B36A50] flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={item.cartQuantity >= item.quantity}
              >
                +
              </button>
            </div>

            <div className="text-right">
              <p className="text-xl font-bold">
                ₹{item.price * item.cartQuantity}
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="mt-2 text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total & Actions */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Total</h3>
          <p className="text-2xl font-bold text-[#C97C5D]">₹{total}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="flex-1 py-3 border-2 border-red-500 text-red-500 font-medium 
                      rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="flex-1 py-3 bg-[#C97C5D] text-white font-medium rounded-lg hover:bg-[#B36A50] transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
