
type TimeString = `${number}:${number}:${number}`;

export interface CinemaItem {
    cinema_Id: number;
    cinemaName: string;
    cinemaCity: string;
}

export interface RoomItem {
    room_Id: number;
    cinema_Id: number;
    roomName: string;
    capacity: number;
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
    showtime_Id?: number;
    movie_Id: number;
    cinema_Id?: number;
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

// Reports
export interface MovieRevenueDto {
    movieTitle: string;
    totalRevenue: number;
    ticketsSold: number;
}

export interface CinemaRevenueDto {
    cinemaId: number;
    cinemaName: string;
    totalRevenue: number;
    totalTransactions: number;
}

export interface OccupancyRateDto {
    movieTitle: string;
    cinemaName: string;
    showDate: string;
    totalCapacity: number;
    soldSeats: number;
    occupancyPercentage: number;
}

export interface TransactionStatusSummaryDto {
    status: string;
    count: number;
    totalAmountInvolved: number;
}