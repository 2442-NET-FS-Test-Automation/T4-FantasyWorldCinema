import { api } from "./axios";
import type { MovieItem, CreateMovieItem } from "../types";

export async function GetMovies(): Promise<MovieItem[]> {
    const response = await api.get<MovieItem[]>(`/Movies`)
    return response.data;
}

export async function GetAllMovies(): Promise<MovieItem[]> {
    const response = await api.get<MovieItem[]>(`/Movies/All`)
    return response.data;
}

export async function CreateMovie(movieData: CreateMovieItem): Promise<CreateMovieItem> {
    const response = await api.post(`/Movies`, movieData);
    return response.data;
}

export async function DeleteMovie(movie_Id: number): Promise<void> {
    await api.delete(`/Movies`, {
        params: { movie_Id }
    });
}

export async function UpdateMovie(movieData: MovieItem): Promise<MovieItem> {
    const response = await api.put(`/Movies`, movieData);
    return response.data;
}