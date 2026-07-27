import { useNavigate } from "react-router-dom";
import type { CinemaItem } from "../types";
import { useState, useMemo } from "react";
import { AutoComplete, Flex, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "../CSS/Styles.css"

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
    <Flex vertical gap={18} style={{width: "100%"}}>
        <AutoComplete
            size="large"
            style={{ width: "100%" }}
            placeholder="Search a cinema..."
            value={query}
            options={options}
            onSearch={(value) => setQuery(value)}
            onChange={(value) => setQuery(value)}
            onSelect={(value, option: any) => {
                setQuery(value);
                setSelectedCinemaId(option.id);
            }}
            filterOption={false}
        />

        <Button
            type="primary"
            icon={<SearchOutlined />}
            size="large"
            block
            disabled={!selectedCinemaId}
            onClick={() => navigate(`/cinema/${selectedCinemaId}`)}
        >
            Select Cinema
        </Button>
    </Flex>
);
}