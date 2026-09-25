import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {Book, CreateBookRequest} from "@/lib/books/types";
import {bookService} from "@/lib/books/bookService";


/**
 * Hook para obtener la lista de libros
 */
export function useBooks() {
    return useQuery<Book[]>({
        queryKey: ["books"],
        queryFn: () => bookService.getAll(),
        // Opcional: staleTime: 1000 * 60 * 5, // Cachea por 5 minutos
    });
}

/**
 * Hook para crear un nuevo libro
 */
export function useCreateBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBookRequest) => bookService.create(data),
        onSuccess: () => {
            // Invalida la caché para que la UI se actualice automáticamente
            // con el nuevo libro recién creado.
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
}

export function useUpdateBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateBookRequest> }) =>
            bookService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
}