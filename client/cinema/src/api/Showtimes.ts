import { api } from "./axios";
import type { ShowtimeItem } from "../types";

export async function GetShowtimesByCinema(Cinema_Id: number): Promise<ShowtimeItem[]> {
    const response = await api.get<ShowtimeItem[]>(`/Showtime/Cinema-${Cinema_Id}`)
    return response.data;
}