import React, { createContext, useState } from "react";

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: any) => {

  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (item: any, qty: number) => {
    setCart(prev => [...prev, { ...item, qty }]);
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeItem,
        clearCart,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};