import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getUser = createAsyncThunk("auth/getUser", async (id) => {
  const response = await fetch(`${import.meta.env.VITE_API_KEY}/auth/${id}`);

  console.log("response",response);
  
  return response.json();
});

const getUserSlice = createSlice({
  name: "userInfo",
  initialState: {
    user: null,
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.user = null;
    });
  },
});

// export const {addToCart,removeFromCart,setToken,clearToken} = cartSystem.actions;
export default getUserSlice.reducer;
