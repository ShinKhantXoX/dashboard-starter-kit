import { configureStore } from '@reduxjs/toolkit'
import notificationSlice from './notificationSlice'
import drawerSlice from './drawerSlice'

export const store = configureStore({
    reducer: {
        notificaiton: notificationSlice,
        drawer: drawerSlice
    },
})