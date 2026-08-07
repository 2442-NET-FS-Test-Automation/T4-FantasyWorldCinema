import type { 
    MovieRevenueDto, 
    CinemaRevenueDto, 
    OccupancyRateDto, 
    TransactionStatusSummaryDto 
} from '../types';
import {api} from './axios';

export const getTopMoviesReport = async (startDate: string, endDate: string, limit: number = 5): Promise<MovieRevenueDto[]> => {
    const response = await api.get(`Reports/top-movies?startDate=${startDate}&endDate=${endDate}&limit=${limit}`);
    if (response.status !== 200) throw new Error("Error fetching top movies");
    return response.data;
};

export const getCinemaPerformanceReport = async (startDate: string, endDate: string): Promise<CinemaRevenueDto[]> => {
    const response = await api.get(`Reports/cinema-performance?startDate=${startDate}&endDate=${endDate}`);
    if (response.status !== 200) throw new Error("Error fetching cinema performance");
    return response.data;
};

export const getOccupancyRatesReport = async (startDate: string, endDate: string, cinemaId: number | null): Promise<OccupancyRateDto[]> => {
    
    let endpoint = `Reports/occupancy-rates?startDate=${startDate}&endDate=${endDate}`;
    if (cinemaId) {
        endpoint += `&cinemaId=${cinemaId}`;
    }

    const response = await api.get(endpoint);
    if (response.status !== 200) throw new Error("Error fetching occupancy rates");
    return response.data;
};

export const getTransactionStatusReport = async (startDate: string, endDate: string): Promise<TransactionStatusSummaryDto[]> => {
    const response = await api.get(`Reports/transaction-status?startDate=${startDate}&endDate=${endDate}`);
    if (response.status !== 200) throw new Error("Error fetching transaction status");
    return response.data;
};

export const getTotalTicketsSold = async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get(`Reports/total-tickets-sold?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
}

export const getTotalRevenue = async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get(`Reports/total-revenue?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
}