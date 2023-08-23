import { createSlice } from '@reduxjs/toolkit';

const initialState = false;

const drawerSlice = createSlice({
    name: "DRAWER",
    initialState,
    reducers: {
        drawerOpen: (state, action) => {
            state = true;
            return state;
        },
        drawerClose: (state) => {
            state = false
            return state;
        },
        drawerToggle : (state) => {
            state = !state
            return state;
        }
    }
});

export const { drawerOpen, drawerToggle } = drawerSlice.actions;
export const drawerState = (state) => state.DRAWER;
export default drawerSlice.reducer;