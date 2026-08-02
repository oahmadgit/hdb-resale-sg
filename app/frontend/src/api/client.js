import axios from 'axios';

const base = import.meta.env.VITE_API_BASE_URL ?? '';

export const apiClient = axios.create({ baseURL: `${base}/api` });
