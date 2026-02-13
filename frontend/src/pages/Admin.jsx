import React, { useState, useEffect } from "react";
import { fetchProducts, updateProductQuantity, getImageUrl } from "../services/api";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState({});
  const [quantityValues, setQuantityValues] = useState({});

  const ADMIN_PASSWORD = "12345";

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      setPassword("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      // Initialize quantity values
      const initialQuantities = {};
      data.forEach((product) => {
        initialQuantities[product._id] = product.quantity || 0;
      });
      setQuantityValues(initialQuantities);
    } catch (err) {
      console.error("Error loading products:", err);
      alert("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (productId, value) => {
    setQuantityValues({
      ...quantityValues,
      [productId]: parseInt(value) || 0,
    });
  };

  const handleUpdateQuantity = async (productId) => {
    const newQuantity = quantityValues[productId];
    if (newQuantity === undefined || newQuantity < 0) {
      alert("Please enter a valid quantity");
      return;
    }

    try {
      setIsLoading(true);
      const updatedProduct = await updateProductQuantity(productId, newQuantity);
      // Update the product in the list
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? updatedProduct : p))
      );
      setEditingQuantity((prev) => ({ ...prev, [productId]: false }));
      alert("Quantity updated successfully!");
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-start justify-center px-6 pt-24 pb-16">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-[#C97C5D] text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97C5D]"
                placeholder="Enter admin password"
                required
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#C97C5D] text-white font-medium rounded-lg hover:bg-[#B36A50] transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-6 pt-24 pb-16">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[#C97C5D]">Admin Panel</h1>
          <p className="text-gray-600">Manage product quantities</p>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {isLoading && products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 animate-spin">🍰</div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Current Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    New Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.img && (
                          <img
                            src={getImageUrl(product.img)}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#C97C5D]">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.quantity > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.quantity || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0"
                        value={quantityValues[product._id] ?? product.quantity ?? 0}
                        onChange={(e) =>
                          handleQuantityChange(product._id, e.target.value)
                        }
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C97C5D]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleUpdateQuantity(product._id)}
                        disabled={
                          isLoading ||
                          quantityValues[product._id] === product.quantity
                        }
                        className="px-4 py-2 bg-[#C97C5D] text-white rounded-lg hover:bg-[#B36A50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
