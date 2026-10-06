import { api } from "@/lib/api";
import { Post } from "@/types/post";

export const createPost = async (data: FormData) =>
  (await api.post<{ newPost: Post }>("/api/posts/create", data)).data.newPost;

export const updatePost = async (postId: string, data: FormData) =>
  (await api.put<{ updatedPost: Post }>(`/api/posts/${postId}`, data)).data.updatedPost;

export const deletePost = async (postId: string) => {
  await api.delete(`/api/posts/${postId}`);
};
