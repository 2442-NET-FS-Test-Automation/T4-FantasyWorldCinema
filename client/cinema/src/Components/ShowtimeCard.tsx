import { Typography, Tag, Button } from "antd";
import type { ShowtimeItem } from "../types";
import { useNavigate } from "react-router-dom";

interface ShowtimeCardProps {
    title: string;
    poster: string;
    rating: string;
    showtimes: ShowtimeItem[];
}

export function ShowtimeCard({ title, poster, rating, showtimes }: ShowtimeCardProps) {
    const navigate = useNavigate();

    const getRatingColor = (rating: string) => {
        if (rating === "R" || rating === "PG13" || rating === "PG-13") return "#d4af37";
        if (rating === "G" || rating === "PG") return "#52c41a";
        if (rating === "NC17" || rating === "NC-17") return "#ff4d4f";
        return "default";
    };

    return (
        <div className="bg-[#1e1e24] border border-[rgba(212,175,55,0.15)] rounded-[24px] overflow-hidden flex flex-col h-full shadow-lg transition-all duration-300 hover:border-[#d4af37] hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:-translate-y-1">
            
            <div className="relative w-full aspect-[2/3] bg-[#0f0f12]">
                {poster ? (
                    <img src={poster} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#64748b]">No Poster</div>
                )}
                
                <div className="absolute top-4 left-4 z-10">
                    <Tag color={getRatingColor(rating)} className="!m-0 border-none font-bold text-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        {rating}
                    </Tag>
                </div>
                
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1e1e24] to-transparent" />
            </div>

            <div className="p-5 flex flex-col flex-grow relative z-10">
                <Typography.Title level={4} className="!text-white !m-0 !mb-5 line-clamp-2 leading-tight">
                    {title}
                </Typography.Title>
                
                <div className="mt-auto">
                    <Typography.Text className="!text-[#64748b] text-xs uppercase tracking-widest block mb-3 font-semibold">
                        Select a Showtime
                    </Typography.Text>
                    
                    <div className="flex flex-wrap gap-2">
                        {showtimes.map((showtime: ShowtimeItem) => (
                            <Button 
                                key={showtime.showtime_Id}
                                onClick={() => navigate(`/showtime/${showtime.showtime_Id}`)}
                                className="!bg-[#0f0f12] !text-[#d4af37] border border-[rgba(212,175,55,0.3)] hover:!bg-[#d4af37] hover:!text-black hover:!border-[#d4af37] font-bold tracking-wider transition-all duration-300 rounded-lg px-4"
                            >
                                {showtime.startTime}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}