import React, { createContext, useContext, useEffect, useState } from "react";
import type { CartItem, Product } from "../types";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateCartItems: (newCartItems: CartItem[]) => void;
  removeFromCart: (productId: string) => void;
  emptyCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isInit, setIsInit] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
    setIsInit(true);
  }, []);

  useEffect(() => {
    if (isInit) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [isInit, cartItems]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { id: product.id, product, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const updateCartItems = (newCartItems: CartItem[]) => {
    setCartItems(newCartItems);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const emptyCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        updateCartItems,
        removeFromCart,
        emptyCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
