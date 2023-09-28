import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const initialState = token ? JSON.parse(token) : null;

export const tokenSlice = createSlice({
    name: "Token",
    initialState,
    reducers: {
        setTokenRedux: (state, action) => {
            localStorage.setItem('token', JSON.stringify(action.payload))
            state = action.payload;
            return state;
        }
    }
});

export const { setTokenRedux } = tokenSlice.actions;
// export const tokenState = (state) => state.Token;
export default tokenSlice.reducer;