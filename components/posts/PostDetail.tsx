import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatDate, getAuthor, getAuthorId, readingMinutes } from "@/lib/utils";
import { Post } from "@/types/post";
import CoverImage from "@/components/posts/CoverImage";
import Markdown from "@/components/shared/Markdown";
import AuthorAvatar from "@/components/shared/AuthorAvatar";
import CommentForm from "@/components/comments/CommentForm";
import CommentActions from "@/components/comments/CommentActions";

const PostDetail = ({ post }: { post: Post }) => {
  const author = getAuthor(post.author);
  const comments = post.comments ?? [];

  return (
    <div className="px-4 pb-16 sm:px-6">
      <article>
        <header className="mx-auto max-w-[720px]">
          <Link
            href="/posts"
            className="-ml-3 mb-8 inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-white/70 hover:bg-white/8 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Volver a posts
          </Link>

          <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl">{post.title}</h1>

          <div className="mt-8 flex items-center gap-3">
            <AuthorAvatar name={author.name} className="h-12 w-12 text-lg" />
            <div>
              <p className="font-semibold text-white">
                {author.name} {author.lastName}
              </p>
              <p className="text-sm text-white/65">
                <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                <span aria-hidden> · </span>
                {readingMinutes(post.content)} min de lectura
              </p>
            </div>
          </div>
        </header>

        {post.image && (
          <CoverImage
            src={post.image}
            priority
            sizes="(min-width: 1024px) 960px, 100vw"
            className="mx-auto mt-10 aspect-[2/1] w-full max-w-[960px] rounded-xl sm:mt-12"
          />
        )}

        <Markdown
          content={post.content}
          className="markdown-article mx-auto mt-10 max-w-[720px] text-lg/8 sm:mt-14 sm:text-xl/9"
        />
      </article>

      <section
        aria-labelledby="comments-title"
        className="mx-auto mt-20 max-w-[720px] space-y-6 border-t border-white/8 pt-12"
      >
        <h2 id="comments-title" className="text-2xl font-bold tracking-tight text-white">
          Comentarios <span className="font-normal tabular-nums text-white/60">({comments.length})</span>
        </h2>

        <CommentForm postId={post._id} />

        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment) => {
              const commentAuthor = getAuthor(comment.author);

              return (
                <li key={comment._id} className="rounded-xl border border-white/6 bg-surface-card/40 p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <AuthorAvatar name={commentAuthor.name} className="h-9 w-9 text-sm" />
                      <div>
                        <span className="block text-sm font-semibold text-white">
                          {commentAuthor.name} {commentAuthor.lastName}
                        </span>
                        <time dateTime={comment.createdAt} className="text-xs text-white/60">
                          {formatDate(comment.createdAt)}
                        </time>
                      </div>
                    </div>
                    <CommentActions
                      commentId={comment._id}
                      authorId={getAuthorId(comment.author)}
                      content={comment.content}
                    />
                  </div>
                  <Markdown content={comment.content} variant="comment" className="text-base" />
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-6 text-center text-white/60">Todavía no hay comentarios. Sé el primero en comentar.</p>
        )}
      </section>
    </div>
  );
};

export default PostDetail;
