import { useNavigate } from "react-router-dom";
import type { CinemaItem } from "../types";
import { useState, useMemo } from "react";
import { AutoComplete, Flex, Input } from "antd";

interface CinemaSearchBarProps {
    cinemas: CinemaItem[];
}



export function CinemaSearchBar ({cinemas }: CinemaSearchBarProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);

    const options = useMemo(() => {
        return cinemas
            .filter(cinema =>
                cinema.cinemaName
                    ?.toLowerCase()
                    .includes(query.toLowerCase())
            )
            .map(cinema => ({
                value: cinema.cinemaName,
                label: cinema.cinemaName,
                id: cinema.cinema_Id
            }));
    }, [cinemas, query]);


    return (
        <div className="Cinema-Search-Container">
            <Flex gap={0}>
            <Flex vertical gap={12} >
            <AutoComplete className="Cinema-Search-Input"
                placeholder="Your cinema"
                value={query}
                options={options}
                onSearch={(value) => setQuery(value)}
                onChange={(value) => setQuery(value)}
                onSelect={(value, option: any) => {
                    setQuery(value);
                    setSelectedCinemaId(option.id);
                }}
                filterOption={false} />
            </Flex>
            <button type="button" className="Cinema-Search-Button"
            onClick={() => navigate(`/Showtimes/${selectedCinemaId}`)}
            >Seleccionar</button>
            </Flex>
            
        </div>
    )
}