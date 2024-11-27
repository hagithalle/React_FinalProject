import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "../Services/categorieService"

const initialState = {
    categories: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
};

export const getAllCategories = createAsyncThunk(
    "categories/getAll",
    async (token, thunkAPI) => {
        try {
            console.log("Slice getAllCategories:",token, thunkAPI)
            return await categoryService.getAllCategories(token);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const addCategory = createAsyncThunk(
    "categories/add",
    async ({ category, token }, thunkAPI) => {
        try {
            console.log(category, token)
            return await categoryService.createNewCategory(category, token);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const updateCategory = createAsyncThunk(
    "categories/update",
    async ({id,category, token }, thunkAPI) => {
        try {
            return await categoryService.updateCategory(id,category, token);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "categories/delete",
    async ({ id, token }, thunkAPI) => {
        try {
            return await categoryService.deleteCategory(id, token);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

const categoriesSlice = createSlice({
    name: "categories",
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
            .addCase(getAllCategories.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message
                state.categories = action.payload.data;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                console.log("New category added:", action.payload.data);
                if (action.payload.success) {
                    // Ensure that you are updating the state with the new category data
                    state.categories.push(action.payload.data);
                    console.log("update current categoris:",state.categories)

                }
            })
            .addCase(addCategory.rejected, (state, action)=>{ 
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload.message
            })
            
            .addCase(updateCategory.fulfilled, (state, action) => {
                if (action.payload.success) {
                    const index = state.categories.findIndex(cat => cat._id === action.payload.data._id);
                    if (index !== -1) {
                        state.categories[index] = action.payload.data;
                    }
                }
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.categories = state.categories.filter(cat => cat._id !== action.payload.data._id);
                }
            })
            .addCase(deleteCategory.rejected, (state, action)=>{ 
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload.message
            })
    }
});

export const { reset } = categoriesSlice.actions;
export default categoriesSlice.reducer;