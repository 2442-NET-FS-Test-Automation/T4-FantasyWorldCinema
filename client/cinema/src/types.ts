
type TimeString = `${number}:${number}:${number}`;

export interface CinemaItem {
    cinema_Id: number;
    cinemaName: string;
    cinemaCity: string;
}

export interface ShowtimeItem {
    showtime_Id: number;
    movie: string;
    room: string;
    room_Id: number;
    showDate: Date;
    startTime: TimeString;
    endTime: TimeString;
    price: number;
}

export type FetchState = "idle" | "loading" | "loaded" | "failed";