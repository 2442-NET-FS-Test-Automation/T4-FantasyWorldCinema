import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ConfigProvider, Spin, Typography, Empty } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import type { ShowtimeItem, FetchState } from "../types";
import { GetShowtimesByCinema } from "../api/Showtimes";
import { ShowtimeCard } from "../Components/ShowtimeCard";


const { Title, Paragraph } = Typography;

export function DisplayShowtimes() {
    const { CinemaId } = useParams<{ CinemaId: string }>();
    const Cinema_Id = Number(CinemaId);

    const [items, setItems] = useState<ShowtimeItem[]>([]);
    const [fState, setFState] = useState<FetchState>("idle");
    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });
    
    useEffect(() => {
        let active = true;
        setFState("loading");
        
        GetShowtimesByCinema(Cinema_Id).then((data) => {
            if(!active) return;
            setItems(data);
            setFState("loaded");
        }).catch(() => {
            if(active) setFState("failed");
        });

        return () => { active = false; };
    }, [Cinema_Id]);
    
    const groupedShowtimes = useMemo(() => {
        const filtered = items.filter((showtime) => showtime.showDate === selectedDate);

        return filtered.reduce<Record<string, ShowtimeItem[]>>((acc, showtime) => {
            if (!acc[showtime.movie]) {
                acc[showtime.movie] = [];
            }
            acc[showtime.movie].push(showtime);
            return acc;
        }, {});
    }, [items, selectedDate]);
    
    const availableDates = useMemo(() => {
        return [...new Set(items.map(showtime => showtime.showDate))].sort();
    }, [items]);
    
    useEffect(() => {
        if (availableDates.length > 0 && !availableDates.includes(selectedDate)) {
            setSelectedDate(availableDates[0]);
        }
    }, [availableDates, selectedDate]);

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    colorPrimary: '#d4af37',
                    colorBgElevated: '#1e1e24',
                    colorText: '#ffffff',
                }
            }}
        >
            <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto font-sans flex flex-col items-center w-full">
                
                {fState === "loading" && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Spin size="large" />
                        <Paragraph className="!text-[#d4af37] mt-6 tracking-widest uppercase">Loading Showtimes...</Paragraph>
                    </div>
                )}

                {fState === "failed" && availableDates.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Title level={2} className="!text-white !m-0">We couldn't load the showtimes.</Title>
                        <Paragraph className="!text-[#94a3b8] mt-2">Please try again later or check another cinema.</Paragraph>
                    </div>
                )}

                {fState === "loaded" && (
                    <div className="w-full">
                        
                        <div className="mb-10 w-full flex flex-col items-center border-b border-[rgba(212,175,55,0.2)] pb-8">
                            <Title level={2} className="!text-[#d4af37] !m-0 uppercase tracking-widest flex items-center gap-3">
                                <CalendarOutlined /> Choose your Date
                            </Title>
                            
                            {availableDates.length > 0 ? (
                                <div className="flex gap-4 mt-8 overflow-x-auto w-full max-w-4xl justify-start md:justify-center pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-2">
                                    {availableDates.map(date => (
                                        <button
                                            key={date}
                                            onClick={() => setSelectedDate(date)}
                                            className={`whitespace-nowrap px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 shadow-lg border cursor-pointer ${
                                                selectedDate === date 
                                                    ? "bg-[#d4af37] text-black border-[#d4af37] shadow-[0_4px_20px_rgba(212,175,55,0.4)] transform scale-105" 
                                                    : "bg-[#1e1e24] text-white border-[rgba(212,175,55,0.3)] hover:border-[#d4af37] hover:text-[#d4af37]"
                                            }`}
                                        >
                                            {new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                day: "numeric",
                                                month: "short"
                                            })}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <Paragraph className="!text-[#64748b] mt-6">No dates available for this cinema.</Paragraph>
                            )}
                        </div>
                        
                        {availableDates.length > 0 && Object.keys(groupedShowtimes).length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {Object.entries(groupedShowtimes).map(([movie, showtimes]) => (
                                    <ShowtimeCard
                                        key={movie}
                                        title={movie}
                                        poster={showtimes[0].poster}
                                        rating={showtimes[0].rating}
                                        showtimes={showtimes}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center py-20">
                                <Empty 
                                    description={<span className="text-[#94a3b8] text-lg">No showtimes found for this date.</span>} 
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            </div>
                        )}

                    </div>
                )}
            </div>
        </ConfigProvider>
    );
}