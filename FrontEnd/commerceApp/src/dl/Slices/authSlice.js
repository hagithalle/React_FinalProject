import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../Services/authServices";
import { act } from "react";

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
};

export const authLogin = createAsyncThunk(
    "/users/login",
    async (user, thunkAPI) => {
        try {
            return await authService.login(user);
        } catch (err) {
            console.log(err);
            const msg = (err.response && err.response.data && err.response.data.message) ||
                err.message || err.toString();
            return thunkAPI.rejectWithValue({
                message: msg,
                status: err.response?.status
            });
        }
    }
);

export const authRegister = createAsyncThunk(
    "/users/register",
    async (user, thunkAPI) => {
        try {
            return await authService.register(user);
        } catch (err) {
            console.log(err);
            const msg = (err.response && err.response.data && err.response.data.message) ||
                err.message || err.toString();
            return thunkAPI.rejectWithValue({
                message: msg,
                status: err.response?.status
            });
        }
    }
);

export const authLogOut = createAsyncThunk("/user/logout", () => {
    authService.logOut();
});

export const authSlice = createSlice({
    name: "auth",
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
        .addCase(authLogin.pending, (state) => { state.isLoading = true; })
            .addCase(authLogin.fulfilled, (state, action) => {
                console.log(action.payload)
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
                state.user = action.payload.user;
            })
            .addCase(authLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload.message;
                state.user = null
            })
            .addCase(authRegister.pending, (state) => { state.isLoading = true; })
            .addCase(authRegister.fulfilled, (state, action) => {
                console.log(action.payload)
                state.isLoading = false;
                state.isSuccess = true;
                console.log(action.payload)
                // Add a check for action.payload.message
                state.message = action.payload.message || 'Registration successful';
                
            })
            .addCase(authRegister.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload.message;
            })
            .addCase(authLogOut.fulfilled, (state) => {
                state.user = null;
            });
            
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;