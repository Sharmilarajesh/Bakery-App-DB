import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
   
    if (product.quantity !== undefined && product.quantity <= 0) {
      return {
        success: false,
        message: `❌ Out of Stock - ${product.name}. We don't have this item available.`,
      };
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        const newQuantity = existing.cartQuantity + 1;
        if (product.quantity !== undefined && newQuantity > product.quantity) {
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item,
        );
      }

      if (product.quantity !== undefined && 1 > product.quantity) {
        return prev;
      }

      return [...prev, { ...product, cartQuantity: 1 }];
    });

    return {
      success: true,
      message: `✓ ${product.name} added to cart`,
    };
  };

  const increaseQty = (id, maxQuantity) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.cartQuantity + 1;
         
          if (maxQuantity !== undefined && newQuantity > maxQuantity) {
            return item;
          }
          return { ...item, cartQuantity: newQuantity };
        }
        return item;
      }),
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              cartQuantity: item.cartQuantity > 1 ? item.cartQuantity - 1 : 1,
            }
          : item,
      ),
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
