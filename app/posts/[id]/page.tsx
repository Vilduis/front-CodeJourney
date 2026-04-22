"use client";

import PostDetail from "@/components/PostDetail";
import { use } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const PostPage = ({ params }: PageProps) => {
  const { id } = use(params);
  
  return (
    <section className="bg-surface-base min-h-screen py-24">
      <PostDetail postId={id} />
    </section>
  );
};

export default PostPage;