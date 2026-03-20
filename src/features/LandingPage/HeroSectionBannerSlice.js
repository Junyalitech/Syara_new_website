import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API call
export const fetchHeroImages = createAsyncThunk(
  "hero/fetchImages",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/upload`
      );
      return res.data; // assuming array of image URLs
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const heroSlice = createSlice({
  name: "hero",
  initialState: {
    images: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHeroImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchHeroImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default heroSlice.reducer;