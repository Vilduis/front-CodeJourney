import { api } from "@/lib/api";
import { Comment } from "@/types/comment";

export const MIN_COMMENT_LENGTH = 2;

export const createComment = async (postId: string, content: string) =>
  (await api.post<{ newComment: Comment }>(`/api/comments/create/${postId}`, { content })).data.newComment;

export const updateComment = async (commentId: string, content: string) =>
  (await api.put<{ updatedComment: Comment }>(`/api/comments/${commentId}`, { content })).data.updatedComment;

export const deleteComment = async (commentId: string) => {
  await api.delete(`/api/comments/${commentId}`);
};
