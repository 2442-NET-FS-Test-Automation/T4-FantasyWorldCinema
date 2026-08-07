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

export const getCinemasWithUsed = async (startDate: string, endDate: string): Promise<CinemaItem[]> => {
    const response = await api.get(`/Cinema/cinemas-withUsed?startDate=${startDate}&endDate=${endDate}`);
    if (response.status !== 200) throw new Error("Error fetching cinemas");
    return response.data;
}

export const getCinemasWithActiveShowtimes = async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get(`/Cinema/cinemas-withActiveShowtimes?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
}