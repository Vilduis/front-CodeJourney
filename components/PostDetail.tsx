"use client";

import { useEffect, useState, useCallback } from "react";
import { getPost } from "@/services/postService";
import { createComment, updateComment, deleteComment } from "@/services/commentService";
import { Post } from "../types/posts";
import Image from "next/image";
import { MessageSquare, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { formatDate, getAuthor } from "@/lib/utils";

interface PostDetailProps {
  postId: string;
}

const PostDetail = ({ postId }: PostDetailProps) => {
  const router = useRouter();
  const { user, token } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    try {
      const postData = await getPost(postId);
      if (postData) {
        setPost(postData);
      } else {
        setError("No se pudo cargar el post");
      }
    } catch {
      setError("Error al cargar el post");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para comentar");
      return;
    }
    if (!comment.trim()) {
      toast.error("El comentario no puede estar vacío");
      return;
    }
    if (!token) {
      toast.error("Sesión expirada");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createComment(token, postId, { content: comment.trim() });

      if (result) {
        toast.success("Comentario añadido exitosamente");
        setComment("");
        fetchPost();
      } else {
        toast.error("Error al añadir el comentario");
      }
    } catch {
      toast.error("Error al añadir el comentario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async () => {
    if (!editingComment || !user || !token) return;

    try {
      setIsSubmitting(true);
      const success = await updateComment(token, editingComment, { content: editCommentContent });

      if (success) {
        toast.success("Comentario actualizado exitosamente");
        setEditingComment(null);
        setEditCommentContent("");
        setIsEditDialogOpen(false);
        fetchPost();
      } else {
        toast.error("Error al actualizar el comentario");
      }
    } catch {
      toast.error("Error al actualizar el comentario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user || !token) return;

    try {
      const success = await deleteComment(token, commentId);
      if (success) {
        toast.success("Comentario eliminado exitosamente");
        fetchPost();
      } else {
        toast.error("Error al eliminar el comentario");
      }
    } catch {
      toast.error("Error al eliminar el comentario");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-t-codeAccent border-b-transparent border-l-transparent border-r-transparent"></div>
      </div>
    );
  }

  if (error || !post) {
    return <div className="text-center text-red-500">{error || "Post no encontrado"}</div>;
  }

  const author = getAuthor(post.author);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a posts
      </Button>

      {/* Post principal */}
      <Card className="bg-surface-card/60 backdrop-blur-sm border border-white/[0.08] mb-6 overflow-hidden">
        <CardHeader className="pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-codePrimary to-codeAccent text-white font-bold rounded-full text-lg">
              {author.name.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div className="text-base font-bold text-white">
                {author.name} {author.lastName}
              </div>
              <div className="text-xs text-white/30">{formatDate(post.createdAt)}</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <CardTitle className="text-2xl font-bold text-white mb-4 leading-tight">{post.title}</CardTitle>
          {post.image && (
            <div className="mb-6">
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={400}
                className="rounded-xl object-cover w-full max-h-[400px]"
                unoptimized
              />
            </div>
          )}
          <CardDescription className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </CardDescription>
        </CardContent>

        <CardFooter className="border-t border-white/[0.06] pt-4">
          <div className="flex items-center text-white/30 text-xs gap-1.5">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments?.length || 0} comentarios</span>
          </div>
        </CardFooter>
      </Card>

      {/* Sección comentarios */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white drop-shadow-sm">Comentarios</h2>

        {user ? (
          <div className="bg-surface-card/60 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 space-y-3">
            <Textarea
              placeholder="Escribe tu comentario..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 resize-none focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={isSubmitting}
                className="bg-codePrimary hover:bg-codePrimary/80 rounded-lg px-5 text-sm"
              >
                {isSubmitting ? "Enviando..." : "Publicar comentario"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-surface-card/40 border border-white/[0.08] rounded-xl p-6 text-center">
            <p className="text-white/60 text-sm mb-3">Inicia sesión para unirte a la conversación</p>
            <Link href="/login">
              <Button className="bg-codePrimary hover:bg-codePrimary/80 rounded-lg px-5 text-sm">
                Iniciar sesión
              </Button>
            </Link>
          </div>
        )}

        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-3">
            {post.comments.map((c) => {
              const commentAuthor = getAuthor(c.author);
              const commentAuthorId = typeof c.author === "string" ? c.author : c.author._id;
              const isCommentAuthor = user && commentAuthorId === user._id;

              return (
                <div key={c._id} className="bg-surface-card/40 border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-codePrimary to-codeAccent text-white font-bold rounded-full text-xs">
                        {commentAuthor.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {commentAuthor.name} {commentAuthor.lastName}
                      </span>
                      <span className="text-gray-600 text-xs">•</span>
                      <span className="text-xs text-white/30">{formatDate(c.createdAt)}</span>
                    </div>
                    {isCommentAuthor && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-white/30 hover:text-white hover:bg-white/10 rounded-lg"
                          onClick={() => {
                            setEditingComment(c._id!);
                            setEditCommentContent(c.content);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                          onClick={() => setDeletingCommentId(c._id!)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{c.content}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-white/30 text-sm">
            Sé el primero en comentar.
          </div>
        )}
      </div>

      <AlertDialog open={!!deletingCommentId} onOpenChange={(open) => !open && setDeletingCommentId(null)}>
        <AlertDialogContent className="bg-surface-card border border-white/[0.08] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Eliminar comentario?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Esta acción no se puede deshacer. El comentario será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-white/[0.12] text-white/60 hover:text-white hover:bg-white/10 rounded-lg">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
              onClick={() => {
                if (deletingCommentId) handleDeleteComment(deletingCommentId);
                setDeletingCommentId(null);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar comentario</DialogTitle>
            <DialogDescription>Realiza los cambios necesarios en tu comentario.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={editCommentContent}
            onChange={(e) => setEditCommentContent(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingComment(null);
                setEditCommentContent("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditComment}
              disabled={isSubmitting}
              className="bg-codePrimary hover:bg-codePrimary/80"
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostDetail;
