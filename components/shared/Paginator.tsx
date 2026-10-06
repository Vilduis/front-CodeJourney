import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginatorProps {
  page: number;
  totalPages: number;
  basePath: string;
  hash?: string;
  compact?: boolean;
}

export default function Paginator({ page, totalPages, basePath, hash = "", compact = false }: PaginatorProps) {
  if (totalPages <= 1) return null;

  const href = (target: number) => `${basePath}${target > 1 ? `?page=${target}` : ""}${hash}`;

  if (compact) {
    return (
      <Pagination>
        <PaginationContent className="w-full justify-between">
          <PaginationItem>
            {page > 1 && <PaginationPrevious href={href(page - 1)} />}
          </PaginationItem>
          <PaginationItem className="text-sm tabular-nums text-white/60">
            Página {page} de {totalPages}
          </PaginationItem>
          <PaginationItem>
            {page < totalPages && <PaginationNext href={href(page + 1)} />}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={href(page - 1)} />
          </PaginationItem>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <PaginationItem key={number}>
            <PaginationLink href={href(number)} isActive={number === page}>
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page < totalPages && (
          <PaginationItem>
            <PaginationNext href={href(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
