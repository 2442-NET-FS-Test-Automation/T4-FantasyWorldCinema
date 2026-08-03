
type TimeString = `${number}:${number}:${number}`;

export interface CinemaItem {
    cinema_Id: number;
    cinemaName: string;
    cinemaCity: string;
}

export interface ShowtimeItem {
    showtime_Id: number;
    movie: string;
    poster: string;
    rating: string;
    room: string;
    room_Id: number;
    showDate: string;
    startTime: TimeString;
    endTime: TimeString;
    price: number;
}

export interface CreateShowtimeItem {
    movie_Id: number;
    poster: string;
    rating: string;
    room_Id: number;
    showDate: string;
    startTime: string;
    endTime: string;
    price: number;
}

export interface MovieItem {
    movie_Id: number;
    title: string;
    genre: string;
    rating: string,
    synopsis: string,
    durationMinutes: number;
    poster: string;
}

export interface CreateMovieItem {
    title: string;
    genre: string;
    rating: string,
    synopsis: string,
    durationMinutes: number;
    poster: string;
}


export type FetchState = "idle" | "loading" | "loaded" | "failed";

export interface SeatItem {
  seat_Id: number;
  row: string;
  number: string;
  isFree: number; 
}

export interface CreateTransactionItem {
    showtimeId: number;
    seatIds: number[];
}

export interface TransactionItem {
    transactionId: number;
    purchaseDate: string;
    totalAmount: number;
    status: string;
    movieTitle: string;
    showDate: string;
    startTime: TimeString;
    endTime: TimeString;
    cinemaName: string;
    roomName: string;
    purchasedSeats: string[]
    poster: string;
}