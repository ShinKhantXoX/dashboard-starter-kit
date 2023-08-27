import { combineReducers } from "@reduxjs/toolkit";
import notificationSlice from './notificationSlice'
import drawerSlice from './drawerSlice'
import  selectImageSlice  from "./selectImage";


export const rootReducer = combineReducers({
    notificaiton: notificationSlice,
    drawer: drawerSlice,
    imageSelect : selectImageSlice,
})