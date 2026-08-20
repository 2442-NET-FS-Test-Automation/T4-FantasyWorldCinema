import { useState } from "react";
import { Typography, Card, Flex, Button, message } from "antd";
import { FileOutlined, CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import { ManageMovies } from "../Components/ManageMovies";
import { ManageShowtimes } from "../Components/ManageShowtimes";
import { CreateMovieModal } from "../Components/CreateMovieModal";
import { CreateShowtimeModal } from "../Components/CreateShowtimeModal";
import type { MovieItem, CreateShowtimeItem } from "../types";

export function ManageCatalog() {
    const [selectedView, setSelectedView] = useState<"movies" | "showtimes" | null>(null);

    const handleCreateClick = () => {
        if (selectedView === "movies") {
            handleOpenCreateMovie();
        } else if (selectedView === "showtimes") {
            handleOpenCreateShowtime();
        }
    };

    // 2. STATES TO CONTROL THE MODAL
    const [isModalMovieOpen, setIsModalMovieOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState<MovieItem | undefined>(undefined);
    
    const [isModalShowtimeOpen, setIsModalShowtimeOpen] = useState(false);
    const [editingShowtime, setEditingShowtime] = useState<CreateShowtimeItem | undefined>(undefined);

    const [movieRefreshTrigger, setMovieRefreshTrigger] = useState(0);
    const [showtimeRefreshTrigger, setShowtimeRefreshTrigger] = useState(0);
    
    const [isSubmitting] = useState(false);

    const handleOpenCreateMovie = () => {
        setEditingMovie(undefined);
        setIsModalMovieOpen(true);
    };

    const handleOpenEditMovie = (movie: MovieItem) => {
        setEditingMovie(movie);
        setIsModalMovieOpen(true);
    };

    const handleCloseMovieModal = () => {
        setIsModalMovieOpen(false);
        setEditingMovie(undefined);
    };

    const handleMovieSubmit = (/* submittedData: any */) => {
        if (editingMovie) {
            message.success("Movie updated successfully!");
        } else {
            message.success("Movie created successfully!");
        }
        setMovieRefreshTrigger((prev) => prev + 1);

        handleCloseMovieModal();
    };

    const handleOpenCreateShowtime = () => {
        setEditingShowtime(undefined);
        setIsModalShowtimeOpen(true);
    };

    const handleOpenEditShowtime = (showtime: CreateShowtimeItem) => {
        setEditingShowtime(showtime);
        setIsModalShowtimeOpen(true);
    };

    const handleCloseShowtimeModal = () => {
        setIsModalShowtimeOpen(false);
        setEditingShowtime(undefined);
    };

    const handleCreateShowtimeSubmit = (/* submittedData: any */) => {
        if (editingShowtime) {
            message.success("Showtime updated successfully!");
        } else {
            message.success("Showtime created successfully!");
        }
        setShowtimeRefreshTrigger((prev) => prev + 1);

        handleCloseShowtimeModal();
    };


    return (
        <div className="min-h-[calc(100vh-120px)] mt-[120px] p-6 flex flex-col gap-6">

            {/* VIEW 1: INITIAL STATE */}
            {selectedView === null ? (
                <Flex vertical align="center" justify="center" className="min-h-[50vh] flex-grow">
                    <Card className="p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-full max-w-[400px] text-center">
                        <Typography.Title level={3} className="!mb-6">
                            Select Option to Manage
                        </Typography.Title>

                        <Flex vertical gap="medium">
                            <Button
                                type="primary"
                                size="large"
                                icon={<FileOutlined />}
                                onClick={() => setSelectedView("movies")}
                                className="h-[50px] text-base"
                            >
                                Manage Movies
                            </Button>
                            <Button
                                type="default"
                                size="large"
                                icon={<CalendarOutlined />}
                                onClick={() => setSelectedView("showtimes")}
                                className="h-[50px] text-base"
                            >
                                Manage Showtimes
                            </Button>
                        </Flex>
                    </Card>
                </Flex>
            ) : (

                /* VIEW 2: ACTIVE STATE */
                <>
                    <Typography.Title level={3} className='text-white! m-0! mb-1! font-bold leading-tight line-clamp-2'>
                        Catalog Panel
                    </Typography.Title>
                    <div className="px-6 flex items-center justify-between rounded-lg h-16">
                        <div className="hidden md:flex bg-slate-500/20 rounded-full p-1 border border-slate-400/30 shadow-inner font-primary text-base">
                            <button
                                onClick={() => setSelectedView("movies")}
                                className={`group relative flex items-center justify-center px-5 h-8 rounded-full transition-colors duration-300 ${selectedView === "movies"
                                    ? "bg-slate-700 text-white font-medium shadow-sm"
                                    : "text-slate-200 hover:text-white hover:bg-slate-700/80"
                                    }`}
                            >
                                <span className="inline-block transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                                    Movies
                                </span>
                            </button>

                            <button
                                onClick={() => setSelectedView("showtimes")}
                                className={`group relative flex items-center justify-center px-5 h-8 rounded-full transition-colors duration-300 ${selectedView === "showtimes"
                                    ? "bg-slate-700 text-white font-medium shadow-sm"
                                    : "text-slate-200 hover:text-white hover:bg-slate-700/80"
                                    }`}
                            >
                                <span className="inline-block transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                                    Showtimes
                                </span>
                            </button>
                        </div>

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreateClick}
                        >
                            Create New {selectedView === "movies" ? "Movie" : "Showtime"}
                        </Button>
                    </div>

                    <Card className="rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                        <Flex gap="xlarge" align="start" className="w-full">
                            <div className="flex-grow min-w-0 p-5 border border-dashed border-[#d9d9d9] rounded-lg text-center">
                                <Typography.Title level={4} type="secondary">
                                    {selectedView === "movies" ? (
                                        <ManageMovies onEditAction={handleOpenEditMovie} refreshTrigger={movieRefreshTrigger} />
                                    ) : (
                                        <ManageShowtimes onEditAction={handleOpenEditShowtime} refreshTrigger={showtimeRefreshTrigger} />
                                    )}
                                </Typography.Title>
                            </div>
                        </Flex>
                    </Card>

                    <CreateMovieModal
                        open={isModalMovieOpen}
                        onClose={handleCloseMovieModal}
                        onSubmit={handleMovieSubmit}
                        confirmLoading={isSubmitting}
                        moviedata={editingMovie}
                    />

                    {/* COMPONENT PROPS ARE CORRECTED WITH THEIR CORRESPONDING STATES */}
                    <CreateShowtimeModal
                        open={isModalShowtimeOpen}
                        onClose={handleCloseShowtimeModal}
                        onSubmit={handleCreateShowtimeSubmit}
                        confirmLoading={isSubmitting}
                        showtimedata={editingShowtime}
                    />
                </>
            )}
        </div>
    );
}
