import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (medicine, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.medicineId === medicine._id);
      if (existing) {
        return prev.map((i) =>
          i.medicineId === medicine._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          medicineId: medicine._id,
          name: medicine.name,
          price: medicine.price,
          stock: medicine.stock,
          requiresPrescription: medicine.requiresPrescription || false,
          quantity,
        },
      ];
    });
    toast.success(`${medicine.name} added to cart`);
  };

  const updateQuantity = (medicineId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((i) => (i.medicineId === medicineId ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (medicineId) => {
    setCartItems((prev) => prev.filter((i) => i.medicineId !== medicineId));
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
