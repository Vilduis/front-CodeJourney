export type Author = string | {
    _id?: string;
    name: string;
    lastName: string;
};

export interface Comment {
    _id: string;
    content: string;
    author: Author;
    post: string;
    createdAt?: string;
}
