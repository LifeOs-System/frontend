import api from "@/lib/axios";
import {Book, CreateBookRequest} from "@/lib/books/types";

export const bookService = {
    /**
     * Obtiene todos los libros ordenados por 'order'
     */
    getAll: async (): Promise<Book[]> => {
        const response = await api.get<Book[]>("/books");
        return response.data;
    },

    /**
     * Crea un nuevo libro en la base de datos
     */
    create: async (data: CreateBookRequest): Promise<void> => {
        await api.post("/book", data);
    },

    update: async (id: string, data: Partial<CreateBookRequest>): Promise<void> => {
        await api.patch(`/books/${id}`, data);
    }
};