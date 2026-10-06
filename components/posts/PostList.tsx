import Link from "next/link";
import { paginate } from "@/lib/utils";
import { Post } from "@/types/post";
import PostCard from "@/components/posts/PostCard";
import Paginator from "@/components/shared/Paginator";

const PER_PAGE = 9;

export default function PostList({ posts, page }: { posts: Post[]; page: number }) {
  if (posts.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-white/12 px-6 py-16 text-center">
        <p className="text-lg font-semibold text-white">Todavía no hay posts</p>
        <p className="mt-2 text-white/65">Sé la primera persona en contar lo que está aprendiendo.</p>
        <Link
          href="/posts/createpost"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-codeAccent px-6 font-semibold text-slate-900 hover:bg-codeAccent/90"
        >
          Escribir un post
        </Link>
      </div>
    );
  }

  const current = paginate(posts, page, PER_PAGE);

  return (
    <section className="mt-4">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {current.items.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      <Paginator page={current.page} totalPages={current.totalPages} basePath="/posts" />
    </section>
  );
}
