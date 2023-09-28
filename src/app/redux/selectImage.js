import { createSlice } from "@reduxjs/toolkit";


const initialState = null


export const selectImageSlice = createSlice({
    name : 'bool',
    initialState,
    reducers : {
        boolToggle : (state) => {
            state = !state
            return state;
        },
        setImage : (state,action) => {
            state = action.payload
            return state
        }
    }
})

export const { boolToggle, setImage } = selectImageSlice.actions

export default selectImageSlice.reducer;