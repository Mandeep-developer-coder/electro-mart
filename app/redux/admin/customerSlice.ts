import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
interface customerType{
    _id:string
    name:string
    email:string
    phone:string
    avatar?:string
    createdAt:string
}
interface Customer{
    customer:customerType[]
}
const initialState:Customer={
    customer:[]

}
export const getCustomers=createAsyncThunk(
    "name/getCustomers",
    async()=>{
        const res=await fetch("http://localhost:3005/admin/get-customers",{
            method:'Get',
            headers:{'Content-Type':'application/json'},
            
            credentials:"include"
        })
        return await res.json()
    }
)
export const filterCustomer=createAsyncThunk(
    "name/filterCustomer",
    async(search:string)=>{
         const res=await fetch(`http://localhost:3005/admin/filter-customer?search=${encodeURIComponent(search)}`,{
                method:"Get",
                headers:{'Content-Type':'application/json'},
                credentials:"include"
              })
                   const data=await res.json()
                   return data
    }
)
const customerSlice=createSlice({
    name:"customer",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getCustomers.fulfilled,(state,action)=>{
       if (action.payload.success) {
    state.customer = action.payload.customer;
  } else {
    state.customer = [];
  }

        })
        .addCase(filterCustomer.fulfilled,(state,action)=>{
       if (action.payload.success) {
    state.customer = action.payload.customer;
  } else {
    state.customer = [];
  }

        })
    }

})
export default customerSlice.reducer