import { api } from "./axios";
import type { ShowtimeItem, CreateShowtimeItem } from "../types";
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

export const GetAllShowtimes = async (): Promise<ShowtimeItem[]> => {
    const response = await api.get<ShowtimeItem[]>(`/Showtime`)
    return response.data;
};

export const CreateShowtime = async (showtimeData: CreateShowtimeItem): Promise<ShowtimeItem> => {
    const response = await api.post<ShowtimeItem>(`/Showtime`, showtimeData);
    return response.data;
};

export async function DeleteShowtime(showtime_Id: number): Promise<void> {
    await api.delete(`/Showtime/${showtime_Id}`);
}

export async function UpdateShowtime(showtimeData: CreateShowtimeItem): Promise<CreateShowtimeItem> {
    const response = await api.put("/Showtime", showtimeData);
    return response.data;
}