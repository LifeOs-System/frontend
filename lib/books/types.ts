export interface Book {
    id: string;
    title: string;
    author: string;
    isRead: boolean;
    readDate: string | null;
    createdAt: string;
    summaryMarkdown: string | null;
    rating: number | null;
    order: number;
}

export interface CreateBookRequest {
    title: string;
    author: string;
    isRead: boolean;
    readDate: string | null;
    summaryMarkdown: string | null;
    rating: number | null;
}