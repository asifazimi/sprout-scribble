"use server";

import { db } from "@/server";
import { posts } from "@/server/schema";

async function getPosts() {
  const postsLists = await db.select().from(posts);

  if (!postsLists) {
    return { error: "No posts found!" };
  }
  return { success: postsLists };
}

export default getPosts;
