import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PostWorkspace from "@/components/posts/PostWorkspace";
import { fetchMyPosts } from "@/lib/server/posts";
import { withNext } from "@/lib/utils";

export const metadata: Metadata = { title: "Escribir un post" };

interface PageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

export default async function CreatePostPage({ searchParams }: PageProps) {
  const [{ page }, posts] = await Promise.all([searchParams, fetchMyPosts()]);
  if (!posts) redirect(withNext("/login", "/posts/createpost"));

  return (
    <section className="bg-surface-base px-4 pt-28 pb-24 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        <PostWorkspace posts={posts} page={Number(page) || 1} />
      </div>
    </section>
  );
}
