import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/posts/PostDetail";
import { fetchPost } from "@/lib/server/posts";
import { toPlainText } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPost(id);
  if (!post) return { title: "Post no encontrado" };

  const description = toPlainText(post.content).slice(0, 160);
  return {
    title: post.title,
    description,
    openGraph: { title: post.title, description, images: post.image ? [post.image] : [] },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await fetchPost(id);
  if (!post) notFound();

  return (
    <section className="bg-surface-base min-h-screen pt-28">
      <PostDetail post={post} />
    </section>
  );
}
