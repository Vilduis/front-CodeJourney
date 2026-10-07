"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { revalidatePosts } from "@/app/actions";
import { createComment, MIN_COMMENT_LENGTH, COMMENT_TOO_SHORT } from "@/services/commentService";
import { getErrorMessage } from "@/lib/api";
import { withNext } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@/components/shared/MarkdownEditor";

const CommentForm = ({ postId }: { postId: string }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isInitialized) {
    return <div aria-hidden className="h-[188px] shrink-0 rounded-xl border border-white/8 bg-surface-card/40 motion-safe:animate-pulse" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-surface-card/40 border border-white/8 rounded-xl p-5 text-center shrink-0">
        <p className="text-white/70 text-sm mb-3">Inicia sesión para comentar</p>
        <Button asChild className="h-10 bg-codePrimary hover:bg-codePrimary/80 rounded-lg px-5 text-sm">
          <Link href={withNext("/login", `/posts/${postId}`)}>Iniciar sesión</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = comment.trim();
    if (content.length < MIN_COMMENT_LENGTH) {
      toast.error(COMMENT_TOO_SHORT);
      return;
    }

    setIsSubmitting(true);
    try {
      await createComment(postId, content);
      setComment("");
      toast.success("Comentario publicado");
      await revalidatePosts();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo publicar el comentario"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-card/60 border border-white/8 rounded-xl p-4 space-y-3 shrink-0">
      <MarkdownEditor
        variant="comment"
        label="Escribe tu comentario"
        placeholder="Escribe tu comentario. Puedes usar `código` y bloques con ```"
        value={comment}
        onChange={setComment}
        minHeight="min-h-[110px]"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 bg-codePrimary hover:bg-codePrimary/80 rounded-lg px-5 text-sm"
        >
          {isSubmitting ? "Publicando..." : "Comentar"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
