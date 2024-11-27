import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productsService from "../Services/productsService";

const initialState = {
    products: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
};

// Thunk to fetch all products
export const getAllProducts = createAsyncThunk(
    "/products",
    async (token, thunkAPI) => {
        try {
            return await productsService.getAllProducts(token);
        } catch (err) {
            const msg = (err.response && err.response.data && err.response.data.message) ||
                err.message || err.toString();
            return thunkAPI.rejectWithValue({
                message: msg,
                status: err.response ? err.response.status : 500
            });
        }
    }
);

// Thunk to add a new product
export const addProduct = createAsyncThunk(
    "products/add",
    async ({ product, token }, thunkAPI) => {
        try {
            return await productsService.createNewProduct(product, token);
        } catch (err) {
            const msg = (err.response && err.response.data && err.response.data.message) ||
                err.message || err.toString();
            return thunkAPI.rejectWithValue({
                message: msg,
                status: err.response ? err.response.status : 500
            });
        }
    }
);


export const updateProductAfterPurchase = createAsyncThunk(
    "products/updateAfterPurchase",
    async ({ cart, token }, thunkAPI) => {
        console.log("products/updateAfterPurchase:", cart, token)
        try {
            // Assuming productsService.updateProductAfterPurchase expects cart and token
            const response = await productsService.updateProductAfterPurchase(cart, token);
            return response.data;
        } catch (err) {
            const msg = (err.response && err.response.data && err.response.data.message) ||
                err.message || err.toString();
            return thunkAPI.rejectWithValue({
                message: msg,
                status: err.response ? err.response.status : 500
            });
        }
    }
);

// Thunk to update a product
export const updateProduct = createAsyncThunk(
    "products/update",
    async ({ product, token }, thunkAPI) => {
        try {
            return await productsService.updateProduct(product, token);
        } catch (err) {
            const msg = (err.response && err.response.data && err.response.data.message) ||
                err.message || err.toString();
            return thunkAPI.rejectWithValue({
                message: msg,
                status: err.response ? err.response.status : 500
            });
        }
    }
);

export const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                console.log("getAllProducts action.payload:", action.payload);
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
                state.products = action.payload.data;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload.message;
                state.products = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                console.log("addProduct action.payload:", action.payload);
                if (action.payload.success) {
                    state.message = action.payload.message;
                    state.isSuccess = true;
                    state.isError = false;
                }
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload.message;
            })
            .addCase(updateProductAfterPurchase.fulfilled, (state, action) => {
                console.log("updateProductAfterPurchase action.payload:", action.payload);
                if (action.payload.success) {
                    // Update products after purchase
                    state.products = state.products.map(product =>
                        product._id === action.payload.data._id ? action.payload.data : product
                    );
                    state.message = action.payload.message;
                    state.isSuccess = true;
                }
            })
            .addCase(updateProductAfterPurchase.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload.message;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                console.log("updateProduct action.payload:", action.payload);
                if (action.payload.success) {
                    const index = state.products.findIndex(product => product._id === action.payload.data._id);
                    if (index !== -1) {
                        state.products[index] = action.payload.data;
                    }
                    state.message = action.payload.message;
                    state.isSuccess = true;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload.message;
            })
          
    }
});

export const { reset } = productsSlice.actions;
export default productsSlice.reducer;