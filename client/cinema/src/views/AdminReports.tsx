import { useState, useEffect } from 'react';
import { ConfigProvider, Typography, DatePicker, Table, Spin, Card, Statistic, Tag, Alert, Select, InputNumber } from 'antd';
import { DollarOutlined, BookOutlined, BankOutlined, CalendarOutlined, BarChartOutlined } from '@ant-design/icons';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import dayjs from 'dayjs';

import { 
    getTopMoviesReport, getCinemaPerformanceReport, 
    getOccupancyRatesReport, getTransactionStatusReport 
} from '../api/Reports';

import { getCinemasWithUsed } from '../api/Cinema';
import type { MovieRevenueDto, CinemaRevenueDto, OccupancyRateDto, TransactionStatusSummaryDto, CinemaItem } from '../types';

const { Title, Text } = Typography;

const STATUS_COLORS: Record<string, string> = {
    'Completed': '#22c55e',
    'Pending': '#f97316',
    'Used': '#3b82f6',
    'Cancelled': '#9f1239',
    'Expired': '#a855f7',
    'Failed': '#eab308'
};

export const AdminReports = () => {
    const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs().subtract(30, 'days'));
    const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs());
    
    // Nuevos estados para los parámetros
    const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
    const [movieLimit, setMovieLimit] = useState<number>(5);
    const [activeCinemas, setActiveCinemas] = useState<{data: CinemaItem[], loading: boolean, error: boolean}>({ data: [], loading: true, error: false });

    const [moviesData, setMoviesData] = useState<{data: MovieRevenueDto[], loading: boolean, error: boolean}>({ data: [], loading: true, error: false });
    const [cinemasData, setCinemasData] = useState<{data: CinemaRevenueDto[], loading: boolean, error: boolean}>({ data: [], loading: true, error: false });
    const [occupancyData, setOccupancyData] = useState<{data: OccupancyRateDto[], loading: boolean, error: boolean}>({ data: [], loading: true, error: false });
    const [transactionsData, setTransactionsData] = useState<{data: TransactionStatusSummaryDto[], loading: boolean, error: boolean}>({ data: [], loading: true, error: false });

    // 1. Fetch Cinemas & Transactions (solo dependen de las fechas)
    useEffect(() => {
        if (!startDate || !endDate) return;
        const start = startDate.format('YYYY-MM-DD');
        const end = endDate.format('YYYY-MM-DD');

        const fetchCinemas = async () => {
            setCinemasData(prev => ({ ...prev, loading: true, error: false }));
            try {
                const res = await getCinemaPerformanceReport(start, end);
                setCinemasData({ data: res, loading: false, error: false });
            } catch {
                setCinemasData(prev => ({ ...prev, loading: false, error: true }));
            }
        };

        const fetchTransactions = async () => {
            setTransactionsData(prev => ({ ...prev, loading: true, error: false }));
            try {
                const res = await getTransactionStatusReport(start, end);
                setTransactionsData({ data: res, loading: false, error: false });
            } catch {
                setTransactionsData(prev => ({ ...prev, loading: false, error: true }));
            }
        };

        fetchCinemas();
        fetchTransactions();
    }, [startDate, endDate]);

    // 2. Fetch Top Movies (depende de fechas y del límite)
    useEffect(() => {
        if (!startDate || !endDate) return;
        const start = startDate.format('YYYY-MM-DD');
        const end = endDate.format('YYYY-MM-DD');

        const fetchMovies = async () => {
            setMoviesData(prev => ({ ...prev, loading: true, error: false }));
            try {
                const res = await getTopMoviesReport(start, end, movieLimit);
                setMoviesData({ data: res, loading: false, error: false });
            } catch {
                setMoviesData(prev => ({ ...prev, loading: false, error: true }));
            }
        };
        
        fetchMovies();
    }, [startDate, endDate, movieLimit]);

    // 3. Fetch Occupancy (depende de fechas y del cine seleccionado)
    useEffect(() => {
        if (!startDate || !endDate) return;
        const start = startDate.format('YYYY-MM-DD');
        const end = endDate.format('YYYY-MM-DD');

        const fetchOccupancy = async () => {
            setOccupancyData(prev => ({ ...prev, loading: true, error: false }));
            try {
                const res = await getOccupancyRatesReport(start, end, selectedCinemaId);
                setOccupancyData({ data: res, loading: false, error: false });
            } catch {
                setOccupancyData(prev => ({ ...prev, loading: false, error: true }));
            }
        };

        fetchOccupancy();
    }, [startDate, endDate, selectedCinemaId]);

    // 4. Fetch Active Cinemas (Se ejecuta solo una vez al montar)
    useEffect(() => {
        const fetchActiveCinemas = async () => {
            setActiveCinemas(prev => ({ ...prev, loading: true, error: false }));
            try {
                const res = await getCinemasWithUsed();
                setActiveCinemas({ data: res, loading: false, error: false });
            } catch {
                setActiveCinemas(prev => ({ ...prev, loading: false, error: true }));
            }
        };

        fetchActiveCinemas();
    }, []); // <-- El arreglo vacío significa "ejecutar solo una vez"

    const totalGlobalRevenue = cinemasData.data.reduce((acc, curr) => acc + curr.totalRevenue, 0);
    const totalGlobalTickets = moviesData.data.reduce((acc, curr) => acc + curr.ticketsSold, 0);

    const cinemaColumns = [
        { title: 'Cinema Name', dataIndex: 'cinemaName', key: 'cinemaName', render: (text: string) => <Text className="text-white! font-semibold">{text}</Text> },
        { title: 'Total Transactions', dataIndex: 'totalTransactions', key: 'totalTransactions', align: 'center' as const },
        { 
            title: 'Total Revenue', 
            dataIndex: 'totalRevenue', 
            key: 'totalRevenue',
            align: 'right' as const,
            render: (val: number) => <Text className="text-[#d4af37]! font-bold">${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text> 
        },
    ];

    const occupancyColumns = [
        { title: 'Movie', dataIndex: 'movieTitle', key: 'movieTitle' },
        { title: 'Date', dataIndex: 'showDate', key: 'showDate', render: (date: string) => new Date(date).toLocaleDateString() },
        { title: 'Capacity', dataIndex: 'totalCapacity', key: 'totalCapacity', align: 'center' as const },
        { title: 'Sold', dataIndex: 'soldSeats', key: 'soldSeats', align: 'center' as const },
        { 
            title: 'Occupancy', 
            dataIndex: 'occupancyPercentage', 
            key: 'occupancyPercentage',
            align: 'right' as const,
            render: (val: number) => (
                <Tag color={val > 80 ? '#22c55e' : val > 40 ? '#f97316' : '#ef4444'} className="m-0! border-none font-bold">
                    {val}%
                </Tag>
            )
        },
    ];
    console.log(selectedCinemaId);
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgElevated: '#1e1e24',
                    colorText: '#ffffff',
                    colorTextPlaceholder: '#64748b',
                    colorPrimary: '#d4af37',
                    colorBgContainer: '#0f0f12', 
                    colorBorder: 'rgba(212, 175, 55, 0.2)',
                    colorFillAlter: '#1e1e24', 
                    controlItemBgHover: 'rgba(212, 175, 55, 0.15)',
                    colorPrimaryBg: 'rgba(212, 175, 55, 0.1)',
                },
                components: {
                    Table: {
                        colorBgContainer: '#0f0f12',
                        headerBg: '#1e1e24',
                        headerColor: '#d4af37',
                        borderColor: 'rgba(212, 175, 55, 0.15)',
                        rowHoverBg: 'rgba(212, 175, 55, 0.05)',
                    },
                    Card: {
                        colorBgContainer: '#1e1e24',
                        colorBorderSecondary: 'rgba(212, 175, 55, 0.2)',
                    },
                    DatePicker: {
                        colorBgContainer: '#0f0f12',
                        hoverBg: '#1e1e24',
                        activeBg: '#1e1e24',
                    },
                    Select: {
                        colorBgContainer: '#0f0f12',
                        selectorBg: '#0f0f12',
                    },
                    InputNumber: {
                        colorBgContainer: '#0f0f12',
                        hoverBg: '#1e1e24',
                    }
                }
            }}
        >
            <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto font-sans">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-[rgba(212,175,55,0.2)] pb-6">
                    <div>
                        <Title level={2} className="text-[#d4af37]! m-0! uppercase tracking-widest">
                            Command Center
                        </Title>
                        <Text className="text-[#94a3b8]!">Business Intelligence & Operations</Text>
                    </div>

                    <div className="flex items-center gap-4 bg-[#1e1e24] p-2 rounded-xl border border-[rgba(212,175,55,0.2)] shadow-lg">
                        <DatePicker 
                            value={startDate}
                            onChange={(date) => date && setStartDate(date)}
                            className="border-none! shadow-none! bg-transparent! w-35"
                            allowClear={false}
                            format="MMM DD, YYYY"
                            suffixIcon={<CalendarOutlined style={{ color: '#ffffff' }} />}
                            
                        />
                        <Text className="text-[#64748b]!">-</Text>
                        <DatePicker 
                            value={endDate}
                            onChange={(date) => date && setEndDate(date)}
                            className="border-none! shadow-none! bg-transparent! w-35"
                            allowClear={false}
                            format="MMM DD, YYYY"
                            suffixIcon={<CalendarOutlined style={{ color: '#ffffff' }} />}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card bordered className="shadow-lg hover:-translate-y-1 transition-transform duration-300">
                            {cinemasData.loading ? <Spin /> : cinemasData.error ? <Text className="text-red-500!">Data Unavailable</Text> : (
                                <Statistic title={<span className="text-[#64748b] uppercase tracking-wider text-xs font-bold">Total Revenue</span>} value={totalGlobalRevenue} precision={2} prefix={<DollarOutlined className="text-[#d4af37]" />} valueStyle={{ color: '#ffffff', fontSize: '2rem', fontWeight: 'bold' }} />
                            )}
                        </Card>
                        <Card bordered className="shadow-lg hover:-translate-y-1 transition-transform duration-300">
                            {moviesData.loading ? <Spin /> : moviesData.error ? <Text className="text-red-500!">Data Unavailable</Text> : (
                                <Statistic title={<span className="text-[#64748b] uppercase tracking-wider text-xs font-bold">Tickets Sold</span>} value={totalGlobalTickets} prefix={<BookOutlined className="text-[#d4af37]" />} valueStyle={{ color: '#ffffff', fontSize: '2rem', fontWeight: 'bold' }} />
                            )}
                        </Card>
                        <Card bordered className="shadow-lg hover:-translate-y-1 transition-transform duration-300">
                            {cinemasData.loading ? <Spin /> : cinemasData.error ? <Text className="text-red-500!">Data Unavailable</Text> : (
                                <Statistic title={<span className="text-[#64748b] uppercase tracking-wider text-xs font-bold">Active Cinemas</span>} value={cinemasData.data.length} prefix={<BankOutlined className="text-[#d4af37]" />} valueStyle={{ color: '#ffffff', fontSize: '2rem', fontWeight: 'bold' }} />
                            )}
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Box Office con selector de límite */}
                        <div className="bg-[#1e1e24] p-6 rounded-2xl border border-[rgba(212,175,55,0.2)] shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <Title level={4} className="text-[#d4af37]! m-0! uppercase tracking-widest text-sm flex items-center gap-2">
                                    <BarChartOutlined /> Box Office Performance
                                </Title>
                                <div className="flex items-center gap-2">
                                    <Text className="text-xs text-[#64748b] uppercase tracking-wider">Top:</Text>
                                    <InputNumber 
                                        min={3} 
                                        max={10} 
                                        value={movieLimit} 
                                        onChange={(val) => val && setMovieLimit(val)}
                                        className="w-15"
                                        controls={{
                                            upIcon:'#52c41a',
                                            downIcon: '#ff4d4f'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="h-87.5 w-full flex items-center justify-center">
                                {moviesData.loading ? <Spin size="large" /> : moviesData.error ? (
                                    <Alert message="Failed to load Box Office Performance" type="error" showIcon className="bg-red-950 border-red-800 text-red-200" />
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={moviesData.data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                            <XAxis dataKey="movieTitle" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                                            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                            <RechartsTooltip cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }} contentStyle={{ backgroundColor: '#0f0f12', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#d4af37', fontWeight: 'bold' }} />
                                            <Bar dataKey="totalRevenue" name="Revenue ($)" fill="#d4af37" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#1e1e24] p-6 rounded-2xl border border-[rgba(212,175,55,0.2)] shadow-lg">
                            <Title level={4} className="text-[#d4af37]! m-0! mb-6! uppercase tracking-widest text-sm">
                                Transaction Status Distribution
                            </Title>
                            <div className="h-87.5 w-full flex items-center justify-center">
                                {transactionsData.loading ? <Spin size="large" /> : transactionsData.error ? (
                                    <Alert message="Failed to load Transaction Statuses" type="error" showIcon className="bg-red-950 border-red-800 text-red-200" />
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={transactionsData.data} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} stroke="none">
                                                {transactionsData.data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#64748b'} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip contentStyle={{ backgroundColor: '#0f0f12', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#fff' }} />
                                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94a3b8' }}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div className="bg-[#1e1e24] p-6 rounded-2xl border border-[rgba(212,175,55,0.2)] shadow-lg overflow-hidden flex flex-col justify-center">
                            <Title level={4} className="text-[#d4af37]! m-0! mb-6! uppercase tracking-widest text-sm">
                                Cinema Revenue
                            </Title>
                            {cinemasData.loading ? <Spin className="py-10" /> : cinemasData.error ? (
                                <Alert message="Failed to load Cinema Revenues" type="error" showIcon className="bg-red-950 border-red-800 text-red-200" />
                            ) : (
                                <Table dataSource={cinemasData.data} columns={cinemaColumns} rowKey="cinemaId" pagination={{ pageSize: 5, position: ['bottomCenter'] }} className="custom-dark-table" />
                            )}
                        </div>

                        {/* Ocupación con selector de Cine */}
                        <div className="bg-[#1e1e24] p-6 rounded-2xl border border-[rgba(212,175,55,0.2)] shadow-lg overflow-hidden flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-6">
                                <Title level={4} className="text-[#d4af37]! m-0! uppercase tracking-widest text-sm flex items-center gap-2">
                                    <CalendarOutlined /> Daily Occupancy Rates
                                </Title>
                                <Select 
                                    value={selectedCinemaId}
                                    onChange={(value) => setSelectedCinemaId(value)}
                                    placeholder="Select Cinema"
                                    className="w-45"
                                    loading={activeCinemas.loading} // <-- Muestra un spinner nativo
                                    disabled={activeCinemas.loading || activeCinemas.error}
                                    options={[
                                        { value: null, label: 'All Cinemas' },
                                        ...activeCinemas.data.map(cinema => ({
                                            value: cinema.cinema_Id ?? (cinema as any).cinemaId,
                                            label: cinema.cinemaName
                                        }))
                                    ]}
                                />
                            </div>
                            
                            {/* Quitamos la alerta de "Please select a cinema" para que la tabla se muestre siempre */}
                            {occupancyData.loading ? (
                                <Spin className="py-10" /> 
                            ) : occupancyData.error ? (
                                <Alert message="Failed to load Occupancy Rates" type="error" showIcon className="bg-red-950 border-red-800 text-red-200" />
                            ) : (
                                <Table 
                                    dataSource={occupancyData.data} 
                                    columns={occupancyColumns} 
                                    rowKey={(record) => `${record.movieTitle}-${record.cinemaName}-${record.showDate}`} 
                                    pagination={{ pageSize: 5, position: ['bottomCenter'] }} 
                                    className="custom-dark-table" 
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};