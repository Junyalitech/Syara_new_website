import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const addPaymentMethodAPI = (id, data, token) => {
  return axios.post(
    `${API}/add-payment-methods/${localStorage.getItem('syaraid')}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};