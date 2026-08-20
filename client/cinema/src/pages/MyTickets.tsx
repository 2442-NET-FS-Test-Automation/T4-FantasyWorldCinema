import { useState, useMemo, useEffect } from 'react';
import { ConfigProvider, Input, Select, Typography, Empty, message, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TransactionItem } from '../types';
import { getAllTransactionsByUser } from '../api/Transaction';
import { TransactionModal } from '../Components/TransactionModal';

const { Title, Text } = Typography;


export const MyTickets = () => {
    
    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [cinemaFilter, setCinemaFilter] = useState<string | null>(null);

    
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);

                const transactionData = await getAllTransactionsByUser();
                const statusPriority: Record<string, number> = {
                    'Pending': 1,   
                    'Completed': 2, 
                    'Used': 3,      
                    'Expired': 4,   
                    'Cancelled': 5, 
                    'Failed': 6     
                };

                const sortedData = transactionData.sort((a: { status: string | number; transactionId: number; }, b: { status: string | number; transactionId: number; }) => {
                    const priorityA = statusPriority[a.status] || 99;
                    const priorityB = statusPriority[b.status] || 99;
                    
                    if (priorityA === priorityB) {
                        return b.transactionId - a.transactionId; 
                    }
                    
                    return priorityA - priorityB;
                });
                setTransactions(sortedData);
            } catch (err) {
                setError("Transactions couldn't be loaded");
                message.error("Error connecting the server");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, []);

    
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-[#f97316] text-white shadow-[0_0_10px_rgba(249,115,22,0.5)]'; 
            case 'Completed': return 'bg-[#22c55e] text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]'; 
            case 'Used': return 'bg-[#3b82f6] text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'; 
            case 'Cancelled': return 'bg-[#9f1239] text-white shadow-[0_0_10px_rgba(159,18,57,0.5)]'; 
            case 'Expired': return 'bg-[#a855f7] text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'; 
            case 'Failed': return 'bg-[#eab308] text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]'; 
            default: return 'bg-gray-500 text-white';
        }
    };

    
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const matchSearch = tx.movieTitle.toLowerCase().includes(searchQuery.toLowerCase());
            const matchStatus = statusFilter ? tx.status === statusFilter : true;
            const matchCinema = cinemaFilter ? tx.cinemaName === cinemaFilter : true;
            return matchSearch && matchStatus && matchCinema;
        });
    }, [searchQuery, statusFilter, cinemaFilter, transactions]);

    
    const uniqueCinemas = Array.from(new Set(transactions.map(tx => tx.cinemaName)));

    const handleCardClick = (tx: TransactionItem) => {
        setSelectedTransaction(tx);
        setIsModalOpen(true);
        
        console.log("Abrir modal para:", tx);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spin size="large" tip="Loading..." />
            </div>
        );
    }

    if (error) {
        return <div className="p-10 pt-20 text-center text-red-500 font-medium">{error}</div>;
    }

    const handlePaymentSuccess = (transactionId: number) => {
        setTransactions(prevTransactions => 
            prevTransactions.map(tx => 
                tx.transactionId === transactionId 
                    ? { ...tx, status: 'Completed' } 
                    : tx
            )
        );
        
        if (selectedTransaction?.transactionId === transactionId) {
            setSelectedTransaction(prev => prev ? { ...prev, status: 'Completed' } : null);
        }
    };

    const handleRefundSuccess = (transactionId : number) => {
        setTransactions(prevTransactions => 
            prevTransactions.map(tx =>
                tx.transactionId === transactionId
                    ? { ...tx, status: 'Cancelled' }
                    : tx
            )
        );

        if (selectedTransaction?.transactionId === transactionId) {
            setSelectedTransaction(prev => prev ? { ...prev, status: 'Cancelled' } : null);
        }
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

                {filteredTransactions.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
                        {filteredTransactions.map((tx) => (
                            <div 
                                key={tx.transactionId} 
                                className="group flex flex-col gap-3 cursor-pointer"
                                onClick={() => handleCardClick(tx)}
                            >
                                <div className="relative w-full aspect-[2/3] rounded-[24px] overflow-hidden bg-[#1e1e24] shadow-lg border border-[rgba(212,175,55,0.15)] transition-all duration-300 group-hover:border-[#d4af37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] group-hover:-translate-y-1">
                                    
                                    {tx.poster ? (
                                        <img 
                                            src={tx.poster} 
                                            alt={tx.movieTitle} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#64748b]">No Poster</div>
                                    )}

                                    <div className="absolute top-4 inset-x-0 mx-auto w-max z-10">
                                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </div>
                                    
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0f0f12] to-transparent opacity-60" />
                                </div>

                                <div className="text-center px-1">
                                    <Text className="!text-white font-semibold text-sm sm:text-base line-clamp-2 leading-tight transition-colors group-hover:!text-[#d4af37]">
                                        {tx.movieTitle}
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
            <TransactionModal 
                transaction={selectedTransaction as any} 
                open={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onPaymentSuccess={handlePaymentSuccess}
                onRefundSuccess={handleRefundSuccess}
            />
        </ConfigProvider>
    );
};