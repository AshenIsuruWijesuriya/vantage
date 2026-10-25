import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

// Orders at or above this total get free delivery (LKR)
export const FREE_DELIVERY = 15000;
export const DELIVERY_FEE = 450;

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('vantage-cart')) || []; } catch { return []; }
};

// The same product in a different colour or size is a separate line in the bag
export const lineKey = (item) => `${item.productId}-${item.colour}-${item.size}`;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  // Save the bag whenever it changes, so it survives a page refresh
  useEffect(() => {
    try { localStorage.setItem('vantage-cart', JSON.stringify(items)); } catch { /* storage blocked */ }
  }, [items]);

  // Add an item, or increase its quantity if it's already in the bag (never above stock)
  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => lineKey(i) === lineKey(item));
      if (!existing) return [...prev, item];
      return prev.map((i) =>
        i === existing ? { ...i, qty: Math.min(i.qty + item.qty, i.maxQty) } : i
      );
    });
  };

  // Set a line's quantity; 0 removes it
  const updateQty = (key, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (lineKey(i) === key ? { ...i, qty: Math.min(qty, i.maxQty) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (key) => setItems((prev) => prev.filter((i) => lineKey(i) !== key));
  const clearCart = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const shipping = items.length === 0 || subtotal >= FREE_DELIVERY ? 0 : DELIVERY_FEE;

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, shipping, addItem, updateQty, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);