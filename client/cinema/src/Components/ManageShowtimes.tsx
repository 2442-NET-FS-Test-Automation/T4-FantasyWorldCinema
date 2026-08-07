import { Table, Button, Space, Tag, Typography, Spin, Input } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { GetAllShowtimes } from "../api/Showtimes";
import type { ShowtimeItem, FetchState } from "../types";

interface ShowtimeRecord {
    key: string;
    movie: string;
    room: string;
    showDate: string;
    startTime: string;
    rating: string;
}

export function ManageShowtimes() {
    const [showtimes, setShowtimes] = useState<ShowtimeItem[]>([]);
    const [showtimeState, setShowtimeState] = useState<FetchState>("idle");

    const [movieSearch, setMovieSearch] = useState("");
    const [roomSearch, setRoomSearch] = useState("");

    useEffect(() => {
        let active = true;
        setShowtimeState("loading");
        GetAllShowtimes()
            .then((data) => {
                if (!active) return;
                setShowtimes(data);
                setShowtimeState("loaded");
            })
            .catch(() => {
                if (active) setShowtimeState("failed");
            });
        return () => { active = false; };
    }, []);

    const dataSource: ShowtimeRecord[] = showtimes.map((showtime) => ({
        key: String(showtime.showtime_Id || Math.random()),
        movie: showtime.movie,
        room: showtime.room,
        showDate: showtime.showDate,
        startTime: showtime.startTime,
        rating: showtime.rating || "TBA"
    }));

    const filteredDataSource = dataSource.filter((showtime) => {
        const movieText = showtime.movie || "";
        const roomText = showtime.room || "";
        
        const matchesMovie = movieText.toLowerCase().includes(movieSearch.toLowerCase());
        const matchesRoom = roomText.toLowerCase().includes(roomSearch.toLowerCase());
        return matchesMovie && matchesRoom;
    });

    // DYNAMIC GENERATION OF FILTERS OBTAINED FROM FILTERED DATA (Misma lógica de mapeo)
    // Filters for Show Dates (removes duplicates)
    const uniqueDates = Array.from(new Set(filteredDataSource.map(item => item.showDate)));
    const dateFilters = uniqueDates.map(date => {
        const d = new Date(date);
        const formatted = isNaN(d.getTime()) ? date : date.split("T")[0];
        return { text: formatted, value: date };
    });

    // Filters for Ratings (removes duplicates)
    const uniqueRatings = Array.from(new Set(filteredDataSource.map(item => item.rating)));
    const ratingFilters = uniqueRatings.map(rating => ({ text: rating, value: rating }));

    // Table column configuration
    const columns = [
        {
            title: (
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Movie</span>
                    <Input
                        placeholder="Filter by movie..."
                        size="small"
                        value={movieSearch}
                        onChange={(e) => setMovieSearch(e.target.value)}
                        className="font-normal"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ),
            dataIndex: "movie",
            key: "movie",
            className: "font-semibold text-gray-800 align-top"
        },
        {
            title: (
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Room / Hall</span>
                    <Input
                        placeholder="Filter room..."
                        size="small"
                        value={roomSearch}
                        onChange={(e) => setRoomSearch(e.target.value)}
                        className="font-normal"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ),
            dataIndex: "room",
            key: "room",
            className: "align-top",
            render: (room: string) => (
                <Tag color="default" className="rounded-md! font-medium">
                    {room}
                </Tag>
            )
        },
        {
            title: "Show Date",
            dataIndex: "showDate",
            key: "showDate",
            className: "align-top",
            filters: dateFilters,
            onFilter: (value: any, record: ShowtimeRecord) => record.showDate === value,
            filterSearch: true,
            render: (date: string) => {
                const d = new Date(date);
                return isNaN(d.getTime()) ? date : date.split("T")[0];
            }
        },
        {
            title: "Start Time",
            dataIndex: "startTime",
            key: "startTime",
            className: "align-top",
            render: (time: string) => `${time.slice(0, 5)} hrs`
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: "rating",
            className: "align-top",
            filters: ratingFilters,
            onFilter: (value: any, record: ShowtimeRecord) => record.rating === value,
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
            render: (_: any, record: ShowtimeRecord) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => console.log("Editar Horario ID:", record.key)}
                        className="text-blue-600! hover:bg-blue-50!"
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => console.log("Eliminar Horario ID:", record.key)}
                        className="hover:bg-red-50!"
                    />
                </Space>
            )
        }
    ];

    return (
        <div className="w-full">
            {/* STATE MANAGEMENT: LOADING */}
            {showtimeState === "loading" && (
                <div className="flex flex-col items-center justify-center p-10 gap-3">
                    <Spin size="large" />
                    <Typography.Text type="secondary">Loading showtimes...</Typography.Text>
                </div>
            )}

            {/* STATE HANDLING: ERROR */}
            {showtimeState === "failed" && (
                <div className="text-center p-10">
                    <Typography.Text type="danger" className="font-bold!">
                        Failed to load showtimes. Please try again later.
                    </Typography.Text>
                </div>
            )}

            {/* STATE MANAGEMENT: SUCCESS */}
            {showtimeState === "loaded" && (
                <Table
                    dataSource={filteredDataSource}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                    className="border border-gray-100 rounded-lg overflow-hidden shadow-sm"
                    locale={{ emptyText: "No showtimes found" }}
                />
            )}
        </div>
    );
}
