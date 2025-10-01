"use server";

import { ReviewSchema } from "@/entities/reviews-schema";
import { actionClient } from "@/lib/safe-action";
import { auth } from "../auth";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { reviews } from "../schema";
import { revalidatePath } from "next/cache";

export const addReview = actionClient
  .inputSchema(ReviewSchema)
  .action(async ({ parsedInput: { comment, rating, productID } }) => {
    try {
      const session = await auth();
      if (!session) return { error: "You must be logged in to add a review!" };

      const existingReview = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productID, productID),
          eq(reviews.userID, session.user.id)
        ),
      });

      if (existingReview)
        return {
          error: "You have already submitted a review for this product.",
        };

      const newReview = await db
        .insert(reviews)
        .values({
          comment,
          rating,
          productID,
          userID: session?.user.id,
        })
        .returning();

      revalidatePath(`/product/${productID}`);
      return { success: "Review added successfully!", review: newReview[0] };
    } catch (err) {
      return { error: JSON.stringify(err) };
    }
  });
