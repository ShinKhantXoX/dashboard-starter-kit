import { combineReducers } from "@reduxjs/toolkit";
import notificationSlice from './notificationSlice'
import drawerSlice from './drawerSlice'
import  selectImageSlice  from "./selectImage";
import tokenSlice from "./tokenSlice";


export const rootReducer = combineReducers({
    notificaiton: notificationSlice,
    drawer: drawerSlice,
    imageSelect : selectImageSlice,
    tokenCheck : tokenSlice
})