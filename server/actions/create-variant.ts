"use server";

import { VariantSchema } from "@/entities/variants-schema";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { db } from "..";
import {
  productVariants,
  variantTags,
  variantImages,
  products,
} from "../schema";
import { eq } from "drizzle-orm";
import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);
const algoliaIndex = client.initIndex("products");

export const createVariant = actionClient
  .inputSchema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        productID,
        id,
        editMode,
        productType,
        color,
        tags,
        variantImages: newImgs,
      },
    }) => {
      // If in edit mode, update the existing variant
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({ color, productType, updated: new Date() })
            .where(eq(productVariants.id, id))
            .returning();
          await db
            .delete(variantTags)
            .where(eq(variantTags.variantID, editVariant[0].id));
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: editVariant[0].id,
            }))
          );
          await db
            .delete(variantImages)
            .where(eq(variantImages.variantID, editVariant[0].id));
          await db.insert(variantImages).values(
            newImgs.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: editVariant[0].id,
              order: idx,
            }))
          );
          algoliaIndex.partialUpdateObject({
            objectID: editVariant[0].id.toString(),
            id: editVariant[0].productID,
            productType: editVariant[0].productType,
            variantImages: newImgs[0].url,
          });
          revalidatePath("/dashboard/products");
          return { success: `Edited ${productType}` };
        }
        // If not in edit mode, create a new variant
        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productID,
            })
            .returning();
          const product = await db.query.products.findFirst({
            where: eq(products.id, productID),
          });
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: newVariant[0].id,
            }))
          );
          await db.insert(variantImages).values(
            newImgs.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: newVariant[0].id,
              order: idx,
            }))
          );
          if (product) {
            algoliaIndex.saveObject({
              objectID: newVariant[0].id.toString(),
              id: newVariant[0].productID,
              title: product.title,
              price: product.price,
              productType: newVariant[0].productType,
              variantImages: newImgs[0].url,
            });
          }
          revalidatePath("/dashboard/products");
          return { success: `Added ${productType}` };
        }
      } catch (error) {
        console.error("Algolia error:", error);
        return { error: "Failed to create variant" };
      }
    }
  );
