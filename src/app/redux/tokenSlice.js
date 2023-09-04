import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

export const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state = action.payload;
            return state;
        }
    }
});

export const { setToken } = tokenSlice.actions;
export default tokenSlice.reducer;