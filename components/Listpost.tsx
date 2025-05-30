"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getPosts } from "@/services/postService";
import { Post } from "../types/posts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Eye } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Componente para cada publicación
const PostCard = ({ post }: { post: Post }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const author =
    typeof post.author === "string"
      ? { name: post.author, lastName: "" }
      : post.author;

  return (
    <>
      <Card className="bg-gradient-to-br from-codePrimary/50 to-codeSecondary/50 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <CardHeader>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              {/* Inicial del autor */}
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white font-semibold rounded-full">
                {author.name.charAt(0)}
              </div>
              <div className="text-sm text-white font-bold">
                {author.name} {author.lastName}
              </div>
            </div>
            {/* Fecha de creación formateada */}
            <div className="text-sm text-gray-400 mt-1">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Fecha desconocida"}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Imagen del post (se muestra primero) */}
          {post.image && (
            <div className="relative w-full h-[200px] mb-4">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
            </div>
          )}
          {/* Título y descripción */}
          <CardTitle className="text-lg font-bold text-white line-clamp-2">
            {post.title}
          </CardTitle>
          <CardDescription className="mt-2 text-white line-clamp-3">
            {post.content}
          </CardDescription>
        </CardContent>

        <CardFooter>
          <div className="flex items-center justify-between w-full mt-2">
            <div className="flex items-center text-white/70 text-sm">
              <MessageSquare className="mr-1 h-4 w-4" />
              <span>{post.comments?.length || 0}</span>
            </div>
            <div className="flex gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 hover:text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver contenido
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-codePrimary/90 to-codeSecondary/90 border-none text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      {post.title}
                    </DialogTitle>
                    <DialogDescription className="text-white/70">
                      Por {author.name} {author.lastName} •{" "}
                      {new Date(post.createdAt || "").toLocaleDateString(
                        "es-ES"
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  {post.image && (
                    <div className="relative h-[200px] w-full mb-4">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="text-sm text-white whitespace-pre-wrap">
                    {post.content}
                  </div>
                </DialogContent>
              </Dialog>
              <Link href={`/posts/${post._id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comentar
                </Button>
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default function Listpost() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postData = await getPosts();
        setPosts(postData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  // Spinner de carga
  if (!posts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-t-codePrimary border-b-transparent border-l-transparent border-r-transparent"></div>
      </div>
    );
  }

  // Calcular el total de páginas
  const totalPages = Math.ceil((posts?.length || 0) / postsPerPage);

  // Obtener los posts de la página actual
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Generar array de números de página
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <section className="mt-4">
      {posts.length === 0 ? (
        <p className="text-gray-600">No hay posts disponibles.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 mb-8">
            {currentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {pageNumbers.map((number) => (
                    <PaginationItem key={number}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === number}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(number);
                        }}
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </section>
  );
}
