"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";
import { revalidatePosts } from "@/app/actions";
import { deletePost } from "@/services/postService";
import { getErrorMessage } from "@/lib/api";
import { cn, formatDate, paginate } from "@/lib/utils";
import { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CoverImage from "@/components/posts/CoverImage";
import Paginator from "@/components/shared/Paginator";

const PER_PAGE = 8;

const iconButton = "h-11 w-11 rounded-lg text-white/70 sm:h-9 sm:w-9";

interface UserPostsProps {
  posts: Post[];
  page: number;
  editingId?: string;
  onEdit: (post: Post) => void;
  onDeleted: (postId: string) => void;
}

const UserPosts = ({ posts, page, editingId, onEdit, onDeleted }: UserPostsProps) => {
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);

  const handleDelete = async (post: Post) => {
    try {
      await deletePost(post._id);
      toast.success("Post eliminado");
      onDeleted(post._id);
      await revalidatePosts();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo eliminar el post"));
    }
  };

  const current = paginate(posts, page, PER_PAGE);

  return (
    <aside aria-labelledby="my-posts-title" id="my-posts" className="scroll-mt-28 lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-xl border border-white/8 bg-surface-card/60">
        <div className="flex items-baseline justify-between gap-4 border-b border-white/8 px-5 py-4">
          <h2 id="my-posts-title" className="text-lg font-bold tracking-tight text-white">
            Tus publicaciones
          </h2>
          {posts.length > 0 && (
            <span className="text-sm tabular-nums text-white/60">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </span>
          )}
        </div>

        {posts.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm leading-relaxed text-white/65">
            Todavía no publicaste nada.
            <br />
            Tu primera entrada aparecerá aquí.
          </p>
        ) : (
          <ul className="divide-y divide-white/6">
            {current.items.map((post) => {
              const isEditing = post._id === editingId;
              const commentCount = post.comments?.length ?? 0;

              return (
                <li
                  key={post._id}
                  aria-current={isEditing || undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 transition-colors sm:px-4",
                    isEditing ? "bg-codePrimary/12" : "hover:bg-white/3"
                  )}
                >
                  <CoverImage src={post.image} sizes="80px" className="h-14 w-20 shrink-0 rounded-md" />

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/posts/${post._id}`}
                      className="line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors hover:text-codeAccent"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-xs text-white/60">
                      {isEditing ? (
                        <span className="font-medium text-white/85">Editando ahora</span>
                      ) : (
                        <>
                          <time dateTime={post.createdAt}>{formatDate(post.createdAt, "short")}</time>
                          <span aria-hidden>·</span>
                          <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                          <span className="tabular-nums">{commentCount}</span>
                          <span className="sr-only">comentarios</span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Editar "${post.title}"`}
                      disabled={isEditing}
                      className={cn(iconButton, "hover:bg-white/10 hover:text-white")}
                      onClick={() => onEdit(post)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Eliminar "${post.title}"`}
                      className={cn(iconButton, "hover:bg-red-500/10 hover:text-red-400")}
                      onClick={() => setDeletingPost(post)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {current.totalPages > 1 && (
          <div className="border-t border-white/8 px-2 py-2">
            <Paginator
              compact
              page={current.page}
              totalPages={current.totalPages}
              basePath="/posts/createpost"
              hash="#my-posts"
            />
          </div>
        )}
      </div>

      <AlertDialog open={!!deletingPost} onOpenChange={(open) => !open && setDeletingPost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Eliminar este post?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Se eliminará «{deletingPost?.title}» junto con todos sus comentarios. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11 rounded-lg border-white/12 bg-transparent text-white/70 hover:bg-white/10 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-11 rounded-lg bg-red-500 text-white hover:bg-red-600"
              onClick={() => deletingPost && handleDelete(deletingPost)}
            >
              Eliminar post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
};

export default UserPosts;
