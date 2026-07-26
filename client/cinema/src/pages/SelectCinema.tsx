import { useEffect, useState } from "react";
import { Card, Flex, Spin, Typography , Row, Col, Carousel} from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import "../CSS/Styles.css";
import type { MovieItem, CinemaItem, FetchState } from "../types";
import { getCinemas } from "../api/Cinema";
import { CinemaSearchBar } from "../Components/CinemaSearchBar";
import { GetMovies } from "../api/Movies";
import { MovieCard } from "../Components/MovieCard";

const { Title, Paragraph } = Typography;


export function SelectCinema() {
    const [items, setItems] = useState<CinemaItem[]>([]);
    const [fState, setFState] = useState<FetchState>("idle");

    const [movies, setMovies] = useState<MovieItem[]>([]);
    const [movieState, setMovieState] = useState<FetchState>("idle");

    const moviesPerSlide: number = 4;
    const moviesGroup = [];

    useEffect(() => {
        let active = true;

        setFState("loading");

        getCinemas()
            .then((data) => {
                if (!active) return;

                setItems(data);
                setFState("loaded");
            })
            .catch(() => {
                if (active) setFState("failed");
            });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;

        setMovieState("loading");

        GetMovies()
            .then((data) => {
                if (!active) return;

                setMovies(data);
                setMovieState("loaded");
            })
            .catch(() => {
                if (active) setMovieState("failed");
            });

        return () => {
            active = false;
        };
    }, []);

    for (let i = 0; i < movies.length; i += moviesPerSlide){
        moviesGroup.push(movies.slice(i, i + moviesPerSlide));
    }

    return (
        <>
        <Flex vertical
            justify="center"
            align="center"
            className="Flex-Home-Background" >
            <Card className="Cinema-Card" >
                <Flex vertical align="center" gap={10}>

                    <EnvironmentOutlined
                        style={{
                            fontSize: 42,
                            color: "#1677ff"
                        }}
                    />

                    <Title level={2} className="Title-Cinema">
                        Fantasy World Cinema
                    </Title>

                    <Paragraph type="secondary">
                        Select your cinema
                    </Paragraph>

                    {fState === "loading" && (
                        <Spin size="large" />
                    )}

                    {fState === "failed" && (
                        <Paragraph type="danger">
                            Error loading cinemas.
                        </Paragraph>
                    )}

                    {fState === "loaded" && (
                        <CinemaSearchBar cinemas={items} />
                    )}

                </Flex>
            </Card>
            <Card className="Movies-Card">
                {movieState === "loading" ? <Paragraph>Loading...</Paragraph> : <>
                <Title level={2} className="Title-Cinema"> Our Movies</Title>
                <Carousel
                    dots
                    arrows
                    infinite
                >
                    {moviesGroup.map((group, index) => (
                        <div key={index}>
                            <Row gutter={[16, 16]} justify="center">
                                {group.map(movie => (
                                    <Col
                                        key={movie.movie_Id}
                                        span={6}
                                    >
                                        <MovieCard movie={movie} />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ))}
                </Carousel>
                </>
                }
                    
            </Card>
        </Flex>
        </>
    );
}