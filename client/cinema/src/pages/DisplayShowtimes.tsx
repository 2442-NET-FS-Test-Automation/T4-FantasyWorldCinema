import { useState, useEffect, useMemo } from "react";
import type { ShowtimeItem, FetchState } from "../types";
import { GetShowtimesByCinema } from "../api/Showtimes";
import { ShowtimeCard } from "../Components/ShowtimeCard";
import { useParams } from "react-router-dom";
import { Flex, Card, Row, Col, Button, Typography } from "antd";
import "../CSS/Styles.css";
import "../CSS/Backgrounds.css";


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
    
    console.log(items);
    // Filter showtimes by date and group it by movie
    const groupedShowtimes = useMemo(() => {
        const filtered = items.filter((showtime) => {
            
            return showtime.showDate === selectedDate;
        });

        return filtered.reduce<Record<string, ShowtimeItem[]>>((acc, showtime) => {
            if (!acc[showtime.movie]) {
            acc[showtime.movie] = [];
            }

            acc[showtime.movie].push(showtime);
            return acc;
        }, {});
    }, [items, selectedDate]);
    
    const availableDates = useMemo(() => {
        return [...new Set( items.map(showtime => showtime.showDate ) )].sort();
    }, [items]);
    

    useEffect(() => {
        if (availableDates.length > 0 && !availableDates.includes(selectedDate)) {
            setSelectedDate(availableDates[0]);
        }
    }, [availableDates]);



    return (
            <Flex vertical id="DisplayShowtimes"    
                justify="center"
                align="center"
                className="Flex-Background">
                {(availableDates.length > 0 && fState === "loaded") && <>
                <Typography.Title level={2}>Choose your Date</Typography.Title>

                <div className="Showtime-Date-Container">
                    {availableDates.map(date => (
                        <Button style={{columnGap: 10}}
                            key={date}
                            type={selectedDate === date ? "primary" : "default"}
                            onClick={() => setSelectedDate(date)}
                        >
                            
                            {new Date(`${date}T00:00:00`).toLocaleDateString("es-MX", {
                                weekday: "short",
                                day: "numeric",
                                month: "short"
                            })}
                        </Button>
                    ))}
                </div>
                
                {fState === "loaded" &&
                <Card  className="Movies-Card">
                    <Row gutter={[24, 24]}>
                        {Object.entries(groupedShowtimes).map(([movie, showtimes]) => (
                            <Col
                                key={movie}
                                xs={24}
                                sm={12}
                                md={8}
                                lg={6}
                            >
                                <ShowtimeCard
                                    title={movie}
                                    poster={showtimes[0].poster}
                                    rating={showtimes[0].rating}
                                    showtimes={showtimes}
                                />
                            </Col>
                        ))}
                    </Row>
                    
                </Card>}
                </>}
                {(fState === "failed" && availableDates.length === 0) && <Typography.Title level={2}>Not find Available Showtimes</Typography.Title>}
                {fState === "loading" && <Typography.Title level={2}>Loading</Typography.Title>}
                
    
            </Flex>
        )
}