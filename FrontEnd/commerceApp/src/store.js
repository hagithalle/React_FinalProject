import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./dl/Slices/authSlice"; // Correctly import the auth reducer
import usersReducer from "./dl/Slices/usersSlice"; // Correctly import the users reducer
import categoriesReducer from "./dl/Slices/categoriesSlice";
import productsReducer from "./dl/Slices/productsSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,  // Assign the correct imported reducer
        users: usersReducer, // Assign the correct imported reducer
        categories: categoriesReducer, // Assigning the categories reducer
        products: productsReducer
    }
});