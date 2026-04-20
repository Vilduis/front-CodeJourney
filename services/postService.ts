import { Post } from "../types/posts";
import axios from "axios";
import config from "@/lib/config";

const API_URL = `${config.apiUrl}${config.api.posts}`;

export const getPosts = async (): Promise<Post[] | null> => {
    try {
        const response = await axios.get(API_URL);
        return response.data.posts;
    } catch {
        return null;
    }
};

export const getPost = async (postId: string): Promise<Post | null> => {
    try {
        const response = await axios.get(`${API_URL}/${postId}`);
        return response.data.post;
    } catch {
        return null;
    }
};

export const getPostsByUser = async (token: string): Promise<Post[] | null> => {
    try {
        const response = await axios.get(`${API_URL}/user/posts`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.posts as Post[];
    } catch {
        return null;
    }
};

export const createPost = async (token: string, post: Partial<Post>): Promise<Post | null> => {
    try {
        const response = await axios.post(`${API_URL}/create`, post, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data as Post;
    } catch {
        return null;
    }
};

export const updatePost = async (token: string, post: Partial<Post>): Promise<Post | null> => {
    if (!post._id || !token) throw new Error("Se requiere ID del post y token");

    try {
        const { data } = await axios.put(
            `${API_URL}/${post._id}`,
            { title: post.title, content: post.content, image: post.image },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return data.updatedPost;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            throw new Error("No tienes permiso para editar este post");
        }
        throw error;
    }
};

export const deletePost = async (token: string, postId: string): Promise<boolean> => {
    try {
        await axios.delete(`${API_URL}/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return true;
    } catch {
        return false;
    }
};
