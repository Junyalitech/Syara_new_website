import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API call
export const fetchTwoBanners = createAsyncThunk(
  "twoBanner/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/gettwoBanner`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching banners");
    }
  }
);

const twoBannerSlice = createSlice({
  name: "twoBanner",
  initialState: {
    banners: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTwoBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTwoBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchTwoBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default twoBannerSlice.reducer;