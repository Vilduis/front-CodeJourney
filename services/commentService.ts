import { Comment } from "../types/comment";
import axios from "axios";
import config from "@/lib/config";

const API_URL = `${config.apiUrl}${config.api.comments}`;

export const getComments = async (): Promise<Comment[] | null> => {
    try {
        const response = await axios.get(API_URL);
        return response.data.comments;
    } catch {
        return null;
    }
};

export const createComment = async (
    token: string,
    postId: string,
    comment: Partial<Comment>
): Promise<Comment | null> => {
    try {
        const response = await axios.post(
            `${API_URL}/create/${postId}`,
            { content: comment.content },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.newComment;
    } catch {
        return null;
    }
};

export const getCommentsByPostId = async (postId: string): Promise<Comment[] | null> => {
    try {
        const response = await axios.get(`${API_URL}/post/${postId}`);
        return response.data.comments;
    } catch {
        return null;
    }
};

export const getComment = async (commentId: string): Promise<Comment | null> => {
    try {
        const response = await axios.get(`${API_URL}/${commentId}`);
        return response.data as Comment;
    } catch {
        return null;
    }
};

export const updateComment = async (
    token: string,
    commentId: string,
    comment: Partial<Comment>
): Promise<Comment | null> => {
    try {
        const response = await axios.put(`${API_URL}/${commentId}`, comment, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data as Comment;
    } catch {
        return null;
    }
};

export const deleteComment = async (token: string, commentId: string): Promise<boolean> => {
    try {
        await axios.delete(`${API_URL}/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return true;
    } catch {
        return false;
    }
};
