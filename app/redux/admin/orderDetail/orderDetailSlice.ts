import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

interface Product {
  _id: string;
  images: string[];
}

interface ItemType {
  productId: Product;
  title: string;
  price: number;
  quantity: number;
}

interface UserType {
  _id: string;
  email: string;
  name: string;
}

interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}
interface statusHistoryType{
  status:string,
  date:string
}

interface OrderType {
  _id: string;
  userId: UserType;
  items: ItemType[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  orderStatus: string;
  statusHistory:statusHistoryType
}
interface OrderDetailState {
  order: OrderType | null;
  rating:number | null

}

const initialState: OrderDetailState = {
  order: null,
  rating :null

};

export const orderDetail=createAsyncThunk(
    "name/orderDetail",
    async(id:string)=>{
        const res=await fetch(`http://localhost:3005/admin/order-detail/${id}`,{
            method:"Get",
            headers:{'Content-Type':'application/json'},
            credentials:"include"
        })
        const data=await res.json()
        return data
    }

)
const orderDetailSlice=createSlice({
    name:"orderDetail",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(orderDetail.fulfilled,(state,action)=>{
            state.order=action.payload.order
        })
    }


})
export default orderDetailSlice.reducer