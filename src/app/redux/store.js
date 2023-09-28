import { createStore } from '@reduxjs/toolkit'
import { applyMiddleware } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

const thunkMiddleware = require("redux-thunk").default;

const enhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));

export const store = createStore(rootReducer, enhancer)

// export const store = configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware({
//         serializableCheck: false
//     })
// })
