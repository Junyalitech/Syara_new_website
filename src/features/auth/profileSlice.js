import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// 🔥 FETCH PROFILE
export const fetchProfile = createAsyncThunk(
    "user/profile",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(`${API}/profile/${localStorage.getItem("syaraid")}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 🔥 EDIT PROFILE
export const updateProfile = createAsyncThunk(
    "user/updateProfile",
    async ({ id, data }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.put(
                `${API}/profile/edit/${localStorage.getItem("syaraid")}`,
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);


// 🔥 CHANGE PASSWORD
export const changePassword = createAsyncThunk(
    "user/changePassword",
    async ({ id, data }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.put(
                `${API}/profile/change-password/${localStorage.getItem("syaraid")}`,
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);


const userSlice = createSlice({
    name: "user",
    initialState: {
        profile: null,
        loading: false,
        error: null,
        success: null,
    },

    reducers: {
        clearStatus: (state) => {
            state.error = null;
            state.success = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // 🔵 FETCH
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🟢 UPDATE PROFILE
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.success = "Profile updated successfully";
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🟣 CHANGE PASSWORD
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
                state.success = "Password changed successfully";
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            
    },
});

export const { clearStatus } = userSlice.actions;
export default userSlice.reducer;