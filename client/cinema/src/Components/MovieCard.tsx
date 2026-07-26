import type { MovieItem } from "../types";
import {Card, Typography, Tag} from "antd";
import "../CSS/Styles.css"

interface MovieProps{
    movie: MovieItem;
}

export function MovieCard({movie}: MovieProps){

    return(
        <Card hoverable className="Movie-Card">
            <img src={movie.poster} className="Poster-Size" />
            <Typography.Title level={5} className="Movie-Title">
                {movie.title}
            </Typography.Title >
            <Typography.Text>
                Duration: {movie.durationMinutes} minutes
            </Typography.Text>
            <br/>
            <Typography.Text >
                {movie.genre}
            </Typography.Text>
            <br/>
            {(movie.rating === "R" || movie.rating === "PG13") && 
            <Tag variant="solid" color={"yellow"} >
                {movie.rating}
            </Tag>
            }
            {(movie.rating === "G" || movie.rating === "PG") && 
            <Tag variant="solid" color={"green"} >
                {movie.rating}
            </Tag>
            }
            {movie.rating === "NC17" && 
            <Tag variant="solid" color={"red"} >
                {movie.rating}
            </Tag>
            }
            

        </Card>
    );
}