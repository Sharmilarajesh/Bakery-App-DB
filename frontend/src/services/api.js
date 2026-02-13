const API_BASE_URL = "http://localhost:5000/api";
const API_HOST = "http://localhost:5000";

export const getImageUrl = (imgPath) => {
  if (!imgPath) return "";
  if (imgPath.startsWith("http")) return imgPath;
  return `${API_HOST}/public${imgPath}`;
};

// Products API
export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

export const updateProductQuantity = async (productId, quantity) => {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/quantity`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    },
  );
  if (!response.ok) throw new Error("Failed to update product quantity");
  return response.json();
};

// Orders API
export const createOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create order");
  }
  return response.json();
};
