"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type PostImageProps = Omit<ImageProps, "src"> & { src: string };

const isCloudinary = (src: string) => src.startsWith("https://res.cloudinary.com/");

const PostImage = ({ src, alt, className, ...props }: PostImageProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-white/5 text-white/60",
          props.fill ? "absolute inset-0" : "h-48 w-full"
        )}
      >
        <ImageOff className="h-8 w-8" aria-label="Imagen no disponible" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      unoptimized={!isCloudinary(src)}
      onError={() => setFailedSrc(src)}
      {...props}
    />
  );
};

export default PostImage;
