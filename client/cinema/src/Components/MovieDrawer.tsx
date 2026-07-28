import { Drawer, Typography, Divider, Flex, Button } from "antd";
import type { CinemaItem, FetchState, MovieItem } from "../types";
import { useEffect, useState } from "react";
import { getCinemasByMovie } from "../api/Cinema";
import { useNavigate } from "react-router";

interface MovieDrawerProps {
    movie: MovieItem | null;
    open: boolean;
    onClose: () => void;
}

const { Title, Paragraph } = Typography;

export function MovieDrawer({movie, open,  onClose}: MovieDrawerProps) {
    const navigate = useNavigate();

    const [items, setItems] = useState<CinemaItem[]>([]);
    const [fState, setFState] = useState<FetchState>("idle");


    useEffect(() => {
         if (!open || !movie) return;

         let active = true;
            setFState("loading");
            getCinemasByMovie(movie?.movie_Id).then((data) => {
                if (!active) return;
                setItems(data);
                setFState("loaded");
            }).catch(() => {
                if (active) setFState("failed");
            });
            return () => { active = false; };
    }, [open, movie?.movie_Id]);

    
    return (
        <Drawer
            open={open}
            onClose={onClose}
            size={450}
            title={movie?.title}
            placement="right"
        >
            {movie ? (
                <>
                    <Title level={4}>
                        {movie.title}
                    </Title>

                    <Paragraph>
                        {movie.synopsis}
                    </Paragraph>

                    <Divider />

                    <p>
                        <strong>Duration:</strong> {movie.durationMinutes}
                    </p>

                    <p>
                        <strong>Genre:</strong> {movie.genre}
                    </p>
                    {fState === "loaded" ? <>
                    <br/>
                        <Typography.Title level={3}>
                            Available Cinemas
                        </Typography.Title>
                        <Flex vertical align="flex-start" justify="center" gap={"small"}>
                            {items.map((cinema) => (
                                <Button key={cinema.cinema_Id} variant="text" color="default"
                                    onClick={() => navigate(`/cinema/${cinema.cinema_Id}`)}>
                                    {cinema.cinemaName}</Button>
                            ))}
                        </Flex>
                    
                    </> : <Paragraph> Loading...</Paragraph>}
                </>
            ) : 
            <Paragraph>
                Loading...
            </Paragraph>
            }
        </Drawer>
    );
}