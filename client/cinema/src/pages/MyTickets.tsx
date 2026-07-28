import React, { useState, useMemo } from 'react';
import { ConfigProvider, Input, Select, Typography, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// 1. Interfaces preparadas para tu Backend
export interface TransactionItem {
    transaction_Id: number;
    movieName: string;
    poster: string;
    cinemaName: string;
    status: 'Pending' | 'Completed' | 'Used' | 'Cancelled' | 'Expired' | 'Failed';
}

// Datos de prueba para previsualizar el diseño
const mockTransactions: TransactionItem[] = [
    { transaction_Id: 1, movieName: "Dune: Part Two", poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2IGpbRXYS.jpg", cinemaName: "FAWO Guadalajara", status: "Completed" },
    { transaction_Id: 2, movieName: "Deadpool & Wolverine", poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", cinemaName: "FAWO Zapopan", status: "Pending" },
    { transaction_Id: 3, movieName: "Oppenheimer", poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", cinemaName: "FAWO CDMX", status: "Used" },
    { transaction_Id: 4, movieName: "Spider-Man: Across the Spider-Verse", poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", cinemaName: "FAWO Monterrey", status: "Cancelled" },
    { transaction_Id: 5, movieName: "The Batman", poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", cinemaName: "FAWO Guadalajara", status: "Expired" },
    { transaction_Id: 6, movieName: "Interstellar", poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MvrIdQSt.jpg", cinemaName: "FAWO Zapopan", status: "Failed" },
];

export const MyTickets = () => {
    // Estados para los filtros
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [cinemaFilter, setCinemaFilter] = useState<string | null>(null);

    // Estado para el modal futuro
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Diccionario de colores basado en tu boceto, adaptado al tema oscuro
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-[#f97316] text-white shadow-[0_0_10px_rgba(249,115,22,0.5)]'; // Naranja
            case 'Completed': return 'bg-[#22c55e] text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]'; // Verde
            case 'Used': return 'bg-[#3b82f6] text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'; // Azul
            case 'Cancelled': return 'bg-[#9f1239] text-white shadow-[0_0_10px_rgba(159,18,57,0.5)]'; // Rojo oscuro
            case 'Expired': return 'bg-[#a855f7] text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'; // Morado
            case 'Failed': return 'bg-[#eab308] text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]'; // Amarillo
            default: return 'bg-gray-500 text-white';
        }
    };

    // Lógica de filtrado en tiempo real
    const filteredTransactions = useMemo(() => {
        return mockTransactions.filter(tx => {
            const matchSearch = tx.movieName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchStatus = statusFilter ? tx.status === statusFilter : true;
            const matchCinema = cinemaFilter ? tx.cinemaName === cinemaFilter : true;
            return matchSearch && matchStatus && matchCinema;
        });
    }, [searchQuery, statusFilter, cinemaFilter]);

    // Extraer cines únicos para el dropdown de filtros
    const uniqueCinemas = Array.from(new Set(mockTransactions.map(tx => tx.cinemaName)));

    const handleCardClick = (tx: TransactionItem) => {
        setSelectedTransaction(tx);
        setIsModalOpen(true);
        // Aquí conectaremos el modal más adelante
        console.log("Abrir modal para:", tx);
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgElevated: '#1e1e24',
                    colorText: '#ffffff',
                    colorTextPlaceholder: '#64748b',
                    colorPrimary: '#d4af37',
                    colorPrimaryHover: '#d4af37',
                },
                components: {
                    Input: {
                        colorBgContainer: '#1e1e24',
                        colorBorder: 'rgba(212, 175, 55, 0.3)',
                    },
                    Select: {
                        colorBgContainer: '#1e1e24',
                        colorBorder: 'rgba(212, 175, 55, 0.3)',
                        optionSelectedBg: 'rgba(212, 175, 55, 0.25)',
                        optionSelectedColor: '#d4af37',
                        controlItemBgHover: 'rgba(212, 175, 55, 0.15)',
                    }
                }
            }}
        >
            <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto font-sans">
                
                {/* HEADER Y ÁREA DE FILTROS */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-12 border-b border-[rgba(212,175,55,0.2)] pb-6">
                    
                    <Title level={2} className="!text-[#d4af37] !m-0 uppercase tracking-widest whitespace-nowrap">
                        My Tickets
                    </Title>

                    <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-4">
                        <Input
                            placeholder="Search movie..."
                            prefix={<SearchOutlined className="text-[#64748b]" />}
                            className="w-full sm:w-[250px] !rounded-xl"
                            size="large"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            allowClear
                        />
                        
                        <Select
                            placeholder="Filter by Status"
                            className="w-full sm:w-[180px] [&_.ant-select-selector]:!rounded-xl"
                            size="large"
                            allowClear
                            onChange={(value) => setStatusFilter(value)}
                            options={[
                                { value: 'Pending', label: 'Pending' },
                                { value: 'Completed', label: 'Completed' },
                                { value: 'Used', label: 'Used' },
                                { value: 'Cancelled', label: 'Cancelled' },
                                { value: 'Expired', label: 'Expired' },
                                { value: 'Failed', label: 'Failed' },
                            ]}
                        />

                        <Select
                            placeholder="Filter by Cinema"
                            className="w-full sm:w-[220px] [&_.ant-select-selector]:!rounded-xl"
                            size="large"
                            allowClear
                            onChange={(value) => setCinemaFilter(value)}
                            options={uniqueCinemas.map(cinema => ({ value: cinema, label: cinema }))}
                        />
                    </div>
                </div>

                {/* GRID DE TRANSACCIONES */}
                {filteredTransactions.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
                        {filteredTransactions.map((tx) => (
                            <div 
                                key={tx.transaction_Id} 
                                className="group flex flex-col gap-3 cursor-pointer"
                                onClick={() => handleCardClick(tx)}
                            >
                                {/* CONTENEDOR DEL PÓSTER */}
                                <div className="relative w-full aspect-[2/3] rounded-[24px] overflow-hidden bg-[#1e1e24] shadow-lg border border-[rgba(212,175,55,0.15)] transition-all duration-300 group-hover:border-[#d4af37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] group-hover:-translate-y-1">
                                    
                                    {tx.poster ? (
                                        <img 
                                            src={tx.poster} 
                                            alt={tx.movieName} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#64748b]">No Poster</div>
                                    )}

                                    {/* ETIQUETA DE ESTADO (Flotante arriba al centro) */}
                                    <div className="absolute top-4 inset-x-0 mx-auto w-max z-10">
                                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </div>
                                    
                                    {/* Gradiente sutil inferior para estética */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0f0f12] to-transparent opacity-60" />
                                </div>

                                {/* NOMBRE DE LA PELÍCULA */}
                                <div className="text-center px-1">
                                    <Text className="!text-white font-semibold text-sm sm:text-base line-clamp-2 leading-tight transition-colors group-hover:!text-[#d4af37]">
                                        {tx.movieName}
                                    </Text>
                                    <Text className="!text-[#64748b] text-xs mt-1 block line-clamp-1">
                                        {tx.cinemaName}
                                    </Text>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-70">
                        <Empty 
                            description={<span className="text-[#94a3b8] text-lg">No tickets found</span>} 
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                )}

            </div>
        </ConfigProvider>
    );
};