import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addPaymentMethodAPI } from "./paymentAPI";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// 🔥 ADD PAYMENT METHOD
export const addPaymentMethod = createAsyncThunk(
  "payment/add",
  async ({ id, form }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        type: "card",
        isDefault: false,
        details: form,
      };

      const res = await addPaymentMethodAPI(id, payload, token);

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// add below thunks

// 🔥 GET ALL
export const fetchPaymentMethods = createAsyncThunk(
  "payment/getAll",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/all-payment-methods/${localStorage.getItem("syaraid")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("PAYMENTS API:", res.data); // 🔥 debug

      return res.data.payments; // ✅ FIXED

    } catch (err) {
      console.error("Payment API error:", err);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔥 DELETE
export const removePaymentMethod = createAsyncThunk(
  "payment/remove",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${import.meta.env.VITE_API_URL}/remove-payment-methods/${localStorage.getItem("syaraid")}`, {
        data: { id: id },
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔥 SET DEFAULT
export const setDefaultPayment = createAsyncThunk(
  "payment/setDefault",
  async (paymentId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/set-default-payment-methods/${localStorage.getItem("syaraid")}/${paymentId}`,
        // {
        //   id: paymentId, // ✅ THIS WAS MISSING
        // },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return paymentId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔥 EDIT
export const editPaymentMethod = createAsyncThunk(
  "payment/edit",
  async ({ paymentId, form }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("syaraid");

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/edit-payment-methods/${userId}`,
        {
          id: paymentId,
          type: 'card',
          details: form, // 👈 depends on your backend structure
          isDefault: form.isDefault || false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.payment;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    methods: [],
    loading: false,
    adding: false,
    deletingId: null,
    editingId: null,
    defaultId: null,

    error: null,
    success: null,
  },

  reducers: {
    clearPaymentStatus: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🟢 ADD PAYMENT
      .addCase(addPaymentMethod.pending, (state) => {
        state.adding = true;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.adding = false;
        state.success = "Payment method added successfully";

        // optional: store locally
        state.methods.push(action.meta.arg.form);
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload;
      })

      // ADD THESE

      // 🟢 FETCH
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.methods = action.payload.map((p) => ({
          id: p.id,
          type: p.details.cardType?.toLowerCase(),
          last4: p.details.cardNumber?.slice(-4),
          expiry: p.details.expiry,
          holder: p.details.cardHolder,
          isDefault: p.isDefault,
        }));
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔴 DELETE
      .addCase(removePaymentMethod.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(removePaymentMethod.fulfilled, (state, action) => {
        state.methods = state.methods.filter(m => m.id !== action.payload);
        state.deletingId = null;
      })
      .addCase(removePaymentMethod.rejected, (state) => {
        state.deletingId = null;
      })

      // 🟡 SET DEFAULT
      .addCase(setDefaultPayment.pending, (state, action) => {
        state.defaultId = action.meta.arg;
      })
      .addCase(setDefaultPayment.fulfilled, (state, action) => {
        state.methods = state.methods.map(m => ({
          ...m,
          isDefault: m.id === action.payload
        }));
        state.defaultId = null;
      })
      .addCase(setDefaultPayment.rejected, (state) => {
        state.defaultId = null;
      })

      // 🟣 EDIT
      .addCase(editPaymentMethod.pending, (state, action) => {
        state.editingId = action.meta.arg.paymentId;
      })
      .addCase(editPaymentMethod.fulfilled, (state) => {
        state.editingId = null;
      })
      .addCase(editPaymentMethod.rejected, (state) => {
        state.editingId = null;
      })
  },
});

export const { clearPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;