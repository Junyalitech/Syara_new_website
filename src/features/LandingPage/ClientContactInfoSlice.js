import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchContactInfo = createAsyncThunk(
  "footer/fetchContact",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/contact-info/api`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const footerSlice = createSlice({
  name: "footer",
  initialState: {
    contact: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContactInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.contact = action.payload;
      })
      .addCase(fetchContactInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default footerSlice.reducer;