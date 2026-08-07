import { Drawer, Typography, Divider, Spin } from "antd";
import { ClockCircleOutlined, TagOutlined, RightOutlined } from "@ant-design/icons";
import type { CinemaItem, FetchState, MovieItem } from "../types";
import { useEffect, useState } from "react";
import { getCinemasByMovie } from "../api/Cinema";
import { useNavigate } from "react-router-dom";

interface MovieDrawerProps {
    movie: MovieItem | null;
    open: boolean;
    onClose: () => void;
}

const { Title, Paragraph } = Typography;

export function MovieDrawer({ movie, open, onClose }: MovieDrawerProps) {
    const navigate = useNavigate();

    const [items, setItems] = useState<CinemaItem[]>([]);
    const [fState, setFState] = useState<FetchState>("idle");

    useEffect(() => {
        if (!open || !movie) return;

        let active = true;
        setFState("loading");
        getCinemasByMovie(movie?.movie_Id).then((data) => {
            if (!active) return;
            setItems(data);
            setFState("loaded");
        }).catch(() => {
            if (active) setFState("failed");
        });
        
        return () => { active = false; };
    }, [open, movie?.movie_Id]);

    return (
        <Drawer
            open={open}
            onClose={onClose}
            width={450}
            placement="right"
            styles={{
                mask: { backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                content: { backgroundColor: '#0f0f12', borderLeft: '1px solid rgba(212, 175, 55, 0.2)' },
                header: { backgroundColor: '#0f0f12', borderBottom: '1px solid rgba(212, 175, 55, 0.15)' },
                body: { backgroundColor: '#1e1e24', padding: '32px 24px' }
            }}
            title={<span className="text-[#d4af37] tracking-wider uppercase font-bold">{movie?.title || "Movie Details"}</span>}
            closeIcon={<span className="text-[#d4af37] text-lg font-bold hover:text-white transition-colors">✕</span>}
        >
            {movie ? (
                <div className="flex flex-col h-full font-sans">
                    
                    <Title level={3} className="!text-white !m-0 !mb-3">
                        {movie.title}
                    </Title>
                    
                    <div className="flex gap-4 mb-6 text-[#d4af37] text-sm font-semibold tracking-wider uppercase">
                        <span className="flex items-center gap-1"><ClockCircleOutlined /> {movie.durationMinutes} min</span>
                        <span className="flex items-center gap-1"><TagOutlined /> {movie.genre}</span>
                    </div>

                    <Paragraph className="!text-[#94a3b8] leading-relaxed text-sm">
                        {movie.synopsis}
                    </Paragraph>

                    <Divider className="border-[rgba(212,175,55,0.15)] my-8" />

                    <Title level={5} className="!text-[#d4af37] uppercase tracking-widest !mb-6 text-sm">
                        Available Cinemas
                    </Title>

                    {fState === "loading" ? (
                        <div className="flex justify-center mt-8">
                            <Spin size="large" />
                        </div>
                    ) : fState === "loaded" && items.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {items.map((cinema) => (
                                <button 
                                    key={cinema.cinema_Id}
                                    onClick={() => navigate(`/cinema/${cinema.cinema_Id}`)}
                                    className="group flex justify-between items-center w-full p-4 rounded-xl border border-[rgba(212,175,55,0.3)] bg-[#0f0f12] hover:bg-[#d4af37] transition-all duration-300 cursor-pointer"
                                >
                                    <span className="text-white group-hover:text-black font-semibold tracking-wide transition-colors">
                                        {cinema.cinemaName}
                                    </span>
                                    <RightOutlined className="text-[#d4af37] group-hover:text-black transition-colors" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <Paragraph className="!text-[#64748b]">
                            No cinemas found currently playing this movie.
                        </Paragraph>
                    )}
                </div>
            ) : (
                <div className="flex justify-center mt-20">
                    <Spin size="large" />
                </div>
            )}
        </Drawer>
    );
}