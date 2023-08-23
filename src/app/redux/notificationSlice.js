import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const notificationSlice = createSlice({
    name: "NOTIFICATION",
    initialState,
    reducers: {
        updateNotification: (state, action) => {
            state = action.payload;
            return state;
        }
    }
});

export const { updateNotification } = notificationSlice.actions;
export const notificationState = (state) => state.NOTIFICATION;
export default notificationSlice.reducer;