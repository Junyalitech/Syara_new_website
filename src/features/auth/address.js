import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const updateAddress = createAsyncThunk(
    "user/updateAddress",
    async ({ address }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.put(
                `${API}/update-address/${localStorage.getItem("syaraid")}`,
                {
                    updateaddress: address, // 👈 backend expects this
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ FETCH ADDRESSES
export const fetchAddresses = createAsyncThunk(
    "address/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("syaraid");

            const res = await axios.get(
                `${API}/fetch-addresses/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return res.data.addresses || res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ DELETE ADDRESS
export const deleteAddress = createAsyncThunk(
    "address/delete",
    async (index, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `${API}/delete-addresses/${localStorage.getItem('syaraid')}`,
                {
                    data: { index },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return index;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const addressSlice = createSlice({
    name: "address",
    initialState: {
        list: [],
        loading: false,
        deletingIndex: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // 🔵 FETCH
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(updateAddress.pending, (state) => {
                state.loading = true;
            })


            .addCase(updateAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Address updated successfully";

                // optional: store address in profile
                // if (state.profile) {
                //     state.profile.address = action.meta.arg.address;
                // }
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🔴 DELETE
            .addCase(deleteAddress.pending, (state, action) => {
                state.deletingIndex = action.meta.arg; // 👈 index store karo
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.list.splice(action.payload, 1);
                state.deletingIndex = null;
            })
            .addCase(deleteAddress.rejected, (state) => {
                state.deletingIndex = null;
            })
    },
});

export default addressSlice.reducer;