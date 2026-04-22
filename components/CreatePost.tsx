"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createPost } from "@/services/postService";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CreatePost = () => {
  const router = useRouter();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token || !user?._id) {
      toast.error("Debes iniciar sesión para crear un post");
      return;
    }

    try {
      setLoading(true);
      const newPost = await createPost(token, { ...formData, author: user._id });

      if (newPost) {
        toast.success("Post creado exitosamente");
        router.push("/posts");
        router.refresh();
      } else {
        toast.error("Error al crear el post");
      }
    } catch {
      toast.error("Error al crear el post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-surface-card/60 border border-white/[0.08]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Crear nuevo post</CardTitle>
        <CardDescription className="text-white/60">
          Comparte tu conocimiento con la comunidad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/80 text-sm font-medium">Título</Label>
            <Input
              id="title"
              name="title"
              placeholder="Escribe el título de tu post"
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-white/80 text-sm font-medium">URL de la imagen</Label>
            <Input
              id="image"
              name="image"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.image}
              onChange={handleChange}
              required
              className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-white/80 text-sm font-medium">Contenido</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Escribe el contenido de tu post"
              value={formData.content}
              onChange={handleChange}
              required
              className="min-h-[200px] bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-codePrimary text-white hover:bg-codePrimary/80 rounded-lg"
            >
              {loading ? "Creando..." : "Crear post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
