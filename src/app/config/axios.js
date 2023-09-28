import * as axios from "axios";
import { API_URL } from "./environment";

axios.default.defaults.baseURL = API_URL;

axios.default.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;
        const mainToken = token?.token?.access_token
        console.log(token?.token?.access_token);

        if(token) {
            config.headers = {
                ...config.headers,
                authorization: `Bearer ${mainToken}`,
                Accept: "application/json"
            };
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export const http = axios.default;
