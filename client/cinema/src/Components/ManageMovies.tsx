import { Table, Button, Space, Tag, Typography, Spin, Input,Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { GetAllMovies, DeleteMovie } from "../api/Movies";
import type { MovieItem, FetchState } from "../types";


interface ManageMoviesProps {
    // accepts the table row (transformed) object
    onEditAction: (movie: any) => void;
    refreshTrigger: number;
}

export function ManageMovies({onEditAction, refreshTrigger}: ManageMoviesProps) {

    const [movies, setMovies] = useState<MovieItem[]>([]);
    const [movieState, setMovieState] = useState<FetchState>("idle");

    // STATES FOR DIRECT TEXT FILTERS
    const [titleSearch, setTitleSearch] = useState("");
    const [durationSearch, setDurationSearch] = useState("");

    useEffect(() => {
        let active = true;
        setMovieState("loading");
        GetAllMovies()
            .then((data) => {
                if (!active) return;
                setMovies(data);
                setMovieState("loaded");
            })
            .catch(() => {
                if (active) setMovieState("failed");
            });
        return () => { active = false; };
    }, [refreshTrigger]);

    const handleDelete = async (keyId: string) => {
        const idNumber = Number(keyId);
        try {
            await DeleteMovie(idNumber);
            setMovies((prev) => prev.filter(m => m.movie_Id !== idNumber));
            message.success("Movie deleted successfully");
        } catch {
            message.error("Could not delete the movie.");
        }
    };

    // CONNECTION: We transform the API data into the table format
    const dataSource = movies.map((movie) => ({
        key: String(movie.movie_Id),
        title: movie.title,
        poster: movie.poster,
        genre: Array.isArray(movie.genre) ? movie.genre : [movie.genre],
        duration: movie.durationMinutes,
        rating: movie.rating,
        synopsis: movie.synopsis
    }));

    // PREVIOUS LOCAL FILTERING FOR TITLE AND DURATION
    const filteredDataSource = dataSource.filter((movie) => {
        const matchesTitle = movie.title.toLowerCase().includes(titleSearch.toLowerCase());
        const matchesDuration = durationSearch === "" ? true : movie.duration <= Number(durationSearch);
        return matchesTitle && matchesDuration;
    });

    // DYNAMIC GENERATION OF FILTERS OBTAINED FROM FILTERED DATA
    // Filters for Genres (iterates through the genre arrays and removes duplicates)
    const uniqueGenres = Array.from(new Set(filteredDataSource.flatMap(item => item.genre)));
    const genreFilters = uniqueGenres.map(genre => ({ text: genre, value: genre }));

    // Filters for Ratings (removes duplicate ratings)
    const uniqueRatings = Array.from(new Set(filteredDataSource.map(item => item.rating)));
    const ratingFilters = uniqueRatings.map(rating => ({ text: rating, value: rating }));

    // Table column configuration
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

            title: (
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Title</span>
                    <Input
                        placeholder="Filter by title..."
                        size="small"
                        value={titleSearch}
                        onChange={(e) => setTitleSearch(e.target.value)}
                        className="font-normal"
                        onClick={(e) => e.stopPropagation()} // Prevents interference with sorting events if you add them later
                    />
                </div>
            ),
            dataIndex: "title",
            key: "title",
            className: "font-semibold text-gray-800 align-top"
        },
        {
            title: "Genre",
            dataIndex: "genre",
            key: "genre",
            className: "align-top",
            filters: genreFilters,
            onFilter: (value: any, record: any) => record.genre.includes(value as string),
            filterSearch: true,
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
            
            title: (
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Duration</span>
                    <Input
                        placeholder="Mins..."
                        type="number"
                        size="small"
                        value={durationSearch}
                        onChange={(e) => setDurationSearch(e.target.value)}
                        className="font-normal"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ),
            dataIndex: "duration",
            key: "duration",
            className: "align-top",
            render: (mins: number) => `${mins} min`
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: "rating",
            className: "align-top",
            filters: ratingFilters,
            onFilter: (value: any, record: any) => record.rating === value,
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
            className: "align-top",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => onEditAction(record)}
                        className="text-blue-600! hover:bg-blue-50!"
                    />
                    {/* Delete Config */}
                    <Popconfirm
                        title="Delete the movie"
                        description="Are you sure you want to delete this movie?"
                        onConfirm={() => handleDelete(record.key)}
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            className="hover:bg-red-50!"
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="w-full">
            {/* STATE MANAGEMENT: LOADING */}
            {movieState === "loading" && (
                <div className="flex flex-col items-center justify-center p-10 gap-3">
                    <Spin size="large" />
                    <Typography.Text type="secondary">Loading movies...</Typography.Text>
                </div>
            )}

            {/* STATE HANDLING: ERROR */}
            {movieState === "failed" && (
                <div className="text-center p-10">
                    <Typography.Text type="danger" className="font-bold!">
                        Failed to load movies. Please try again later.
                    </Typography.Text>
                </div>
            )}

            {/* STATE MANAGEMENT: SUCCESS */}
            {movieState === "loaded" && (
                <Table
                    dataSource={filteredDataSource} // We pass the data already filtered by text
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                    className="border border-gray-100 rounded-lg overflow-hidden shadow-sm"
                    locale={{ emptyText: "No movies found" }}
                />
            )}
        </div>
    );
}
