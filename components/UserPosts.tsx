"use client";

import { useEffect, useState, useCallback } from "react";
import { getPostsByUser, deletePost, updatePost } from "@/services/postService";
import { Post } from "@/types/posts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";

const POSTS_PER_PAGE = 6;

interface EditPostFormData {
  _id: string;
  title: string;
  content: string;
  image: string;
}

const UserPosts = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPost, setEditingPost] = useState<EditPostFormData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const fetchUserPosts = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const userPosts = await getPostsByUser(token);
      if (userPosts) {
        setPosts(userPosts);
      } else {
        setError("No se pudieron cargar los posts");
      }
    } catch {
      setError("Error al cargar los posts");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const handleDelete = async (postId: string) => {
    if (!token) {
      toast.error("Sesión expirada");
      return;
    }
    try {
      const success = await deletePost(token, postId);
      if (success) {
        toast.success("Post eliminado exitosamente");
        fetchUserPosts();
      } else {
        toast.error("Error al eliminar el post");
      }
    } catch {
      toast.error("Error al eliminar el post");
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost({
      _id: post._id!,
      title: post.title,
      content: post.content,
      image: post.image,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPost || !token) return;

    try {
      setIsUpdateLoading(true);

      const postToUpdate = posts.find((p) => p._id === editingPost._id);
      if (!postToUpdate) {
        toast.error("No se encontró el post a editar");
        setIsEditDialogOpen(false);
        return;
      }

      const updatedPost = await updatePost(token, {
        _id: editingPost._id,
        title: editingPost.title.trim(),
        content: editingPost.content.trim(),
        image: editingPost.image.trim(),
      });

      if (updatedPost) {
        toast.success("Post actualizado exitosamente");
        setIsEditDialogOpen(false);
        await fetchUserPosts();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error ||
          (error.response?.status === 403
            ? "No tienes permiso para editar este post"
            : "Error al actualizar el post");
        toast.error(errorMessage);
        if (error.response?.status === 403) {
          setIsEditDialogOpen(false);
          await fetchUserPosts();
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
        setIsEditDialogOpen(false);
      } else {
        toast.error("Error al actualizar el post");
        setIsEditDialogOpen(false);
      }
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingPost((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-t-codeAccent border-b-transparent border-l-transparent border-r-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center text-white/30 py-4">No has publicado ningún post aún.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post) => (
          <Card key={post._id} className="bg-surface-card/60 border border-white/[0.08] hover:border-codePrimary/30 transition-colors duration-200 flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="text-white/30">{formatDate(post.createdAt)}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              {post.image && (
                <div className="relative h-48 mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                </div>
              )}
              <p className="text-white/60 line-clamp-3 text-sm">{post.content}</p>
            </CardContent>

            <CardFooter className="flex justify-between items-center border-t border-white/[0.06] pt-3">
              <div className="flex items-center text-white/30 text-sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>{post.comments?.length || 0} comentarios</span>
              </div>

              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-white/40 hover:text-white hover:bg-white/10 rounded-lg"
                  onClick={() => handleEdit(post)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md bg-surface-card border border-white/[0.08] text-white">
                    <DialogHeader>
                      <DialogTitle className="text-white">¿Eliminar post?</DialogTitle>
                      <DialogDescription className="text-white/60">
                        Esta acción no se puede deshacer. Se eliminará permanentemente el post y todos sus comentarios.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                      <DialogClose asChild>
                        <Button variant="ghost" className="w-full sm:w-auto text-white/60 hover:text-white hover:bg-white/10 rounded-lg">Cancelar</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white rounded-lg"
                          onClick={() => post._id && handleDelete(post._id)}
                        >
                          Eliminar
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[500px] bg-surface-card border border-white/[0.08] text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Editar post</DialogTitle>
            <DialogDescription className="text-white/60">
              Realiza los cambios necesarios en tu post
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white/80 text-sm font-medium">Título</Label>
              <Input
                id="title"
                name="title"
                value={editingPost?.title || ""}
                onChange={handleEditChange}
                className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30"
                placeholder="Título del post"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-white/80 text-sm font-medium">URL de la imagen</Label>
              <Input
                id="image"
                name="image"
                value={editingPost?.image || ""}
                onChange={handleEditChange}
                className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30"
                placeholder="https://ejemplo.com/imagen.jpg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-white/80 text-sm font-medium">Contenido</Label>
              <Textarea
                id="content"
                name="content"
                value={editingPost?.content || ""}
                onChange={handleEditChange}
                className="min-h-[200px] bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30"
                placeholder="Contenido del post"
                required
              />
            </div>

            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditDialogOpen(false)}
                className="w-full sm:w-auto text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isUpdateLoading}
                className="w-full sm:w-auto bg-codePrimary text-white hover:bg-codePrimary/80 rounded-lg"
              >
                {isUpdateLoading ? "Actualizando..." : "Actualizar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <span className="text-white/60 text-sm">Página {currentPage} de {totalPages}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30"
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
