import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const createCart = (data) => {
  return axios.post(`${API}/carts`, data);
};