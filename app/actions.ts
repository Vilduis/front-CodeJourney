"use server";

import { refresh, updateTag } from "next/cache";
import { POSTS_TAG } from "@/lib/server/posts";

export async function revalidatePosts() {
  updateTag(POSTS_TAG);
  refresh();
}
