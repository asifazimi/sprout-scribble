"use server";

import { createOrderSchema } from "@/entities/order-schema";
import { actionClient } from "@/lib/safe-action";
import { db } from "@/server";
import { auth } from "../auth";
import { orderProduct, orders } from "../schema";

export const createOrder = actionClient
  .inputSchema(createOrderSchema)
  .action(
    async ({ parsedInput: { products, status, total, paymentIntentID } }) => {
      const user = await auth();
      if (!user) return { error: "user not found" };

      const order = await db
        .insert(orders)
        .values({
          status,
          paymentIntentID,
          total,
          userID: user.user.id,
        })
        .returning();
      const orderProducts = products.map(
        async ({ productID, quantity, variantID }) => {
          const newOrderProduct = await db.insert(orderProduct).values({
            quantity,
            orderID: order[0].id,
            productID: productID,
            productVariantID: variantID,
          });
        }
      );
      return { success: "Order has been added" };
    }
  );
