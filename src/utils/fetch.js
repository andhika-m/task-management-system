import axios from "axios";
import { config } from "../configs";

const api = axios.create({
	baseURL: config.api_dev,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
			console.error('API Error:', error.response || error);
			throw error;
	}
);

// export const login = async (credentials) => {
// 	const response = await api.post("/login", credentials);
// 	if (response.data.token) {
// 		localStorage.setItem("token", response.data.token);
// 		localStorage.setItem("user", JSON.stringify(response.data.user));
// 	}
// 	return response.data;
// };

export const login = async (credentials) => {
	try {
			const response = await api.post("/login", credentials);
			if (response.data.token) {
					localStorage.setItem("token", response.data.token);
					localStorage.setItem("user", JSON.stringify(response.data.user));
			}
			return response.data;
	} catch (error) {
			console.error('Login Error:', error.response?.data || error.message);
			throw error;
	}
};

export const getTasks = async () => {
	const response = await api.get("/tasks");
	return response.data.data || response.data || [];
};

export const createTask = async (taskData) => {
	const response = await api.post("/tasks", taskData);
	return response.data;
};

export const updateTask = async (id, taskData) => {
	const response = await api.put(`/tasks/${id}`, taskData);
	return response.data;
};

export const deleteTask = async (id) => {
	const response = await api.delete(`/tasks/${id}`);
	return response.data;
};
