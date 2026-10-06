import { Author, Comment } from "./comment";

export interface Post {
    _id: string;
    image: string;
    title: string;
    content: string;
    author: Author;
    comments?: Comment[];
    createdAt?: string;
}
