import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
interface OrderItemType {

  productId: {
    _id: string;
    title: string;
    images: string[];
    price: number;
  };
  title: string;   
  price: number;       
  quantity: number;
}
interface OrderType {
  _id: string;
  items: OrderItemType[];
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'CARD'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  orderStatus: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  statusHistory:[{
    status:string,
    date:string
  }]
}
interface OrdersState {
  orders: OrderType[];
  
  
}

const initialState: OrdersState = {
  orders: [],
 

};
export const getOrders=createAsyncThunk(
    "name/getOrders",
    async()=>{
        const res=await fetch("http://localhost:3005/order/get-order",{
            method:"Get",
            headers:{'Content-Type':"application/json"},
            credentials:"include",
        
        })
        const data=await res.json()
        return data.orders
    }
)
const orderSlice=createSlice({
    name:"order",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getOrders.fulfilled,(state,action)=>{
            state.orders=action.payload
        })
    }
})
export default orderSlice.reducer


