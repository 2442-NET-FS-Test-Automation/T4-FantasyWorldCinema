import { Navigate, useNavigate } from "react-router-dom";
import type { CinemaItem } from "../types";
import { useState } from "react";

interface CinemaSearchBarProps {
    cinemas: CinemaItem[];
}



export function CinemaSearchBar ({cinemas }: CinemaSearchBarProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Filtering values
    const filteredItems = cinemas.filter((item) => 
        item.cinemaName?.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="Cinema-Search-Container">
            <input type="text" className="Cinema-Search-Input"
            placeholder="Your cinema"
            value={query}
            onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);}}
                onFocus={() => setIsOpen(true)} />
            {isOpen && filteredItems.length > 0 && (
                <ul className="Cinema-Search-Options">
                    
                    {filteredItems.map((item) => (
                        <li className="Cinema-Search-Option-Row"
                        key={item.cinema_Id}
                        onClick={() => {
                            setQuery(item.cinemaName);
                            setIsOpen(false);
                            setSelectedCinemaId(item.cinema_Id);
                        }}>
                            {item.cinemaName}
                        </li>
                    ))}
                </ul>
            )}
            <button type="button" className="Cinema-Search-Button"
            onClick={() => navigate(`/Showtimes/${selectedCinemaId}`)}
            >Seleccionar</button>
        </div>
    )
}