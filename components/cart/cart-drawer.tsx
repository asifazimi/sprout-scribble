"use client";

import { useCartStore } from "@/lib/client-store";
import { ShoppingBag } from "lucide-react";

const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen } = useCartStore();

  return (
    <div>
      <ShoppingBag />
    </div>
  );
};

export default CartDrawer;
