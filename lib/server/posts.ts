import { cookies } from "next/headers";
import { Post } from "@/types/post";

const API_URL = (process.env.API_URL || "http://localhost:5000").replace(/\/+$/, "");

export const POSTS_TAG = "posts";

const newestFirst = (posts: Post[]) =>
  posts.toSorted((a, b) => Date.parse(b.createdAt ?? "") - Date.parse(a.createdAt ?? ""));

const fetchPublic = (path: string) => fetch(`${API_URL}${path}`, { next: { revalidate: 60, tags: [POSTS_TAG] } });

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetchPublic("/api/posts");
  if (!res.ok) throw new Error(`GET /api/posts respondió ${res.status}`);
  const { posts }: { posts: Post[] } = await res.json();
  return newestFirst(posts);
}

export async function fetchPost(id: string): Promise<Post | null> {
  const res = await fetchPublic(`/api/posts/${encodeURIComponent(id)}`);
  if (res.status === 400 || res.status === 404) return null;
  if (!res.ok) throw new Error(`GET /api/posts/${id} respondió ${res.status}`);
  const { post }: { post: Post } = await res.json();
  return post;
}

export async function fetchMyPosts(): Promise<Post[] | null> {
  const res = await fetch(`${API_URL}/api/posts/user/posts`, {
    headers: { cookie: (await cookies()).toString() },
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`GET /api/posts/user/posts respondió ${res.status}`);
  const { posts }: { posts: Post[] } = await res.json();
  return newestFirst(posts);
}
