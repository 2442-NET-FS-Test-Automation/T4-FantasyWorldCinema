import { Table, Button, Space, Tag, Typography, Spin, Input, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState, useMemo } from "react";
import { GetAllShowtimes, DeleteShowtime } from "../api/Showtimes";
import type { ShowtimeItem, FetchState } from "../types";

interface ManageShowtimesProps {
    refreshTrigger: number;
    onEditAction: (showtime: any) => void;
}

export function ManageShowtimes({refreshTrigger, onEditAction} : ManageShowtimesProps) {
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
            .catch(() => { if (active) setShowtimeState("failed"); });
        return () => { active = false; };
    }, [refreshTrigger]);

    /* 1. Filtering data taken from the API */
    const filteredDataSource = useMemo(() => {
        const m = movieSearch.toLowerCase();
        const r = roomSearch.toLowerCase();
        return showtimes.filter((st) =>
            (st.movie || "").toLowerCase().includes(m) &&
            (st.room || "").toLowerCase().includes(r)
        );
    }, [showtimes, movieSearch, roomSearch]);

    /* 2. Dynamic Generation of filters over real Data */
    const dateFilters = useMemo(() => {
        const uniqueDates = Array.from(new Set(filteredDataSource.map(item => item.showDate)));
        return uniqueDates.map(date => {
            const d = new Date(date);
            return { text: isNaN(d.getTime()) ? date : date.split("T")[0], value: date };
        });
    }, [filteredDataSource]);

    const ratingFilters = useMemo(() => {
        const uniqueRatings = Array.from(new Set(filteredDataSource.map(item => item.rating || "TBA")));
        return uniqueRatings.map(rating => ({ text: rating, value: rating }));
    }, [filteredDataSource]);

    const handleDelete = async (showtime_Id: any) => {
        const idNumber = Number(showtime_Id);
        try {
            await DeleteShowtime(idNumber);
            setShowtimes((prev) => prev.filter(s => s.showtime_Id !== idNumber));
            message.success("Movie deleted successfully");
        } catch {
            message.error("Could not delete the movie.");
        }
    };

    /* 3. Table column configuration */
    const columns = useMemo(() => [
        {
            title: "Poster",
            dataIndex: "poster",
            key: "poster",
            className: "align-top",
            render: (poster: string, record: any) => (
                <img
                    src={poster}
                    alt={record.movie}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co';
                    }}
                />
            ),
        },
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
            onFilter: (value: any, record: ShowtimeItem) => record.showDate === value,
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
            onFilter: (value: any, record: ShowtimeItem) => record.rating === value,
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
            render: (_: any, record: ShowtimeItem) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => onEditAction(record)}
                        className="text-blue-600! hover:bg-blue-50!"
                    />
                    <Popconfirm
                        title="Delete Showtime"
                        description="Are you sure you want to delete this showtime?"
                        onConfirm={() => handleDelete(record.showtime_Id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
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
    ], [movieSearch, roomSearch, dateFilters, ratingFilters]);


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
                    rowKey={"showtime_Id"}
                    dataSource={filteredDataSource} // We pass the data already filtered by text
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                    className="border border-gray-100 rounded-lg overflow-hidden shadow-sm"
                    locale={{ emptyText: "No showtimes found" }}
                />
            )}
        </div>
    );
}
