import { api } from "./axios";
import type { RoomItem } from "../types";

export async function GetRoomsByCinema(cinema_Id: number): Promise<Pick<RoomItem, "room_Id" | "cinema_Id" | "roomName">[]> {
    const response = await api.get<Pick<RoomItem, "room_Id" | "cinema_Id" | "roomName">[]>(`/Rooms/Cinema/${cinema_Id}`);
    return response.data;
}
