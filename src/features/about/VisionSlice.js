import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchVision = createAsyncThunk(
    "vision/fetch",
    async (_, thunkAPI) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/our-mission/api`
            );
            return res.data.data[0];
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

const visionSlice = createSlice({
    name: "vision",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVision.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchVision.fulfilled, (state, action) => {
                state.loading = false;

                // ✅ handle both object & array
                state.data = Array.isArray(action.payload)
                    ? action.payload[0]
                    : action.payload;
            })
            .addCase(fetchVision.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default visionSlice.reducer;