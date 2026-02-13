import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { fetchProducts, getImageUrl } from "../services/api";

const Products = () => {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [addedMessage, setAddedMessage] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsFetching(true);
        setError(null);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setIsFetching(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      img: product.img,
      quantity: product.quantity, 
    };

    const result = addToCart(cartProduct);
    setAddedMessage((prev) => ({ ...prev, [cartProduct.id]: result.message }));

    setTimeout(() => {
      setAddedMessage((prev) => ({ ...prev, [cartProduct.id]: null }));
    }, 2000);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            Error loading products
          </h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 min-h-screen">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#C97C5D]">
          All Products
        </h1>
        <p className="text-gray-600">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "item" : "items"} found
        </p>
      </div>

 
      <div className="mb-10 relative">
        <div className="relative max-w-md mx-auto">
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-[#C97C5D] focus:border-transparent 
                    transition-all duration-300 hover:border-[#C97C5D]/50"
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((prod, index) => (
            <div
              key={prod._id || prod.id}
              className="group bg-white rounded-2xl shadow-lg border border-gray-200 p-4 flex flex-col items-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-xl mb-4 w-full">
                <img
                  src={getImageUrl(prod.img)}
                  alt={prod.name}
                  className="w-full h-52 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
           
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-[#C97C5D]">
                    {prod.category}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-1 text-center text-gray-800 group-hover:text-[#C97C5D] transition-colors">
                {prod.name}
              </h3>
              <p className="text-xl font-bold text-[#C97C5D] mb-4">
                ₹{prod.price}
              </p>

              <button
                onClick={() => handleAddToCart(prod)}
                className={`relative w-full py-3 rounded-full font-semibold overflow-hidden transition-all duration-300 ${
                  addedMessage[prod._id || prod.id]
                    ? addedMessage[prod._id || prod.id].includes("❌")
                      ? "bg-red-500"
                      : "bg-green-500"
                    : "bg-gradient-to-r from-[#C97C5D] to-[#D4A574] hover:shadow-lg"
                } text-white`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {addedMessage[prod._id || prod.id] ? (
                    <>
                      {addedMessage[prod._id || prod.id].includes("❌") ? (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Out of Stock
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Added!
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </span>

                {/* Button hover effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#C97C5D] transition-transform duration-300 ${
                    addedMessage[prod._id || prod.id]
                      ? "translate-y-0"
                      : "translate-y-full group-hover:translate-y-0"
                  }`}
                />
              </button>

              {/* Stock info below button */}
              {prod.quantity === undefined || prod.quantity === 0 ? (
                <p className="mt-2 text-xs text-red-600 font-medium">
                  Out of Stock
                </p>
              ) : prod.quantity < 5 ? (
                <p className="mt-2 text-xs text-orange-600 font-medium">
                  Only {prod.quantity} left!
                </p>
              ) : (
                <p className="mt-2 text-xs text-green-600 font-medium">
                  In Stock
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Empty state with animation */
        <div className="text-center py-16 animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce">🍰</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-6">
            Try a different search term or browse all products
          </p>
          <button
            onClick={() => {
              setSearchText("");
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#C97C5D] to-[#D4A574] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
