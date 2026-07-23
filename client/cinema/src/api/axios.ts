import axios from "axios";
import { getToken } from "../auth/storage";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5062/api"
});

/* Request interceptor to atack JWT token every call */
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});