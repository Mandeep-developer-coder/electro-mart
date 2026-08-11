import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
import productsReducer from "./products/productSlice";
// import cartButton from "./cart/cartButton"
import cartSlice from "./cart/cartSlice"
import orderSlice from "./orders/orderSlice"
import addressSlice from "./address/addressSlice"
import customerSlice from "./admin/customerSlice"
import customerDetail from "./admin/customerDetail/customerDetailSlice"
import orderDetail from "./admin/orderDetail/orderDetailSlice"
export const store=configureStore({
    reducer:{
        products:productsReducer,
        auth:authReducer,
        // cartButtons:cartButton,
        cart:cartSlice,
        address:addressSlice,
        order:orderSlice,
        customer:customerSlice,
        customerDetail:customerDetail,
        orderDetail:orderDetail

    }
    
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;