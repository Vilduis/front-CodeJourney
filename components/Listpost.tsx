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
import { formatDate, getAuthor } from "@/lib/utils";

const PostCard = ({ post }: { post: Post }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const author = getAuthor(post.author);

  return (
    <>
      <Card className="bg-surface-card/60 backdrop-blur-sm border border-white/[0.08] hover:border-codePrimary/30 hover:bg-surface-card/80 hover:shadow-xl hover:shadow-black/40 hover:scale-[1.02] transition-all duration-300 overflow-hidden flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-codePrimary to-codeAccent text-white font-bold rounded-full text-sm">
                {author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {author.name} {author.lastName}
                </div>
                <div className="text-xs text-white/30">{formatDate(post.createdAt)}</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          {post.image && (
            <div className="relative w-full h-[180px] mb-4">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
            </div>
          )}
          <CardTitle className="text-base font-bold text-white line-clamp-2 mb-2">{post.title}</CardTitle>
          <CardDescription className="text-white/60 text-sm line-clamp-3 leading-relaxed">{post.content}</CardDescription>
        </CardContent>

        <CardFooter className="border-t border-white/[0.06] pt-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center text-white/30 text-xs gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{post.comments?.length || 0} comentarios</span>
            </div>
            <div className="flex gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-codePrimary text-white hover:bg-codePrimary/80 text-xs rounded-lg transition-all duration-200">
                    <Eye className="h-3.5 w-3.5 sm:mr-1.5" />
                    <span className="hidden sm:inline">Ver contenido</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-surface-elevated border border-white/[0.08] text-white max-w-2xl">
                  <DialogHeader className="border-b border-white/[0.08] pb-4">
                    <DialogTitle className="text-xl font-bold text-white">{post.title}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 text-white/60 text-sm mt-1">
                      <span className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-codePrimary to-codeAccent text-white font-bold rounded-full text-xs">
                        {author.name.charAt(0).toUpperCase()}
                      </span>
                      {author.name} {author.lastName} • {formatDate(post.createdAt)}
                    </DialogDescription>
                  </DialogHeader>
                  {post.image && (
                    <div className="relative h-[220px] w-full">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="text-sm text-white/60 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto pr-1">
                    {post.content}
                  </div>
                  <div className="border-t border-white/[0.08] pt-3 flex justify-end">
                    <Link href={`/posts/${post._id}`}>
                      <Button size="sm" className="bg-codeAccent text-slate-900 hover:bg-codeAccent/90 rounded-lg text-xs font-semibold">
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                        Ver comentarios
                      </Button>
                    </Link>
                  </div>
                </DialogContent>
              </Dialog>
              <Link href={`/posts/${post._id}`}>
                <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 text-xs rounded-lg">
                  <MessageSquare className="h-3.5 w-3.5 sm:mr-1.5" />
                  <span className="hidden sm:inline">Comentar</span>
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    const fetchPosts = async () => {
      const postData = await getPosts();
      if (postData) setPosts(postData);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-t-codeAccent border-b-transparent border-l-transparent border-r-transparent"></div>
      </div>
    );
  }

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const currentPosts = posts.slice(indexOfLastPost - postsPerPage, indexOfLastPost);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
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
