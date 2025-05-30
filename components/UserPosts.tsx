"use client";

import { useEffect, useState } from "react";
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { AxiosError } from "axios";

const POSTS_PER_PAGE = 6;

interface EditPostFormData {
  _id: string;
  title: string;
  content: string;
  image: string;
}

const UserPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPost, setEditingPost] = useState<EditPostFormData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró el token de autenticación");
        return;
      }

      const userPosts = await getPostsByUser(token);
      if (userPosts) {
        setPosts(userPosts);
      } else {
        setError("No se pudieron cargar los posts");
      }
    } catch (err) {
      console.error("Error fetching user posts:", err);
      setError("Error al cargar los posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No se encontró el token de autenticación");
        return;
      }

      const success = await deletePost(token, postId);
      if (success) {
        toast.success("Post eliminado exitosamente");
        fetchUserPosts();
      } else {
        toast.error("Error al eliminar el post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
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
    if (!editingPost) return;

    try {
      setIsUpdateLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Sesión expirada. Por favor, vuelve a iniciar sesión.");
        setIsEditDialogOpen(false);
        return;
      }

      // Verificamos que el post exista en la lista actual
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
        await fetchUserPosts(); // Recargar la lista
      }
    } catch (error) {
      console.error("Error updating post:", error);
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

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingPost((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Cálculos para la paginación
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-t-codePrimary border-b-transparent border-l-transparent border-r-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No has publicado ningún post aún.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post) => (
          <Card
            key={post._id}
            className="bg-gradient-to-br from-codePrimary/50 to-codeSecondary/50"
          >
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white line-clamp-2">
                {post.title}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {new Date(post.createdAt || "").toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </CardDescription>
            </CardHeader>

            <CardContent>
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
              <p className="text-white/90 line-clamp-3">{post.content}</p>
            </CardContent>

            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center text-white/70">
                <MessageSquare className="h-5 w-5 mr-2" />
                <span>{post.comments?.length || 0} comentarios</span>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={() => handleEdit(post)}
                >
                  <Pencil className="h-5 w-5" />
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>¿Estás seguro?</DialogTitle>
                      <DialogDescription>
                        Esta acción no se puede deshacer. Se eliminará
                        permanentemente el post y todos sus comentarios.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="ghost">Cancelar</Button>
                      </DialogClose>

                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (post._id) {
                            handleDelete(post._id);
                            const dialogTrigger =
                              document.querySelector('[role="dialog"]');
                            if (dialogTrigger) {
                              (dialogTrigger as HTMLElement).click();
                            }
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Dialog de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-codePrimary/90 to-codeSecondary/90">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Editar post
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Realiza los cambios necesarios en tu post
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Título
              </Label>
              <Input
                id="title"
                name="title"
                value={editingPost?.title || ""}
                onChange={handleEditChange}
                className="bg-white/10 text-white placeholder:text-gray-400"
                placeholder="Título del post"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-white">
                URL de la imagen
              </Label>
              <Input
                id="image"
                name="image"
                value={editingPost?.image || ""}
                onChange={handleEditChange}
                className="bg-white/10 text-white placeholder:text-gray-400"
                placeholder="https://ejemplo.com/imagen.jpg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-white">
                Contenido
              </Label>
              <Textarea
                id="content"
                name="content"
                value={editingPost?.content || ""}
                onChange={handleEditChange}
                className="min-h-[200px] bg-white/10 text-white placeholder:text-gray-400"
                placeholder="Contenido del post"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditDialogOpen(false)}
                className="text-white hover:bg-white/10"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isUpdateLoading}
                className="bg-codePrimary text-white hover:bg-codePrimary/80"
              >
                {isUpdateLoading ? "Actualizando..." : "Actualizar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <span className="text-white">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="text-white hover:bg-white/10"
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
