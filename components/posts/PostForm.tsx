"use client";

import { useEffect, useId, useState } from "react";
import CoverPicker from "@/components/posts/CoverPicker";
import MarkdownEditor from "@/components/shared/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MIN_IMAGE_WIDTH = 800;
const MIN_CONTENT_LENGTH = 2;

const readImageSize = async (file: File) => {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  bitmap.close();
  return { width, height };
};

const helpText = (error: string) => (error ? "text-sm text-red-400" : "text-xs text-white/60");

interface PostFormProps {
  initialValues?: { title: string; content: string; image?: string };
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel?: () => void;
  cancelLabel?: string;
}

const PostForm = ({
  initialValues,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
  cancelLabel = "Cancelar",
}: PostFormProps) => {
  const ids = useId();
  const coverId = `${ids}-cover`;
  const titleId = `${ids}-title`;
  const contentId = `${ids}-content`;
  const initialImage = initialValues?.image ?? "";

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialImage);
  const [imageError, setImageError] = useState("");
  const [contentError, setContentError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!preview.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const resetImage = () => {
    setImage(null);
    setPreview(initialImage);
  };

  const handleImage = async (file: File) => {
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("La imagen no puede superar 5 MB");
      return;
    }

    try {
      const { width, height } = await readImageSize(file);
      if (width < MIN_IMAGE_WIDTH) {
        setImageError(
          `La imagen es muy pequeña (${width} × ${height} px) y se vería borrosa. Usa una de al menos ${MIN_IMAGE_WIDTH} px de ancho.`
        );
        return;
      }
    } catch {
      setImageError("No se pudo leer la imagen. Usa JPG, PNG, WEBP o GIF");
      return;
    }

    setImageError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    if (contentError && value.trim().length >= MIN_CONTENT_LENGTH) setContentError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image && !initialImage) {
      setImageError("Elige una imagen de portada");
      document.getElementById(coverId)?.focus();
      return;
    }
    if (content.trim().length < MIN_CONTENT_LENGTH) {
      setContentError("El contenido debe tener al menos 2 caracteres");
      document.getElementById(contentId)?.focus();
      return;
    }

    const data = new FormData();
    data.append("title", title.trim());
    data.append("content", content.trim());
    if (image) data.append("image", image);

    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <CoverPicker
          inputId={coverId}
          describedBy={`${coverId}-help`}
          preview={preview}
          invalid={!!imageError}
          onSelect={handleImage}
          onReset={image ? resetImage : undefined}
        />
        <p id={`${coverId}-help`} className={helpText(imageError)}>
          {imageError || `JPG, PNG, WEBP o GIF · mínimo ${MIN_IMAGE_WIDTH} px de ancho · máximo 5 MB`}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={titleId} className="text-sm font-medium text-white/70">
          Título
        </Label>
        <textarea
          id={titleId}
          rows={1}
          value={title}
          onChange={(e) => setTitle(e.target.value.replace(/\s*\n\s*/g, " "))}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          placeholder="Lo que aprendí sobre closures"
          minLength={2}
          required
          autoComplete="off"
          className={cn(
            "field-sizing-content w-full resize-none border-0 border-b-2 border-white/10 bg-transparent pb-3 text-2xl leading-tight text-balance font-bold tracking-tight text-white caret-codeAccent",
            "placeholder:font-semibold placeholder:text-white/35 transition-colors focus:border-codePrimary focus:outline-none sm:text-3xl"
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={contentId} className="text-sm font-medium text-white/70">
          Contenido
        </Label>
        <MarkdownEditor
          id={contentId}
          label="Contenido del post"
          value={content}
          onChange={handleContentChange}
          placeholder={"Cuenta qué estabas aprendiendo, en qué te trabaste y cómo lo resolviste.\n\nPuedes usar Markdown: ## títulos, **negrita**, `código` y bloques con ```"}
          invalid={!!contentError}
          describedBy={`${contentId}-help`}
          minHeight="min-h-[320px]"
        />
        <p id={`${contentId}-help`} className={helpText(contentError)}>
          {contentError || "Admite Markdown y bloques de código. Revisa cómo queda en la pestaña Vista previa."}
        </p>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-white/8 pt-6 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="h-11 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          disabled={submitting}
          className="h-11 rounded-lg bg-codePrimary px-6 font-semibold text-white hover:bg-codePrimary/80"
        >
          {submitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
