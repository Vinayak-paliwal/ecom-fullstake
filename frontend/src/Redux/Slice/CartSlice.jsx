import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = `${import.meta.env.VITE_API_KEY}/cart`;

const initialState = {
    cart: [],
    quantity: 0,
    token: localStorage.getItem('token') || null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

export const fetchCartItems = createAsyncThunk("cart/fetchCartItems", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error fetching cart items");
    }
});

export const addToCart = createAsyncThunk("cart/addCartItem", async (item, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, item, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error adding item to cart");
    }
});

export const removeFromCart = createAsyncThunk("cart/removeCartItem", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error removing item from cart");
    }
});

export const clearCartAPI = createAsyncThunk("cart/clearCart", async (userId, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/clear/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return [];
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
    }
});

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        },
        clearToken: (state) => {
            state.token = null;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartItems.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.cart = action.payload;
                state.quantity = action.payload.length;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.quantity = action.payload.length;
                toast.success("Item added to cart");
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.quantity = action.payload.length;
                toast.success("Item removed from cart");
            })
            .addCase(clearCartAPI.fulfilled, (state) => {
                state.cart = [];
                state.quantity = 0;
            });
    }
});

export const { setToken, clearToken } = cartSlice.actions;
export default cartSlice.reducer;
