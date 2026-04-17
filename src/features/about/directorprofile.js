import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API call
export const fetchDirector = createAsyncThunk(
  "director/fetchDirector",
  async () => {
    const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/director-profile/api`
    );
    return res.data.data[0]; // because array hai
  }
);

const directorSlice = createSlice({
  name: "director",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDirector.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDirector.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default directorSlice.reducer;