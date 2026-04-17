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
          productId: item.productId || null,
          quantity: item.quantity || null,
          package: item.package || null,
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
        package: pkg,
        price,
        productName,
        image,
        Pack1kgprice,
        Pack500gprice,
      } = action.payload;

      const existing = state.items.find(
        (i) => i.id === productId && i.package === pkg
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          id: productId,
          quantity,
          package: pkg,
          price,
          productName,
          image,
          Pack1kgprice,   // ✅ ADD THIS
          Pack500gprice,  // ✅ ADD THIS
        });
      }
    },

    // 🔥 UPDATE QTY
    updateQty: (state, action) => {
      const { productId, package: pkg, quantity } = action.payload;

      const item = state.items.find(
        (i) => i.id === productId && i.package === pkg
      );

      if (item) item.quantity = quantity;
    },

    // 🔥 REMOVE ITEM
    removeItem: (state, action) => {
      const { productId, package: pkg } = action.payload;

      state.items = state.items.filter(
        (i) => !(i.id === productId && i.package === pkg)
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
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        const cart = action.payload;
        state.loading = false;
        state.cartId = cart?.cartId || null;

        state.items =
          cart?.products?.map((p) => ({
            id: p.productId || p.id,
            quantity: p.quantity || p.qty,
            productName: p.productName,
            price: p.price,
            package: p.package,
            image: p.image,
            Pack1kgprice: p.Pack1kgprice,
            Pack500gprice: p.Pack500gprice,
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