import { useState, useEffect, useMemo } from "react";
import type { ShowtimeItem, FetchState } from "../types";
import { GetShowtimesByCinema } from "../api/Showtimes";
import { ShowtimeCard } from "../Components/ShowtimeCard";
import { useParams } from "react-router-dom";

interface Movies {
    Movie: string;
    Date: Date;
    Times: Date[];
}


export function DisplayShowtimes() {
    const { CinemaId } = useParams<{ CinemaId: string }>();
    const Cinema_Id = Number(CinemaId);

    const [items, setItems] = useState<ShowtimeItem[]>([]);
    // const [groupedItems, setGroupedItems] = useState<Movies | null>(null);
    const [fState, setFState] = useState<FetchState>("idle");
    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    // getting Showtimes from API
    useEffect(() => {

        let active = true;
        setFState("loading");
        
        GetShowtimesByCinema(Cinema_Id).then((data) =>{
            if(!active) return;
            setItems(data);
            setFState("loaded");
        }).catch(() => {
            if(active) setFState("failed");
        })


        return () => {
            active = false;
        }
            
        
    }, [])

    // Filter showtimes by date and group it by movie
    const groupedShowtimes = useMemo(() => {
        const filtered = items.filter((showtime) => {
            const date = new Date(showtime.showDate).toISOString().split("T")[0];
            return date === selectedDate;
        });

        return filtered.reduce<Record<string, ShowtimeItem[]>>((acc, showtime) => {
            if (!acc[showtime.movie]) {
            acc[showtime.movie] = [];
            }

            acc[showtime.movie].push(showtime);
            return acc;
        }, {});
    }, [items, selectedDate]);

    console.log(items);
    console.log(groupedShowtimes);

    return (
            <section className="Showtime-section">
                <h2 className="Showtime-section-title"> Choose your movie</h2>
                <input type="date" className="Showtimes-date-selector"
                    value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}/>
                {fState !== "loaded" ? <p>Loading...</p> :
                <div className="Showtimes-container">
                    {Object.entries(groupedShowtimes).map(([movie, showtimes]) => (
                        <ShowtimeCard key={movie} movie={movie} showtimes={showtimes} />
                        ))}
                </div>}
                
    
            </section>
        )
}