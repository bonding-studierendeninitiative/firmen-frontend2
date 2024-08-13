import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

export const axiosInstance: AxiosInstance = axios.create({
	baseURL: 'https://backend-firmen5.bunnyenv.com/api/v2', // Assuming VITE_BASE_API is defined elsewhere
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

axiosInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		// Handle success
		return response;
	},
	(error) => {
		// Handle error
		return Promise.reject(error);
	}
);
