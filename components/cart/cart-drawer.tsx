"use client";

import { useCartStore } from "@/lib/client-store";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import CartItems from "./cart-items";
import CartMessage from "./cart-message";
import CartProgress from "./cart-progress";
import OrderConfirmed from "./order-confirmed";
import Payment from "./payment";

const CartDrawer = () => {
  const { cart, checkoutProgress, setCheckoutProgress, cartOpen, setCartOpen } =
    useCartStore();
  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen}>
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center -top-1 -right-0.5 w-4 h-4 dark:bg-primary bg-primary text-white text-xs font-bold rounded-full"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag />
        </div>
      </DrawerTrigger>
      <DrawerContent className="fixed bottom-0 left-0 max-h-[70vh] min-h-[50vh]">
        <DrawerHeader>
          <CartMessage />
        </DrawerHeader>
        <CartProgress />
        {/* To check the progress of the checkout for example whether the user is
        on the payment section. */}
        <div className="overflow-auto p-4">
          {checkoutProgress === "cart-page" && <CartItems />}
          {checkoutProgress === "payment-page" && <Payment />}
          {checkoutProgress === "confirmation-page" && <OrderConfirmed />}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
