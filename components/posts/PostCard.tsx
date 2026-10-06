import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { formatDate, getAuthor, toPlainText } from "@/lib/utils";
import { Post } from "@/types/post";
import CoverImage from "@/components/posts/CoverImage";
import AuthorAvatar from "@/components/shared/AuthorAvatar";

const PostCard = ({ post }: { post: Post }) => {
  const author = getAuthor(post.author);
  const commentCount = post.comments?.length ?? 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-white/8 bg-surface-card/60 transition-all duration-300 hover:border-codePrimary/40 hover:bg-surface-card/80 hover:shadow-xl hover:shadow-black/40 motion-safe:hover:-translate-y-1 focus-within:border-codeAccent/60">
      {post.image && (
        <CoverImage
          src={post.image}
          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-44 w-full"
        />
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2 className="text-lg font-bold leading-snug text-white line-clamp-2">
          <Link
            href={`/posts/${post._id}`}
            className="outline-none after:absolute after:inset-0 group-hover:text-codeAccent transition-colors"
          >
            {post.title}
          </Link>
        </h2>
        <p className="flex-1 text-sm leading-relaxed text-white/70 line-clamp-3">{toPlainText(post.content)}</p>

        <div className="flex items-center justify-between gap-3 border-t border-white/6 pt-3 text-xs text-white/60">
          <div className="flex min-w-0 items-center gap-2">
            <AuthorAvatar name={author.name} />
            <span className="truncate">
              <span className="font-semibold text-white/85">
                {author.name} {author.lastName}
              </span>{" "}
              · <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            </span>
          </div>
          <span className="flex shrink-0 items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden />
            {commentCount} <span className="sr-only">comentarios</span>
          </span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
