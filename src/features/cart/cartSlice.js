import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// ✅ FETCH CART (ONLY ON LOAD)
export const fetchUserCart = createAsyncThunk(
  "cart/fetch",
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(`${API}/user/${userId}`);
      return res.data?.[0];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ BULK UPDATE (ONLY ON DRAWER CLOSE)
export const syncCartAPI = createAsyncThunk(
  "cart/sync",
  async ({ userId, items }, thunkAPI) => {
    try {
      await axios.put(`${API}/update-cart-inbulk/${localStorage.getItem("syaraid")}`, {
        items: items.map((item) => ({
          productId: item.productId ?? item.id ?? null,
          variantId: item.variantId ?? null,
          quantity: item.quantity ?? null,
          package: item.package ?? null,
          price: item.price ?? null,
          stock: item.stock ?? null,
        })),
      });
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🟢 CREATE CART (FIRST TIME)
export const createCartAPI = createAsyncThunk(
  "cart/create",
  async (cartData, thunkAPI) => {
    try {
      const res = await axios.post(`${API}/carts`, cartData);
      return res.data.cart;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    cartId: null,
    loading: false,
  },

  reducers: {
    // 🔥 ADD ITEM (NO API)
    addItem: (state, action) => {
      const {
        productId,
        quantity,
        variantId,
        package: pkg,
        price,
        productName,
        image,
        stock,
      } = action.payload;

      const existing = state.items.find(
        (i) =>
          Number(i.id ?? i.productId) === Number(productId) &&
          String(i.variantId ?? i.package) === String(variantId ?? pkg)
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          id: productId,
          productId,
          variantId,
          quantity,
          package: pkg,
          price,
          productName,
          image,
          stock
        });
      }
    },

    // 🔥 UPDATE QTY
    updateQty: (state, action) => {
      const { productId, variantId, package: pkg, quantity } = action.payload;

      const item = state.items.find(
        (i) =>
          Number(i.id ?? i.productId) === Number(productId) &&
          String(i.variantId ?? i.package) === String(variantId ?? pkg)
      );

      if (item) item.quantity = quantity;
    },

    // 🔥 REMOVE ITEM
    removeItem: (state, action) => {
      const { productId, variantId, package: pkg } = action.payload;

      state.items = state.items.filter(
        (i) =>
          !(
            Number(i.id ?? i.productId) === Number(productId) &&
            String(i.variantId ?? i.package) === String(variantId ?? pkg)
          )
      );
    },

    // 🔥 CLEAR CART (after order)
    clearCart: (state) => {
      state.items = [];
    },

    setCartItems: (state, action) => {
      state.items = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(syncCartAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncCartAPI.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(syncCartAPI.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        const cart = action.payload;
        state.loading = false;
        state.cartId = cart?.cartId || null;

        state.items =
          cart?.products?.map((p) => ({
            id: p.productId || p.id,
            productId: p.productId || p.id,
            variantId: p.variantId ?? null,
            quantity: p.quantity ?? p.qty ?? 1,
            productName: p.productName,
            price: p.price,
            package: p.package,
            image: p.image,
            stock: p.stock,
          })) || [];
      });
  },
});

export const {
  addItem,
  updateQty,
  removeItem,
  clearCart,
  setCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;