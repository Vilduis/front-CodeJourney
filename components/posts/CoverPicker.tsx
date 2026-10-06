"use client";

import { useState } from "react";
import { ImagePlus, RefreshCw, X } from "lucide-react";
import CoverImage from "@/components/posts/CoverImage";
import { cn } from "@/lib/utils";

interface CoverPickerProps {
  inputId: string;
  describedBy: string;
  preview: string;
  invalid: boolean;
  onSelect: (file: File) => void;
  onReset?: () => void;
}

const overlayButton =
  "inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-black/60 px-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80";

const CoverPicker = ({ inputId, describedBy, preview, invalid, onSelect, onReset }: CoverPickerProps) => {
  const [dragging, setDragging] = useState(false);

  const takeFirst = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onSelect(file);
  };

  const dropHandlers = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      takeFirst(e.dataTransfer.files);
    },
  };

  const input = (
    <input
      id={inputId}
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif"
      className="sr-only"
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      onChange={(e) => {
        takeFirst(e.target.files);
        e.target.value = "";
      }}
    />
  );

  const focusRing =
    "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-codeAccent";

  if (preview) {
    return (
      <div
        {...dropHandlers}
        className={cn(
          "relative overflow-hidden rounded-xl border transition-colors",
          dragging ? "border-codePrimary" : "border-white/8",
          focusRing
        )}
      >
        <CoverImage
          src={preview}
          alt="Vista previa de la portada"
          sizes="(min-width: 1280px) 860px, (min-width: 1024px) calc(100vw - 480px), 100vw"
          className="h-56 w-full sm:h-72"
        />
        <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-linear-to-t from-black/70 to-transparent p-3 pt-12">
          {onReset && (
            <button type="button" onClick={onReset} className={overlayButton}>
              <X size={16} aria-hidden />
              Quitar
            </button>
          )}
          <label htmlFor={inputId} className={overlayButton}>
            <RefreshCw size={16} aria-hidden />
            Cambiar imagen
          </label>
        </div>
        {input}
      </div>
    );
  }

  return (
    <label
      {...dropHandlers}
      htmlFor={inputId}
      className={cn(
        "flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 text-center transition-colors sm:h-56",
        invalid
          ? "border-red-500/60 bg-red-500/5"
          : dragging
            ? "border-codePrimary bg-codePrimary/10"
            : "border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5",
        focusRing
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/8 text-white/80">
        <ImagePlus size={22} aria-hidden />
      </span>
      <span className="font-semibold text-white">Añade una imagen de portada</span>
      <span className="text-sm text-white/65">
        Arrástrala aquí o <span className="text-codeAccent underline underline-offset-4">elige un archivo</span>
      </span>
      {input}
    </label>
  );
};

export default CoverPicker;
