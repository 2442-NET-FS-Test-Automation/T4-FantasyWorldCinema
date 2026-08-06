import { api } from "./axios";
import type { CinemaItem } from "../types";

export async function getCinemas (): Promise<CinemaItem[]> {
    const response = await api.get<CinemaItem[]>("/Cinema")
    return response.data;
}

export async function getCinemasByMovie (movieId?:number): Promise<CinemaItem[]> {
    const response = await api.get<CinemaItem[]>(`/Cinema/${movieId}`);
    return response.data;
}

export const getCinemasWithUsed = async (): Promise<CinemaItem[]> => {
    const response = await api.get("/Cinema/cinemas-withUsed/");
    if (response.status !== 200) throw new Error("Error fetching cinemas");
    return response.data;
}