import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { orderDetail } from "../orderDetail/orderDetailSlice";
interface Addresses{
    name:string,
    phone:string,
    street:string,
    city:string,
    state:string,
    country:string,
    zip:string
}
interface UserType{
    _id:string,
    name:string,
    email:string,
    phone:string,
    avatar:string,
    createdAt:string,
    addresses:Addresses[]
    
}
interface Items{
    productId:string,
    title:string,
    price:number,
    quantity:number
}
interface orderType{
    _id:string,
    items:Items[],
    totalAmount:number,
    paymentMethod:string,
    paymentStatus:string,
    orderStatus:string,
    createdAt:string
}
interface customerDetail{
    user:UserType|null,
    order:orderType[],

}
const initialState:customerDetail={
    user:null,
    order:[]
}
export const customerDetail=createAsyncThunk(
    "name/customerDetail",
    async(id:string)=>{
        const res=await fetch(`http://localhost:3005/admin/customer-detail/${id}`,{
            method:"Get",
            headers:{'Content-Type':'application/json'},
            credentials:"include"

        })
        const data=await res.json()
        return data

    }
)
export const updateOrderStatus=createAsyncThunk(
    "name/updateOrderStatus",
    async({orderId,orderStatus}:{orderId:string,orderStatus:string})=>{
        const res=await fetch(`http://localhost:3005/admin/update-status/${orderId}`,{
            method:'PATCH',
            headers:{'Content-Type':"application/json"},
            credentials:"include",
            body:JSON.stringify({orderStatus})
        })
        const data=await res.json()
        return data
    }
)
const customerDetailSlice=createSlice({
    name:"customerDetail",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(customerDetail.fulfilled,(state,action)=>{
            state.user=action.payload.user,
            state.order=action.payload.order
        })
        .addCase(updateOrderStatus.fulfilled,(state,action)=>{
           const updateOrder=action.payload
           const index=state.order.findIndex((item)=>item._id==updateOrder._id)
           if(index!==-1){
             state.order[index].orderStatus=updateOrder.orderStatus
           }
        })
    }
})
export default customerDetailSlice.reducer