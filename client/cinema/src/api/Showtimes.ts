import { api } from "./axios";
import type { ShowtimeItem } from "../types";
import type { SeatItem } from "../types";

export async function GetShowtimesByCinema(Cinema_Id: number): Promise<ShowtimeItem[]> {
    const response = await api.get<ShowtimeItem[]>(`/Showtime/Cinema-${Cinema_Id}`)
    return response.data;
}

export const GetShowtimeById = async (showtimeId: number): Promise<ShowtimeItem> => {
    const response = await api.get<ShowtimeItem>(`/Showtime/${showtimeId}`);
    return response.data;
};

export const GetSeatsByShowtimeId = async (showtimeId: number, roomId: number): Promise<SeatItem[]> => {
    const response = await api.get<SeatItem[]>(`/Seats/${showtimeId}?Room_id=${roomId}`);
    return response.data;
};