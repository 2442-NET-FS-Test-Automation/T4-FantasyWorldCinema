import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SeatSelector } from '../Components/SeatsSelector';
import { GetShowtimeById, GetSeatsByShowtimeId } from '../api/Showtimes';
import { createTransaction } from '../api/Transaction';

import type { SeatItem, ShowtimeItem } from '../types';

import { Button, Tag, Typography, message, Spin, Divider } from 'antd';

const { Title, Text } = Typography;

export const ShowtimeDetails = () => {
    const { showtimeId } = useParams<{ showtimeId: string }>();
    const navigate = useNavigate();

    const [showtime, setShowtime] = useState<ShowtimeItem | null>(null);
    const [seats, setSeats] = useState<SeatItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [ticketCount, setTicketCount] = useState<number>(2);
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!showtimeId) return;
            try {
                setLoading(true);
                const id = parseInt(showtimeId);
                
                const showtimeData = await GetShowtimeById(id);
                setShowtime(showtimeData);
                console.log(showtime);

                if (!showtimeData.room_Id) {
                    throw new Error("The server couldn't retrive the Room.");
                }

                const seatsData = await GetSeatsByShowtimeId(id, showtimeData.room_Id);
                setSeats(seatsData);

            } catch (err) {
                setError("Showtime details couldn't be loaded.");
                message.error("Error connecting the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [showtimeId]);

    const handleSeatToggle = (seatId: number) => {
        setSelectedSeatIds((prev) => {
            if (prev.includes(seatId)) return prev.filter(id => id !== seatId);
            if (prev.length < ticketCount) return [...prev, seatId];
            return prev;
        });
    };

    const adjustTicketCount = (delta: number) => {
        const newCount = Math.max(1, ticketCount + delta);
        setTicketCount(newCount);
        if (selectedSeatIds.length > newCount) {
            setSelectedSeatIds(prev => prev.slice(0, newCount));
        }
    };

    const handlePlaceOrder = async () => {
        if (!showtimeId || selectedSeatIds.length !== ticketCount) {
            message.warning(`Please select ${ticketCount} exact seats.`);
            return;
        }

        setIsSubmitting(true);
        try {
            await createTransaction({
                showtimeId: parseInt(showtimeId),
                seatIds: selectedSeatIds
            });
            message.success("Order place successfully!");
            navigate(`/user/my-tickets`); 
        } catch (err) {
            message.error("Error placing order. Seats might be occupied.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spin size="large" tip="Cargando sala..." />
            </div>
        );
    }
    
    if (error || !showtime) {
        return <div className="p-10 text-center text-red-500 font-medium">{error}</div>;
    }

    const getRemainingTime = () => {
        if (!showtime?.showDate || !showtime?.endTime || !showtime?.startTime) return "--";

        const datePart = showtime.showDate; 
        
        const startDateTime = new Date(`${datePart}T${showtime.startTime}`);
        const endDateTime = new Date(`${datePart}T${showtime.endTime}`);

        if (endDateTime < startDateTime) {
            endDateTime.setDate(endDateTime.getDate() + 1);
        }

        const diffMs = endDateTime.getTime() - currentTime.getTime();

        if (diffMs <= 0) return "Ended";

        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const minutes = diffMins % 60;

        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };
    
    return (
        <div className="container mx-auto p-4 md:p-8 flex justify-center font-sans text-gray-800">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 flex flex-col lg:flex-row gap-12">
                
                <div className="flex-1 w-full pt-5">
                    <SeatSelector 
                        seats={seats}
                        selectedSeatIds={selectedSeatIds}
                        onSeatToggle={handleSeatToggle}
                        maxSelectable={ticketCount}
                    />
                </div>
                <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left bg-gray-200/50 p-8 rounded-2xl border border-gray-100">
                    
                    <div className="w-48 h-72 rounded-2xl overflow-hidden shadow-lg mb-6 bg-gray-200">
                        {showtime.posterUrl ? (
                            <img src={showtime.posterUrl} alt={showtime.movie} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Poster</div>
                        )}
                    </div>

                    <Title 
                        level={2} 
                        className='font-movieName! tracking-widest'
                        style={{ margin: 0, fontWeight: 700, color: '#1f2937' }} >
                            {showtime.movie}
                    </Title>
                    
                    <div className="flex gap-2 mt-3 mb-4">
                        {showtime.room.split(' ')[0].length > 1 && (
                            <Tag color="blue" className="rounded-full px-3 py-1 font-semibold border-none">
                                Sala {showtime.room_Id} - {showtime.room}
                            </Tag>
                        )}
                        <Tag color="gold" className="rounded-full px-3 py-1 font-semibold border-none text-yellow-800 bg-yellow-100">
                            {showtime.rating || "TBA"}
                        </Tag>
                    </div>

                    <Divider style={{ margin: '12px 0' }} />

                    <div className="w-full flex justify-between items-center mb-6">
                        <div className="flex flex-col">
                            <Text type="secondary" className="text-xs uppercase tracking-wider font-semibold">
                                Función
                            </Text>
                            <Text className="font-medium text-gray-700">
                                {new Date(showtime.showDate).toString()} • {showtime.startTime.slice(0, 5)} hrs
                            </Text>
                        </div>
                        
                        <div className="flex flex-col text-right">
                            <Text type="secondary" className="text-xs uppercase tracking-wider font-semibold">
                                Termina en
                            </Text>
                            <Text className="font-medium text-blue-600">
                                {getRemainingTime()}
                            </Text>
                        </div>
                    </div>

                    <div className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center mb-8">
                        <Text className="text-lg font-semibold text-gray-700">Total Tickets</Text>
                        <div className="flex items-center gap-4">
                            <Button 
                                shape="circle" 
                                onClick={() => adjustTicketCount(-1)} 
                                disabled={ticketCount <= 1}
                            >
                                -
                            </Button>
                            <Text className="text-xl font-bold w-6 text-center">{ticketCount}</Text>
                            <Button 
                                shape="circle" 
                                onClick={() => adjustTicketCount(1)}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                    <Button 
                        type="primary" 
                        size="large" 
                        block 
                        shape="round"
                        onClick={handlePlaceOrder}
                        loading={isSubmitting}
                        disabled={selectedSeatIds.length !== ticketCount}
                        className="h-14 text-lg font-semibold shadow-md bg-indigo-600 hover:bg-indigo-500"
                    >
                        Confirm and Place Order
                    </Button>
                </div>
            </div>
        </div>
    );
};