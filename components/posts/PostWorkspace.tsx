"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { revalidatePosts } from "@/app/actions";
import { createPost, updatePost } from "@/services/postService";
import { getErrorMessage } from "@/lib/api";
import { Post } from "@/types/post";
import PostForm from "@/components/posts/PostForm";
import UserPosts from "@/components/posts/UserPosts";

const PostWorkspace = ({ posts, page }: { posts: Post[]; page: number }) => {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const focusComposer = () =>
    requestAnimationFrame(() => {
      headingRef.current?.scrollIntoView({ block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });

  const startEditing = (post: Post) => {
    setEditingPost(post);
    focusComposer();
  };

  const stopEditing = () => {
    setEditingPost(null);
    focusComposer();
  };

  const handleCreate = async (data: FormData) => {
    try {
      const post = await createPost(data);
      toast.success("Post publicado");
      await revalidatePosts();
      router.push(`/posts/${post._id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo publicar el post"));
    }
  };

  const handleUpdate = async (data: FormData) => {
    if (!editingPost) return;
    try {
      await updatePost(editingPost._id, data);
      toast.success("Cambios guardados");
      stopEditing();
      await revalidatePosts();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudieron guardar los cambios"));
    }
  };

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-16">
      <section aria-labelledby="composer-title" className="min-w-0">
        <header className="mb-8 space-y-2">
          <h1
            id="composer-title"
            ref={headingRef}
            tabIndex={-1}
            className="scroll-mt-28 text-3xl font-bold tracking-tight text-balance text-white outline-none md:text-4xl"
          >
            {editingPost ? "Editar entrada" : "Escribir un post"}
          </h1>
          <p className="max-w-[60ch] text-white/70">
            {editingPost ? (
              <>
                Estás editando «{editingPost.title}». Si no eliges otra imagen, se mantiene la actual.
              </>
            ) : (
              "Cuenta lo que aprendiste, el problema que resolviste o lo que estás intentando entender."
            )}
          </p>
        </header>

        <PostForm
          key={editingPost?._id ?? "new"}
          initialValues={editingPost ?? undefined}
          submitLabel={editingPost ? "Guardar cambios" : "Publicar post"}
          submittingLabel={editingPost ? "Guardando..." : "Publicando..."}
          onSubmit={editingPost ? handleUpdate : handleCreate}
          onCancel={editingPost ? stopEditing : undefined}
          cancelLabel="Descartar cambios"
        />
      </section>

      <UserPosts
        posts={posts}
        page={page}
        editingId={editingPost?._id}
        onEdit={startEditing}
        onDeleted={(postId) => {
          if (editingPost?._id === postId) setEditingPost(null);
        }}
      />
    </div>
  );
};

export default PostWorkspace;
