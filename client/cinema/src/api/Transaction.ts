import {api} from './axios';
import type { CreateTransactionItem } from '../types';


export const createTransaction = async (data: CreateTransactionItem) => {
    const response = await api.post('/Transactions', data);
    return response.data;
};

export const getAllTransactionsByUser = async () => {
    const response = await api.get(`/Transactions/user/`);
    return response.data;
}

export const payTransaction = async (transactionId : number) => {
    const response = await api.patch(`/Transactions/user/${transactionId}`);
    return response.data;
}

export const refundTransaction = async (transactionId : number) => {
    const response = await api.patch(`/Transactions/user/cancelled/${transactionId}`);
    return response.status;
}