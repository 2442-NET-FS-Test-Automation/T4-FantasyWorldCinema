import React from 'react';
import type { SeatItem } from '../types';
import { MdEventSeat } from 'react-icons/md';

interface SeatSelectorProps {
  seats: SeatItem[];
  selectedSeatIds: number[];
  onSeatToggle: (seatId: number) => void;
  maxSelectable: number; 
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  seats,
  selectedSeatIds,
  onSeatToggle,
  maxSelectable
}) => {
  // Agrupar los asientos por fila
  const rows = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, SeatItem[]>);

  const sortedRowKeys = Object.keys(rows).sort();
  const seatsLeft = maxSelectable - selectedSeatIds.length;

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto font-sans">
      
      {/* Encabezado Limpio */}
      <div className="flex justify-between items-end mb-4 px-2">
        <h3 className="text-xl font-semibold text-gray-800 tracking-tight">Select your seats</h3>
        <span className={`text-sm font-medium px-3 py-1 rounded-full transition-colors duration-300 ${
          seatsLeft === 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
        }`}>
          {seatsLeft} left
        </span>
      </div>

      {/* Contenedor Principal (Estilo Tarjeta Moderna) */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 flex flex-col items-center transition-all">
        
        {/* Pantalla Rediseñada (Estilo Brillo/Luz) */}
        <div className="w-full max-w-xs flex flex-col items-center mb-12">
          <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-indigo-300 to-transparent rounded-full shadow-[0_4px_15px_rgba(99,102,241,0.4)]"></div>
          <span className="text-[10px] font-bold text-gray-400 tracking-[0.3em] mt-4">SCREEN</span>
        </div>

        {/* Cuadrícula de Asientos */}
        <div className="flex flex-col gap-4">
          {sortedRowKeys.map((rowKey) => (
            <div key={rowKey} className="flex items-center gap-6">
              
              {/* Etiqueta de Fila */}
              <span className="w-4 text-sm font-bold text-gray-400 text-center select-none">
                {rowKey}
              </span>

              {/* Fila de Asientos */}
              <div className="flex gap-3 sm:gap-4">
                {rows[rowKey].sort((a, b) => parseInt(a.number) - parseInt(b.number)).map((seat) => {
                  
                  const occupied = seat.isFree !== 0;
                  const selected = selectedSeatIds.includes(seat.seat_Id);
                  const disableUnselected = seatsLeft <= 0 && !selected;
                  const disabled = occupied || disableUnselected;

                  return (
                    <button
                      key={seat.seat_Id}
                      onClick={() => onSeatToggle(seat.seat_Id)}
                      disabled={disabled}
                      aria-label={`Seat ${seat.row}${seat.number}`}
                      className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md transition-transform duration-200"
                    >
                      <MdEventSeat 
                        className={`
                          text-3xl sm:text-4xl transition-all duration-300 ease-out
                          ${occupied 
                            ? 'text-rose-900 cursor-not-allowed' 
                            : selected
                              ? 'text-indigo-600 scale-110 drop-shadow-md cursor-pointer'
                              : disableUnselected
                                ? 'text-gray-200 opacity-60 cursor-not-allowed'
                                : 'text-gray-300 hover:text-indigo-400 hover:scale-105 cursor-pointer'
                          }
                        `} 
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Leyenda con Íconos */}
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <MdEventSeat className="text-gray-300 text-xl" /> 
          <span className="text-xs font-semibold text-gray-500">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <MdEventSeat className="text-indigo-600 text-xl" /> 
          <span className="text-xs font-semibold text-gray-500">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <MdEventSeat className="text-rose-900 text-xl" /> 
          <span className="text-xs font-semibold text-gray-500">Occupied</span>
        </div>
      </div>

    </div>
  );
};