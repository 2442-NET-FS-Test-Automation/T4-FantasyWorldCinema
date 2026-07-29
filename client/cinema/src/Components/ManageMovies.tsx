import { Table, Button, Space, Tag, Typography, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { GetMovies } from "../api/Movies";
import type { MovieItem, FetchState} from "../types";

// Definimos la estructura de datos para las películas
interface MovieRecord {
    key: string;
    title: string;
    poster: string;
    genre: string[];
    duration: number;
    rating: string;
}


export function ManageMovies() {

    const [movies, setMovies] = useState<MovieItem[]>([]);
    const [movieState, setMovieState] = useState<FetchState>("idle");

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
        return () => { active = false; };
    }, []);

    
    // CONEXIÓN: Transformamos los datos del API al formato de la tabla
    const dataSource: MovieRecord[] = movies.map((movie) => ({
        // Usamos su ID único como key. Si tu tipo usa 'movieId' u otro, cámbialo aquí
        key: String(movie.movie_Id || Math.random()), 
        title: movie.title,
        poster: movie.poster,
        // Si tu backend manda un string separado por comas, usamos split, si ya es array se queda igual
        genre: Array.isArray(movie.genre) ? movie.genre : [movie.genre], 
        duration: movie.durationMinutes,
        rating: movie.rating
    }));

    // Configuración de las columnas de la tabla
    const columns = [
        {
            title: "Poster",
            dataIndex: "poster",
            key: "poster",
            width: 80,
            render: (url: string) => (
                <img src={url} alt="Poster" className="w-10 h-14 object-cover rounded shadow-sm" />
            )
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            className: "font-semibold text-gray-800"
        },
        {
            title: "Genre",
            dataIndex: "genre",
            key: "genre",
            render: (genres: string[]) => (
                <>
                    {genres.map(genre => (
                        <Tag color="blue" key={genre} className="rounded-md! font-medium">
                            {genre}
                        </Tag>
                    ))}
                </>
            )
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            render: (mins: number) => `${mins} min`
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: "rating",
            render: (rating: string) => (
                <Tag color={rating === "R" ? "volcano" : "green"} className="font-bold!">
                    {rating}
                </Tag>
            )
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            render: (_: any, record: MovieRecord) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => console.log("Editar Película ID:", record.key)}
                        className="text-blue-600! hover:bg-blue-50!"
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => console.log("Eliminar Película ID:", record.key)}
                        className="hover:bg-red-50!"
                    />
                </Space>
            )
        }
    ];

    return (
         <div className="w-full">
            {/* MANEJO DE ESTADO: CARGANDO */}
            {movieState === "loading" && (
                <div className="flex flex-col items-center justify-center p-10 gap-3">
                    <Spin size="large" />
                    <Typography.Text type="secondary">Loading movies...</Typography.Text>
                </div>
            )}

            {/* MANEJO DE ESTADO: ERROR */}
            {movieState === "failed" && (
                <div className="text-center p-10">
                    <Typography.Text type="danger" className="font-bold!">
                        Failed to load movies. Please try again later.
                    </Typography.Text>
                </div>
            )}

            {/* MANEJO DE ESTADO: ÉXITO */}
            {movieState === "loaded" && (
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                    className="border border-gray-100 rounded-lg overflow-hidden shadow-sm"
                    locale={{ emptyText: "No movies found" }}
                />
            )}
        </div>
    );
}
