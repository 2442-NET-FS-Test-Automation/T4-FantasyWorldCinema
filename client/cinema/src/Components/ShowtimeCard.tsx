import { Card, Typography, Tag, Button, Flex } from "antd";
import type { ShowtimeItem } from "../types";
import "../CSS/Styles.css"

interface ShowtimeCardProps {
    title: string;
    poster: string;
    rating: string;
    showtimes: ShowtimeItem[];
}

export function ShowtimeCard({title, poster, rating, showtimes}:ShowtimeCardProps) {
    return(
        <Card className="Movie-Card">
            <img src={poster} className="Poster-Size"/>
            <Typography.Title level={5} className="Movie-Title">
                {title}
            </Typography.Title >
            <br/>
            {(rating === "R" || rating === "PG13") && 
            <Tag variant="solid" color={"yellow"} >
                {rating}
            </Tag>
            }
            {(rating === "G" || rating === "PG") && 
            <Tag variant="solid" color={"green"} >
                {rating}
            </Tag>
            }
            {rating === "NC17" && 
            <Tag variant="solid" color={"red"} >
                {rating}
            </Tag>
            }
            <Flex>
                {showtimes.map((showtime: ShowtimeItem) =>
                <Button>{showtime.startTime}</Button>
                )}
            </Flex>
        </Card>
    )
}
