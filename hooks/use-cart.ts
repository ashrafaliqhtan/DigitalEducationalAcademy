"use client"

import { useShop } from "@/contexts/shop-context"

export function useCart() {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal } = useShop()

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    isOpen: false, // This will be managed by the Cart component
    setIsOpen: () => {}, // This will be managed by the Cart component
  }
}
