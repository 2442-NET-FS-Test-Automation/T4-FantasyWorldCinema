import { api } from "./axios";
import type { MovieItem } from "../types";

export async function GetMovies(): Promise<MovieItem[]> {
    const response = await api.get<MovieItem[]>(`/Movies`)
    return response.data;
}

export async function GetAllMovies(): Promise<MovieItem[]> {
    const response = await api.get<MovieItem[]>(`/Movies/All`)
    return response.data;
}