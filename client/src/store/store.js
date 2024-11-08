import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import adminProductsSlice from './admin-slice/products-slice'

const store = configureStore({
    reducer:{
        auth:authReducer,
        adminProducts: adminProductsSlice,
    },
});

export default store;
