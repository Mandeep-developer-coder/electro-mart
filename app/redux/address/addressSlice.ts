import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
interface addressType{
    _id:string
    name:string
    phone:string
    street:string
    city:string
    state:string
    country:string
    zip:string
}
interface Address{
    address:addressType[],
    selectedAddress:addressType|null
}
const initialState:Address={
    address:[],
    selectedAddress:null
}
export const getAddress=createAsyncThunk(
    "address/getAddress",
    async()=>{
        const res=await fetch("http://localhost:3005/user/get-address",{
            method:"Get",
            headers:{'Content-Type':"application/json"},
            credentials:"include"
            
        })
        const data=await res.json()
        return data.address
    }

)
// export const removeAddress=createAsyncThunk({

// })
//get address by id
// export const getAddressById=createAsyncThunk(
//     "address/getAddressById",
//     async(id:string)=>{
//         const res=await fetch(`http://localhost:3005/getAddressById/${id}`,{
//             method:"Put",
//             headers:{'Content-Type':"application/json"},
//             credentials:"include"
//         })
//         const data=await res.json()
//     }
// )
export const getAddressById=createAsyncThunk(
    "address/getAddressById",
    async(id:string)=>{
        const res=await fetch(`http://localhost:3005/user/getAddressById/${id}`,{
            method:"Get",
            headers:{'Content-Type':"application/json"},
            credentials:"include"
        })
        const data=await res.json()
        return data.address
    }
)
const addressSlice=createSlice({
    name:"address",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAddress.fulfilled,(state,action)=>{
            state.address=action.payload
        })
        .addCase(getAddressById.fulfilled,(state,action)=>{
            state.selectedAddress=action.payload
        })
    }
    
})
export default addressSlice.reducer