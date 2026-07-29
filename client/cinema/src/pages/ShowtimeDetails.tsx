import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SeatSelector } from '../Components/SeatsSelector';
import { GetShowtimeById, GetSeatsByShowtimeId } from '../api/Showtimes';
import { createTransaction } from '../api/Transaction';
import { useAuth } from '../auth/useAuth';
import { LoginModal } from '../Components/LoginModal';

import type { SeatItem, ShowtimeItem } from '../types';

import { Button, Tag, Typography, message, Spin, Divider, ConfigProvider } from 'antd';
import { PlusCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import { ProfilePage } from '../Components/ProfilePage';

const { Title, Text } = Typography;

export const ShowtimeDetails = () => {
    const { showtimeId } = useParams<{ showtimeId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [showtime, setShowtime] = useState<ShowtimeItem | null>(null);
    const [seats, setSeats] = useState<SeatItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [ticketCount, setTicketCount] = useState<number>(2);
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
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
                <Spin size="large" tip="Loading..." />
            </div>
        );
    }
    
    if (error || !showtime) {
        return <div className="p-10 pt-20 text-center text-red-500 font-medium">{error}</div>;
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

    const formatdate = (fecha: string | Date) => {
        if (!fecha) return "--";

        if (typeof fecha === 'string') {
            const [year, month, day] = fecha.split('-');
            if (!year || !month || !day) return fecha;
            return `${day}/${month}/${year}`;
        }
        const d = fecha as Date;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };
    
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    colorPrimary: '#d4af37',
                    colorBgElevated: '#0f0f12',
                    colorText: '#ffffff',
                    colorTextDescription: '#94a3b8',
                },
                components: {
                    Divider: {
                        colorSplit: 'rgba(212, 175, 55, 0.2)',
                        colorTextHeading: '#d4af37',
                    }
                },
            }}
        >
            <div className="container mx-auto p-4 md:p-8 md:pt-20 flex justify-center font-sans">
                <div className="w-full max-w-5xl bg-[#0f0f12] rounded-2xl shadow-2xl border border-[rgba(212,175,55,0.15)] p-8 md:p-12 flex flex-col lg:flex-row gap-12">
                    
                    <div className="flex-1 w-full pt-5">
                        <SeatSelector 
                            seats={seats}
                            selectedSeatIds={selectedSeatIds}
                            onSeatToggle={handleSeatToggle}
                            maxSelectable={ticketCount}
                        />
                    </div>

                    <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left bg-[#1e1e24] p-8 rounded-2xl border border-[rgba(212,175,55,0.1)] shadow-inner">
                        
                        <div className="w-48 h-72 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] mb-6 bg-[#0f0f12] border border-[rgba(212,175,55,0.2)]">
                            {showtime.poster ? (
                                <img src={showtime.poster} alt={showtime.movie} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#64748b]">No Poster</div>
                            )}
                        </div>

                        <Title 
                            level={2} 
                            className='font-movieName! tracking-widest'
                            style={{ margin: 0, fontWeight: 700, color: '#ffffff' }} >
                                {showtime.movie}
                        </Title>
                        
                        <div className="flex gap-2 mt-3 mb-4">
                            {showtime.room.split(' ')[0].length > 1 && (
                                <Tag className="rounded-full px-3 py-1 font-semibold bg-transparent! border-[#d4af37]! text-[#d4af37]!">
                                    {showtime.room}
                                </Tag>
                            )}
                            <Tag className="rounded-full px-3 py-1 font-semibold bg-[#d4af37]! border-none! text-black!">
                                {showtime.rating || "TBA"}
                            </Tag>
                        </div>

                        <Divider style={{ margin: '12px 0' }} />

                        <div className="w-full flex justify-between items-center mb-6">
                            <div className="flex flex-col">
                                <Text className="text-xs uppercase tracking-wider font-semibold text-[#94a3b8]">
                                    SHOWTIME
                                </Text>
                                <Text className="font-medium text-white">
                                    {formatdate(showtime.showDate)} • {showtime.startTime.slice(0, 5)} hrs
                                </Text>
                            </div>
                            
                            <div className="flex flex-col text-right">
                                <Text className="text-xs uppercase tracking-wider font-semibold text-[#94a3b8]">
                                    ENDS IN
                                </Text>
                                <Text className="font-medium text-[#d4af37]">
                                    {getRemainingTime()}
                                </Text>
                            </div>
                        </div>

                        <div className="w-full bg-[#0f0f12] p-4 rounded-xl border border-[rgba(212,175,55,0.2)] shadow-sm flex justify-between items-center mb-8">
                            <Text className="text-lg font-semibold text-white">Total Tickets</Text>
                            <div className="flex items-center gap-4">
                                <Button 
                                    shape="circle" 
                                    onClick={() => adjustTicketCount(-1)} 
                                    disabled={ticketCount <= 1}
                                    icon={<MinusCircleFilled />}
                                    className="flex! items-center! justify-center! text-lg bg-transparent! border-[#d4af37]! text-[#d4af37]! hover:bg-[#d4af37]! hover:text-black! disabled:opacity-50! disabled:border-gray-500! disabled:text-gray-500! transition-colors"
                                />
                                <Text className="text-xl font-bold w-6 text-center text-white">{ticketCount}</Text>
                                <Button 
                                    shape="circle" 
                                    onClick={() => adjustTicketCount(1)}
                                    disabled={ticketCount >= seats.length}
                                    icon={<PlusCircleFilled />}
                                    className="flex! items-center! justify-center! text-lg bg-transparent! border-[#d4af37]! text-[#d4af37]! hover:bg-[#d4af37]! hover:text-black! transition-colors"
                                />
                            </div>
                        </div>
                        {user ? (
                            user.role === 'Consumer' ? (
                                <button
                                    type="button"
                                    onClick={handlePlaceOrder}
                                    disabled={isSubmitting || selectedSeatIds.length !== ticketCount}
                                    className="w-full h-12 cursor-pointer relative flex items-center justify-center rounded-xl text-black bg-[#d4af37] hover:bg-[#e6c24a] transition-all duration-300 font-bold uppercase tracking-wider text-sm shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <span>
                                        {isSubmitting ? 'Processing...' : 'Confirm and Place Order'}
                                    </span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsProfileOpen(true)}
                                    className="w-full h-12 cursor-pointer relative flex items-center justify-center rounded-xl text-black bg-[#E0E0E0] hover:bg-[#ecebeb] transition-all duration-300 font-bold uppercase tracking-wider text-sm shadow-[0_4px_20px_rgba(196,196,196,0.25)] hover:shadow-[0_4px_25px_rgba(196,196,196,0.45)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <span>
                                        {'LogIn as Consumer to Continue'}
                                    </span>
                                </button>
                            )
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsLoginOpen(true)}
                                className="w-full h-12 cursor-pointer relative flex items-center justify-center rounded-xl text-black bg-[#E0E0E0] hover:bg-[#ecebeb] transition-all duration-300 font-bold uppercase tracking-wider text-sm shadow-[0_4px_20px_rgba(196,196,196,0.25)] hover:shadow-[0_4px_25px_rgba(196,196,196,0.45)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span>
                                    {'LogIn to Continue'}
                                </span>
                            </button>
                        )}
                    </div>
                    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
                    <ProfilePage isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
                </div>
            </div>
        </ConfigProvider>
    );
};