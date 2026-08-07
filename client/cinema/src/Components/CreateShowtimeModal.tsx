import { Modal, Form, Input, Select, InputNumber, DatePicker, ConfigProvider, theme } from "antd";
import dayjs from "dayjs";
import { useState, useEffect, useMemo } from "react";
import type { CreateShowtimeItem, MovieItem, CinemaItem, RoomItem } from "../types";
import { CreateShowtime, UpdateShowtime } from "../api/Showtimes";
import { GetAllMovies } from "../api/Movies";
import { getCinemas } from "../api/Cinema";
import { GetRoomsByCinema } from "../api/Rooms";


interface CreateShowtimeModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    confirmLoading: boolean;
    showtimedata?: CreateShowtimeItem;
}

const DEFAULT_VALUES = {
    price: 0,
    movie: undefined,
    cinema: undefined,
    room: undefined,
    startTime: "12:00",
    endTime: "14:00",
    showDate: undefined
};

export function CreateShowtimeModal({ open, onClose, onSubmit, confirmLoading, showtimedata }: CreateShowtimeModalProps) {
    const [form] = Form.useForm();
    const isEditing = !!showtimedata;

    /* STATES TO STORE RAW DATA FROM THE DATABASE */
    const [rawMovies, setRawMovies] = useState<Pick<MovieItem, "movie_Id" | "title">[]>([]);
    /* Control state to track which room by cinema the user selected */
    const [rawCinemas, setRawCinemas] = useState<Pick<CinemaItem, "cinema_Id" | "cinemaName">[]>([]);
    const [rawRooms, setRawRooms] = useState<Pick<RoomItem, "room_Id" | "cinema_Id" | "roomName">[]>([]);

    const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);


    useEffect(() => {
        async function loadInitialData() {
            try {
                const [moviesResponse, cinemasResponse] = await Promise.all([
                    GetAllMovies(),
                    getCinemas()
                ]);
                setRawMovies(moviesResponse);
                setRawCinemas(cinemasResponse);
            } catch (error) {
                console.error("Error loading movies & cinemas:", error);
            }
        }

        if (open) {
            loadInitialData();
        }
    }, [open]);

    useEffect(() => {
        const cinemaIdToFetch = selectedCinemaId || (isEditing ? showtimedata?.cinema_Id : null);

        async function fetchRooms() {
            if (!cinemaIdToFetch) {
                setRawRooms([]);
                return;
            }
            try {
                const roomsResponse = await GetRoomsByCinema(cinemaIdToFetch);
                setRawRooms(roomsResponse);
            } catch (error) {
                console.error("Error loading rooms:", error);
            }
        }

        fetchRooms();
    }, [selectedCinemaId, showtimedata, isEditing]);

    // SYNC FORM: Handles both Creating (defaults) and Editing (populating database data)
    useEffect(() => {
        if (open) {
            if (isEditing && showtimedata) {
                const foundMovie = rawMovies.find(m => m.title === (showtimedata as any).movie);
                const targetMovieId = showtimedata.movie_Id || foundMovie?.movie_Id;

                const foundRoom = rawRooms.find(r => r.roomName === (showtimedata as any).room);
                const targetRoomId = showtimedata.room_Id || (showtimedata as any).room || foundRoom?.room_Id;

                const targetCinemaId = showtimedata.cinema_Id || foundRoom?.cinema_Id || rawRooms.find(r => r.room_Id === Number(targetRoomId))?.cinema_Id;

                if (rawMovies.length === 0 || rawCinemas.length === 0) return;

                setSelectedCinemaId(targetCinemaId || null);

                form.setFieldsValue({
                    movie: targetMovieId,
                    cinema: targetCinemaId,
                    room: Number(targetRoomId) || undefined,
                    price: showtimedata.price,
                    startTime: showtimedata.startTime,
                    endTime: showtimedata.endTime,
                    showDate: showtimedata.showDate ? dayjs(showtimedata.showDate) : undefined
                });
            } else {
                form.setFieldsValue(DEFAULT_VALUES);
                setSelectedCinemaId(null);
            }
        }
    }, [open, isEditing, showtimedata, form]);


    /* FUNCTIONS TO GENERATE SELECTOR OPTIONS For Select Component */
    /* Generates the movie list formatted */
    const movieOptions = useMemo(() => {
        return rawMovies.map((m) => ({
            value: m.movie_Id,
            label: m.title,
        }));
    }, [rawMovies]);

    /* Generates the cinema list formatted */
    const cinemaOptions = useMemo(() => {
        return rawCinemas.map((c) => ({
            value: c.cinema_Id,
            label: c.cinemaName,
        }));
    }, [rawCinemas]);

    /* Generates the filtered and formatted room list */
    const roomOptions = useMemo(() => {
        const currentCinemaId = selectedCinemaId || showtimedata?.cinema_Id;
        if (!currentCinemaId) return [];

        return rawRooms
            .filter((r) => r.cinema_Id === selectedCinemaId)
            .map((r) => ({
                value: r.room_Id,
                label: r.roomName,
            }));
    }, [rawRooms, selectedCinemaId, showtimedata]);


    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const showtimePayload = {
                movie_Id: values.movie,
                cinema_Id: values.cinema,
                room_Id: values.room,
                price: values.price,
                startTime: values.startTime,
                endTime: values.endTime,
                showDate: values.showDate ? values.showDate.format("YYYY-MM-DD") : undefined
            };

            if (isEditing) {
                const updatedInfo = {
                    showtime_Id: Number((showtimedata as any).key) || showtimedata?.showtime_Id,
                    ...showtimePayload
                };
                console.log("Modo Edición - Datos listos para actualizar:", updatedInfo);

                await UpdateShowtime(updatedInfo);
                onSubmit({ ...showtimedata, ...values });
            } else {
                await CreateShowtime(showtimePayload as any);
                onSubmit(values);
            }

            form.resetFields();
        } catch (error) {
            console.error("Validation failed or API Error:", error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
    <ConfigProvider
        theme={{
            algorithm: theme.darkAlgorithm,
            token: {
                colorPrimary: "#d4af37",
                colorBgContainer: "#1e1e24",
                colorBgElevated: "#121214",
                borderRadius: 12,
            },
        }}
    >
        <Modal
            title={isEditing ? "Edit Showtime" : "Create New Showtime"}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
            okText={isEditing ? "Save Changes" : "Create"}
            cancelText="Cancel"
            destroyOnHidden
            styles={{
                mask: { backdropFilter: "blur(4px)" },
            }}
            className="font-sans !rounded-lg"
        >
            <Form
                form={form}
                layout="vertical"
                name="create_showtime_form"
                className="mt-4"
                onSubmitCapture={(e) => e.preventDefault()}
            >
                {/* Select dynamic Movies by name but save as movie_Id */}
                <Form.Item
                    name="movie"
                    label="Select Movie"
                    rules={[{ required: true, message: "Please select a movie" }]}
                >
                    <Select
                        placeholder="Choose a movie"
                        className="!rounded-md h-10"
                        options={movieOptions}
                    />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    {/* Select dynamic Cinemas, need Id to filter rooms by cinema */}
                    <Form.Item
                        name="cinema"
                        label="Cinema"
                        rules={[{ required: true, message: "Please select a Cinema" }]}
                    >
                        <Select
                            placeholder="Select Cinema"
                            className="h-10"
                            onChange={(value) => {
                                setSelectedCinemaId(value);
                                form.setFieldValue("room", undefined);
                            }}
                            options={cinemaOptions}
                        />
                    </Form.Item>

                    {/* Select dynamic rooms filtered by cinemas but save as room_Id */}
                    <Form.Item
                        name="room"
                        label="Room / Hall"
                        rules={[{ required: true, message: "Please select a room" }]}
                    >
                        <Select
                            placeholder="Select a room"
                            className="h-10"
                            options={roomOptions}
                            disabled={!selectedCinemaId && !showtimedata?.cinema_Id}
                        />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="showDate"
                        label="Show Date"
                        rules={[{ required: true, message: "Please select a date" }]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder="YYYY-MM-DD"
                            className="!rounded-md h-10 !w-full"
                        />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, message: "Please select price" }]}
                    >
                        <InputNumber
                            min={0}
                            placeholder="0.00"
                            className="!rounded-md h-10 !w-full flex items-center"
                        />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="startTime"
                        label="Start Time"
                        rules={[{ required: true, message: "Please select a time" }]}
                    >
                        <Input
                            type="time"
                            className="!rounded-md h-10"
                        />
                    </Form.Item>

                    <Form.Item
                        name="endTime"
                        label="End Time"
                        rules={[{ required: true, message: "Please select a time" }]}
                    >
                        <Input
                            type="time"
                            className="!rounded-md h-10"
                        />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    </ConfigProvider>
);


}
