"use client";

import Listpost from "@/components/Listpost";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const PostsPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-surface-base px-6 py-24">
      <div className="container mx-auto">
      <div className="mb-12 flex justify-between items-center">
       <div className="space-y-2">
       <Badge className="bg-codeAccent/10 text-codeAccent border border-codeAccent/30 hover:bg-codeAccent/20">Posts recientes</Badge>
       <h1 className="text-3xl md:text-4xl font-bold text-white">Posts recientes</h1>
       </div>
       {isAuthenticated && (
       <Link href="/posts/createpost">
         <Button className="bg-codeAccent text-slate-900 hover:bg-codeAccent/90 font-semibold rounded-lg shadow-lg shadow-codeAccent/20">
         <Plus size={20} /> Crear post
        </Button>
       </Link>
       )}
      </div>
      <div className="max-w-7xl mx-auto justify-center items-center">
        <Listpost />
      </div>
      </div>
    </section>
  );
};

export default PostsPage;
