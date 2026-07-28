import {api} from './axios';
import type { CreateTransactionItem } from '../types';


export const createTransaction = async (data: CreateTransactionItem) => {
    const response = await api.post('/Transactions', data);
    return response.data;
};