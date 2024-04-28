import type { AxiosResponse } from 'axios';

import { axiosInstance } from './axios';

interface ApiParams {
	route: string;
	token?: string;
	data?: Record<string, unknown> | null;
	image?: FormDataEntryValue | null;
}

export const API = {
	// eslint-disable-next-line
	get: async (params: ApiParams): Promise<any> => {
		try {
			const response: AxiosResponse = await axiosInstance.get(params.route, {
				headers: params.token ? { Authorization: `Bearer ${params.token}` } : undefined
			});
			return response.data;
			// eslint-disable-next-line
		} catch (error: any) {
			throw new Error(error.response.data || 'An error occurred');
		}
	},

	// eslint-disable-next-line
	post: async (params: ApiParams): Promise<any> => {
		try {
			const response: AxiosResponse = await axiosInstance.post(params.route, params.data, {
				headers: params.token ? { Authorization: `Bearer ${params.token}` } : undefined
			});
			return response;
			// eslint-disable-next-line
		} catch (error: any) {
			return Promise.reject(error);
		}
	},

	// eslint-disable-next-line
	put: async (params: ApiParams): Promise<any> => {
		try {
			const response: AxiosResponse = await axiosInstance.put(params.route, params.data, {
				headers: params.token ? { Authorization: `Bearer ${params.token}` } : undefined
			});
			return response.data;
			// eslint-disable-next-line
		} catch (error: any) {
			throw new Error(error.response.data || 'An error occurred');
		}
	},

	// eslint-disable-next-line
	delete: async (params: ApiParams): Promise<any> => {
		try {
			const response: AxiosResponse = await axiosInstance.delete(params.route, {
				headers: params.token ? { Authorization: `Bearer ${params.token}` } : undefined,
				data: params.data
			});
			return response.data;
			// eslint-disable-next-line
		} catch (error: any) {
			throw new Error(error.response.data || 'An error occurred');
		}
	}
};
