import type { MovieItem } from "../types";
import { Typography, Tag } from "antd";

interface MovieProps {
    movie: MovieItem;
    onClick?: () => void; 
}

export function MovieCard({ movie, onClick }: MovieProps) {
    const getRatingColor = (rating: string) => {
        if (rating === "R" || rating === "PG13" || rating === "PG-13") return "#d4af37";
        if (rating === "G" || rating === "PG") return "#52c41a";
        if (rating === "NC17" || rating === "NC-17") return "#ff4d4f";
        return "default";
    };

    return (
        <div 
            onClick={onClick} 
            className="group relative w-full h-100 sm:h-120 rounded-4xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] select-none cursor-grab active:cursor-grabbing"
        >
            
            {movie.poster ? (
                <img 
                    src={movie.poster} 
                    alt={movie.title}
                    draggable={false} 
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:blur-md" 
                />
            ) : (
                <div className="absolute inset-0 w-full h-full bg-[#1e1e24] flex items-center justify-center text-[#64748b]">
                    No Poster
                </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-[#0f0f12] via-[#0f0f12]/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end opacity-0 transition-all duration-500 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 pointer-events-none">
                
                <Tag color={getRatingColor(movie.rating)} className="self-start mb-3! border-none font-bold text-black px-3 py-1 rounded-full">
                    {movie.rating}
                </Tag>
                
                <Typography.Title level={3} className="text-white! m-0! mb-1! font-bold leading-tight line-clamp-2">
                    {movie.title}
                </Typography.Title>
                
                <Typography.Text className="text-[#d4af37]! text-sm font-semibold mb-4! tracking-wider uppercase">
                    {movie.genre} • {movie.durationMinutes} min
                </Typography.Text>
                
                <Typography.Paragraph 
                    className="text-[#94a3b8]! text-sm leading-relaxed m-0! pointer-events-auto overflow-y-auto max-h-25 sm:max-h-30 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {movie.synopsis}
                </Typography.Paragraph>
            </div>
        </div>
    );
}