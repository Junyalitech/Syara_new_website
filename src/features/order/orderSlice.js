import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// 🔥 FETCH ORDERS API
export const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async ({ userId, page }, thunkAPI) => {
        try {
            const res = await axios.get(`${API}/api/getorders/${userId}?page=${page}`);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

const ordersSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        loading: false,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;

                // ✅ ONLY store raw orders (NO mapping)
                state.orders = action.payload.orders || [];
                state.totalPages = action.payload.totalPages;

            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default ordersSlice.reducer;