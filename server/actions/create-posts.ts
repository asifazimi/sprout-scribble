"use server";

import { db } from "@/server";

export type FormState = {
  success: string | null;
  error: string | null;
};

async function createPost(prevState: FormState, formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  if (!title) {
    return { error: "Title is required!", success: null };
  }

  const content = formData.get("content")?.toString().trim();
  if (!content) {
    return { error: "Content is required!", success: null };
  }

  try {
    const result = await db
      .insert(posts)
      .values({
        title,
        content,
      })
      .returning();

    if (!result || result.length === 0) {
      return { error: "No posts found!", success: null };
    }
    return { error: null, success: "Post created successfully!" };
  } catch (err) {
    console.error("Error creating post:", err);
    return { error: "Failed to create post.", success: null };
  }
}

export default createPost;
