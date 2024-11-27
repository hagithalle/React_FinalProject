import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import userService from "../Services/usersServices";
import authService from "../Services/authServices"

const initialState ={
    users: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    currentUser: null
};

export const getAllUsers = createAsyncThunk(
    "/users",
async (token, thunkAPI)=>{
    try{
        return await userService.getAllUsers(token);
    }
    catch(err){
        console.log(err)
        const msg = (err.response && err.response.data && err.response.data.message) ||
         err.message || err.toString;
         return thunkAPI.rejectWithValue({
            message: msg,
            statuse: err.response.status
         }) 
    }
})

export const getUserById = createAsyncThunk(
    "users/getById",
    async ({userId, token}, thunkAPI) => {
        try {
            return await userService.getUserById(userId, token);
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

export const addUser = createAsyncThunk(
    "users/add",
    async ({ user}, thunkAPI) => {
        try {
            console.log(user, token);
            return await userService.createNewUser(user);
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

export const updateUser = createAsyncThunk(
    "users/update",
    async ({ user, token }, thunkAPI) => {
        try {
            return await userService.updateUser(user, token);
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

export const updateUserAfterPurchase = createAsyncThunk(
    "users/updateAfterPurchase",
    async ({ userId, purchasedProducts, token }, thunkAPI) => {
        try {
            return await userService.updateUserAfterPurchase(userId, purchasedProducts, token);
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

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers:{
        reset: (state)=>{
            state.isError= false,
            state.isSuccess= false,
            state.isLoadin =false,
            state.message =""
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(getAllUsers.pending, (state)=>{state.isLoading = true})
        .addCase(getAllUsers.fulfilled, (state, action)=>{ 
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message,
            state.users = action.payload.data
        })
        .addCase(getAllUsers.rejected, (state, action)=>{ 
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message,
            state.users = null 
            if(action.payload.state == 401)
                authService.logOut()
        })
        .addCase(addUser.fulfilled, (state, action) => {
            console.log("addUser action.paylod:", action.payload)
            if (action.payload.success) {
                // Ensure that you are updating the state with the new category data
                state.users.push(action.payload.data);
                state.message = action.payload.message
                state.isSuccess = true
                state.isError = false
            }
        })
        .addCase(addUser.rejected, (state, action)=>{ 
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message
        })
        
        .addCase(updateUser.fulfilled, (state, action) => {
            if (action.payload.success) {
                console.log("updateUser action.paylod:", action.payload)
                const index = state.users.findIndex(cat => cat._id === action.payload.data._id);
                state.isError = false;
                state.isSuccess = true;
                state.message = action.payload.message
                if (index !== -1) {
                    state.users[index] = action.payload.data;
                }
            }
        })
        .addCase(updateUser.rejected, (state, action)=>{ 
            console.log(state, action)
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message
        })
        // Add handlers for the new thunk
        .addCase(getUserById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getUserById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
            // Optionally, store the specific user data separately if needed
            state.currentUser = action.payload.data;
        })
        .addCase(getUserById.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
            state.currentUser = null
        })
        .addCase(updateUserAfterPurchase.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateUserAfterPurchase.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            const index = state.users.findIndex(user => user._id === action.payload._id);
            if (index !== -1) {
                state.users[index] = action.payload; // Update the user with new purchased products
            }
        })
        .addCase(updateUserAfterPurchase.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload.message;
        });

    }
})


export const {reset} = usersSlice.actions;
export default usersSlice.reducer
    