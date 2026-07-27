import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SeatSelector } from '../Components/SeatsSelector';
import { GetShowtimeById, GetSeatsByShowtimeId } from '../api/Showtimes';
import { createTransaction } from '../api/Transaction';
import type { SeatItem, ShowtimeItem } from '../types';

export const ShowtimeDetails = () => {
    const { showtimeId } = useParams<{ showtimeId: string }>();
    const navigate = useNavigate();

    // Estados para la data del backend
    const [showtime, setShowtime] = useState<ShowtimeItem | null>(null);
    const [seats, setSeats] = useState<SeatItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para la orden (basados en tu boceto)
    const [ticketCount, setTicketCount] = useState<number>(2); // Por defecto 2, como en el dibujo
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Carga inicial de datos
    useEffect(() => {
        const fetchDetails = async () => {
            if (!showtimeId) return;
            try {
                setLoading(true);
                const id = parseInt(showtimeId);
                
                // 1. Primero obtenemos la función.
                // Aquí el backend nos debe responder con el roomId en el JSON
                const showtimeData = await GetShowtimeById(id);
                setShowtime(showtimeData);

                // 2. Protegemos el código en caso de que el backend no devuelva el roomId
                if (!showtimeData.room_Id) {
                    throw new Error("El backend no devolvió el roomId de esta función.");
                }

                // 3. Ahora que sabemos la sala, pedimos la disponibilidad de asientos
                const seatsData = await GetSeatsByShowtimeId(id, showtimeData.room_Id);
                setSeats(seatsData);
            } catch (err) {
                setError("No se pudo cargar la información de la función.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [showtimeId]);
    // console.log(showtime);
    // console.log(seats);
    // Lógica para agregar/quitar asientos en el selector
    const handleSeatToggle = (seatId: number) => {
        setSelectedSeatIds((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId); // Deseleccionar
            }
            if (prev.length < ticketCount) {
                return [...prev, seatId]; // Seleccionar si hay espacio
            }
            return prev; // No hacer nada si ya se alcanzó el límite
        });
    };

    // Lógica para los botones de + y - en "Total Tickets"
    const adjustTicketCount = (delta: number) => {
        const newCount = Math.max(1, ticketCount + delta); // Mínimo 1 boleto
        setTicketCount(newCount);

        // UX: Si reducen la cantidad de boletos por debajo de los asientos que ya habían seleccionado,
        // recortamos el arreglo para quitar el último asiento seleccionado.
        if (selectedSeatIds.length > newCount) {
            setSelectedSeatIds(prev => prev.slice(0, newCount));
        }
    };

    const handlePlaceOrder = async () => {
        if (!showtimeId || selectedSeatIds.length !== ticketCount) {
            alert(`Por favor selecciona exactamente ${ticketCount} asientos.`);
            return;
        }

        setIsSubmitting(true);
        try {
            console.log(selectedSeatIds);
            const response = await createTransaction({
                showtimeId: parseInt(showtimeId),
                seatIds: selectedSeatIds
            });
            console.log(response);
            
            // Si tu backend devuelve el ID de la transacción, podemos redirigir al recibo
            navigate(`/user/my-tickets`); 
        } catch (err) {
            alert("Ocurrió un error al procesar tu orden. Los asientos podrían estar ocupados.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-xl">Cargando sala...</div>;
    if (error || !showtime) return <div className="p-10 text-center text-red-600 font-bold">{error}</div>;
    return (
        <div className="container mx-auto p-4 md:p-20 flex justify-center">
            {/* Contenedor principal estilo tarjeta (mapeado a tu boceto) */}
            <div className="w-full max-w-4xl bg-white border-4 border-black p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center md:items-start rounded-md shadow-lg">
                
                {/* LADO IZQUIERDO: El componente SeatSelector */}
                <div className="flex-1 w-full">
                    <SeatSelector 
                        seats={seats}
                        selectedSeatIds={selectedSeatIds}
                        onSeatToggle={handleSeatToggle}
                        maxSelectable={ticketCount}
                    />
                </div>

                {/* LADO DERECHO: Resumen de la Orden */}
                <div className="flex-1 w-full flex flex-col items-center text-center gap-6 md:mt-10">
                    
                    {/* Recuadro de la Película */}
                    <div className="w-40 h-56 border-4 border-black bg-gray-100 flex items-center justify-center overflow-hidden">
                        {showtime.posterUrl ? (
                            <img src={showtime.posterUrl} alt={showtime.movie} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400 font-medium">Poster
                                
                            </span>
                        )}
                    </div>

                    {/* Título y Tipo de Sala */}
                    <div>
                        <h2 className="text-2xl font-bold">{showtime.movie}</h2>
                        <p className="text-lg font-medium text-gray-700">{showtime.room}</p>
                    </div>

                    {/* Selector de Tickets */}
                    <div className="flex items-center gap-4 text-lg font-semibold mt-4">
                        <span>Total Tickets</span>
                        <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-md border-2 border-black">
                            <button 
                                onClick={() => adjustTicketCount(-1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition-colors rounded-full"
                            >
                                -
                            </button>
                            <span className="w-4 text-center">{ticketCount}</span>
                            <button 
                                onClick={() => adjustTicketCount(1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition-colors rounded-full"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Botón de Orden */}
                    <button
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting || selectedSeatIds.length !== ticketCount}
                        className={`
                            mt-6 px-10 py-3 border-4 border-black font-bold text-xl rounded-full transition-all duration-200
                            ${(isSubmitting || selectedSeatIds.length !== ticketCount)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400' 
                                : 'bg-white hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1'
                            }
                        `}
                    >
                        {isSubmitting ? 'Procesando...' : 'Place Order'}
                    </button>
                </div>

            </div>
        </div>
    );
};