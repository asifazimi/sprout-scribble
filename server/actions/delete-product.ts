"use server";

import { actionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { db } from "..";
import { products } from "../schema";

const deleteProduct = actionClient
  .inputSchema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      return { success: `Product ${data[0]?.title ?? ""} has been deleted` };
    } catch (error) {
      return { error: "Failed to delete product" };
    }
  });

export default deleteProduct;
