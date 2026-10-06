import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import PostList from "@/components/posts/PostList";
import { Button } from "@/components/ui/button";
import { fetchPosts } from "@/lib/server/posts";

export const metadata: Metadata = {
  title: "Posts recientes",
  description: "Lo que la comunidad de CodeJourney está aprendiendo sobre programación y desarrollo.",
};

interface PageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

export default async function PostsPage({ searchParams }: PageProps) {
  const [{ page }, posts] = await Promise.all([searchParams, fetchPosts()]);

  return (
    <section className="bg-surface-base px-4 sm:px-6 pt-28 pb-24">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Posts recientes</h1>
            <p className="text-white/70">Lo que la comunidad está aprendiendo.</p>
          </div>
          <Button
            asChild
            className="h-11 bg-codeAccent text-slate-900 hover:bg-codeAccent/90 font-semibold rounded-lg px-5 shadow-lg shadow-codeAccent/20"
          >
            <Link href="/posts/createpost">
              <Plus size={20} aria-hidden /> Escribir un post
            </Link>
          </Button>
        </div>
        <PostList posts={posts} page={Number(page) || 1} />
      </div>
    </section>
  );
}
