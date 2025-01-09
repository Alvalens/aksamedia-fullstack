import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:8000/api/",
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
	(response) => response, 
	(error) => {
		if (error.response && error.response.status === 401) {

			localStorage.removeItem("user");
			localStorage.removeItem("token");

			window.location.href = "/"; 
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
