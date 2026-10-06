import PostImage from "@/components/posts/PostImage";
import { cn } from "@/lib/utils";

interface CoverImageProps {
  src: string;
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

const CoverImage = ({ src, alt = "", sizes, priority, className }: CoverImageProps) => (
  <div className={cn("relative overflow-hidden bg-surface-elevated", className)}>
    <PostImage
      src={src}
      alt=""
      aria-hidden
      fill
      sizes="64px"
      className="scale-110 object-cover opacity-60 blur-2xl"
    />
    <PostImage src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-contain" />
  </div>
);

export default CoverImage;
