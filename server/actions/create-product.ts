"use server";

import { ProductSchema } from "@/entities/product-schema";
import { actionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { db } from "..";
import { products } from "../schema";

export const createProduct = actionClient
  .inputSchema(ProductSchema)
  .action(async ({ parsedInput: { id, title, description, price } }) => {
    try {
      //EDIT MODE
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });
        if (!currentProduct) return { error: "Product not found" };
        const editedProduct = await db
          .update(products)
          .set({ description, price, title })
          .where(eq(products.id, id))
          .returning();
        return { success: `Product ${editedProduct[0].title} has been edited` };
      }
      // CREATE MODE
      if (!id) {
        const newProduct = await db
          .insert(products)
          .values({ description, price, title })
          .returning();
        return { success: `Product ${newProduct[0].title} has been created` };
      }
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
