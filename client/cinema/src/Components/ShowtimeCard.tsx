import type { ShowtimeItem } from "../types";
import { useState } from "react";

interface ShowtimeCardProps {
    movie: string;
    showtimes: ShowtimeItem[];
}

export function ShowtimeCard({movie, showtimes}:ShowtimeCardProps) {
    return(
    <div key={movie} className="movie-group">
        <h3>{movie}</h3>

        <div className="times">
            {showtimes.map((showtime) => (
            <button key={showtime.showtime_Id}>
                {showtime.startTime}
            </button>
            ))}
        </div>
    </div>
    )
    
    
}
