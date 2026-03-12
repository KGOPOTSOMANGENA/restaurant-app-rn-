import React, { createContext, useState } from "react";

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<any[]>([]);

  // ✅ extras passed in and stored with each cart item
  const addToCart = (item: any, qty: number, extras: any[] = []) => {
    const extrasTotal = extras.reduce((sum: number, e: any) => sum + e.price, 0);
    setCart((prev) => [
      ...prev,
      {
        ...item,
        qty,
        selectedExtras: extras,
        // ✅ price per unit includes extras so CartScreen and CheckoutScreen stay unchanged
        price: item.price + extrasTotal,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};