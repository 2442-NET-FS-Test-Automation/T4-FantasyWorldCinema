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
      
      {/* Encabezado Adaptado al Tema Oscuro */}
      <div className="flex justify-between items-end mb-4 px-2">
        <h3 className="text-xl font-semibold text-white tracking-tight">Select your seats</h3>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors duration-300 ${
          seatsLeft === 0 
            ? "bg-[#d4af37] text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]" 
            : "bg-transparent border border-[#d4af37] text-[#d4af37]"
        }`}>
          {seatsLeft} left
        </span>
      </div>

      {/* Contenedor Principal (Fondo oscuro con borde dorado sutil) */}
      <div className="bg-[#1e1e24] rounded-2xl shadow-inner border border-[rgba(212,175,55,0.15)] p-8 sm:p-10 flex flex-col items-center transition-all">
        
        {/* Pantalla Rediseñada (Brillo Dorado) */}
        <div className="w-full max-w-xs flex flex-col items-center mb-12">
          <div className="w-full h-1.5 bg-linear-to-r from-transparent via-[#d4af37] to-transparent rounded-full shadow-[0_4px_15px_rgba(212,175,55,0.4)]"></div>
          <span className="text-[10px] font-bold text-[#64748b] tracking-[0.3em] mt-4">SCREEN</span>
        </div>

        {/* Cuadrícula de Asientos */}
        <div className="flex flex-col gap-4">
          {sortedRowKeys.map((rowKey) => (
            <div key={rowKey} className="flex items-center gap-6">
              
              {/* Etiqueta de Fila */}
              <span className="w-4 text-sm font-bold text-[#94a3b8] text-center select-none">
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
                      className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded-md transition-transform duration-200"
                    >
                      <MdEventSeat 
                        className={`
                          text-3xl sm:text-4xl transition-all duration-300 ease-out
                          ${occupied 
                            ? 'text-rose-900/60 cursor-not-allowed' 
                            : selected
                              ? 'text-[#d4af37] scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] cursor-pointer'
                              : disableUnselected
                                ? 'text-[#64748b] opacity-40 cursor-not-allowed'
                                : 'text-[#94a3b8] hover:text-[#d4af37] hover:scale-105 cursor-pointer'
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
      
      {/* Leyenda con Íconos (Colores Actualizados) */}
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <MdEventSeat className="text-[#94a3b8] text-xl" /> 
          <span className="text-xs font-semibold text-[#64748b]">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <MdEventSeat className="text-[#d4af37] text-xl drop-shadow-[0_0_4px_rgba(212,175,55,0.6)]" /> 
          <span className="text-xs font-semibold text-[#64748b]">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <MdEventSeat className="text-rose-900/60 text-xl" /> 
          <span className="text-xs font-semibold text-[#64748b]">Occupied</span>
        </div>
      </div>

    </div>
  );
};