import React from 'react';
import type { SeatItem } from '../types';

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
  // 2. Agrupar los asientos por fila (A, B, C...)
  const rows = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, SeatItem[]>);

  const sortedRowKeys = Object.keys(rows).sort();

  // Cuántos asientos faltan por seleccionar
  const seatsLeft = maxSelectable - selectedSeatIds.length;

  return (
    <div className="flex flex-col w-full max-w-md">
      {/* Encabezado: Instrucciones y Contador */}
      <div className="flex justify-between items-end mb-2 px-2 font-medium">
        <span>Select your seats</span>
        <span className={seatsLeft === 0 ? "text-green-600 font-bold" : "text-gray-600"}>
          {seatsLeft} left
        </span>
      </div>

      {/* Contenedor Principal de la Sala */}
      <div className="border-4 border-black p-6 rounded-md bg-white shadow-sm flex flex-col items-center">
        
        {/* Representación visual de la Pantalla */}
        <div className="w-3/4 h-8 border-t-4 border-black rounded-t-[50%] mb-10 relative">
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-400 font-semibold tracking-widest">
            SCREEN
          </span>
        </div>

        {/* Cuadrícula de Asientos */}
        <div className="flex flex-col gap-3">
          {sortedRowKeys.map((rowKey) => (
            <div key={rowKey} className="flex items-center gap-4">
              {/* Etiqueta de la Fila (A, B, C...) */}
              <span className="w-4 font-bold text-lg text-center">{rowKey}</span>

              {/* Botones de Asientos */}
              <div className="flex gap-2">
                {/* Parseamos el 'number' a int para ordenamiento numérico seguro */}
                {rows[rowKey].sort((a, b) => parseInt(a.number) - parseInt(b.number)).map((seat) => {
                  
                  // 3. Nueva lógica de ocupación basada en isFree (1 = Libre, 0 = Ocupado)
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
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-sm transition-all duration-200
                        flex items-center justify-center text-xs font-semibold
                        ${occupied 
                          ? 'bg-gray-400 border-gray-500 cursor-not-allowed' 
                          : selected
                            ? 'bg-blue-600 border-blue-700 text-white shadow-inner scale-95'
                            : disableUnselected
                              ? 'bg-white border-gray-300 opacity-50 cursor-not-allowed'
                              : 'bg-white border-black hover:bg-blue-100 cursor-pointer'
                        }
                      `}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Leyenda de colores */}
      <div className="flex justify-center gap-6 mt-4 text-sm font-medium text-gray-600">
        <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-black bg-white rounded-sm"></div> Available</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-blue-700 bg-blue-600 rounded-sm"></div> Selected</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-gray-500 bg-gray-400 rounded-sm"></div> Occupied</div>
      </div>
    </div>
  );
};