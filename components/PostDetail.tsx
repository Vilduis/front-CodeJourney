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
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-t-codePrimary border-b-transparent border-l-transparent border-r-transparent"></div>
      </div>
    );
  }

  if (error || !post) {
    return <div className="text-center text-red-500">{error || "Post no encontrado"}</div>;
  }

  const author = getAuthor(post.author);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 text-white hover:bg-white/10 hover:text-white"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a posts
      </Button>

      <Card className="bg-gradient-to-br from-codePrimary/50 to-codeSecondary/50">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white font-semibold rounded-full">
              {author.name.charAt(0) || "U"}
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {author.name} {author.lastName}
              </div>
              <div className="text-sm text-gray-300">{formatDate(post.createdAt)}</div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {post.image && (
            <div className="mb-6">
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={400}
                className="rounded-lg object-cover w-full"
                unoptimized
              />
            </div>
          )}
          <CardTitle className="text-2xl font-bold text-white mb-4">{post.title}</CardTitle>
          <CardDescription className="text-md text-white/90 whitespace-pre-wrap">
            {post.content}
          </CardDescription>
        </CardContent>

        <CardFooter>
          <div className="w-full space-y-6">
            <div className="flex items-center text-white/70 text-sm">
              <MessageSquare className="mr-2 h-5 w-5" />
              <span>{post.comments?.length || 0} comentarios</span>
            </div>

            {user ? (
              <div className="space-y-4">
                <Textarea
                  placeholder="Escribe tu comentario..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-white/10 text-white placeholder:text-white/50"
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={isSubmitting}
                  className="bg-codePrimary hover:bg-codeSecondary"
                >
                  {isSubmitting ? "Enviando..." : "Comentar"}
                </Button>
              </div>
            ) : (
              <div className="text-center text-white/70 py-4">
                <Link href="/login" className="bg-codePrimary hover:bg-codePrimary/80 px-2 py-2 rounded-md">
                  Inicia sesión
                </Link>{" "}
                para comentar
              </div>
            )}

            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((c) => {
                  const commentAuthor = getAuthor(c.author);
                  const commentAuthorId = typeof c.author === "string" ? c.author : c.author._id;
                  const isCommentAuthor = user && commentAuthorId === user._id;

                  return (
                    <div key={c._id} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                        <div className="flex items-center">
                          <span className="font-semibold">
                            {commentAuthor.name} {commentAuthor.lastName}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(c.createdAt)}</span>
                        </div>
                        {isCommentAuthor && (
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/10"
                              onClick={() => {
                                setEditingComment(c._id!);
                                setEditCommentContent(c.content);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/10"
                              onClick={() => handleDeleteComment(c._id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-white/90">{c.content}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-white/50 text-center">No hay comentarios aún.</p>
            )}
          </div>
        </CardFooter>
      </Card>

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
              className="bg-codePrimary hover:bg-codeSecondary"
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
