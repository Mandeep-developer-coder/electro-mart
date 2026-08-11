import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";


interface Item{
    productId:string
    title:string
    price:number
    description:string
    image:string
    quantity:number
    stock:number

}
interface DbItem{
    productId:string
     price:number
    quantity:number

}
interface CartItem{
    items:Item[],
    

}
const initialState:CartItem={
    items:[],
   
   
    
}
//add db
export const addCartItemDb=createAsyncThunk(
    "cart/addCartDb",
    async(item:DbItem)=>{
        const res=await fetch("http://localhost:3005/cart/add-cart",{
            method:"Post",
            headers:{'Content-Type':"application/json"},
            body:JSON.stringify(item),
            credentials:"include"
        })
        const data=await res.json()
        return data
    }

)
//update qty
export const updateQty=createAsyncThunk(
    "cart/update",
    async({productId,action}:{productId:string,action:"INC"|"DEC"})=>{
        const res=await fetch("http://localhost:3005/cart/update-qty",{
            method:"PATCH",
            headers:{'Content-Type':"application/json"},
            body:JSON.stringify({productId,action}),
            credentials:"include"
        })
        const data=await res.json()
        return data

    }
)
// delete cart/ remove product from cart
export const RemoveProduct=createAsyncThunk(
    "cart/remove",
    async(productId:string)=>{
        const res=await fetch("http://localhost:3005/cart/delete-item",{
            method:"DELETE",
            headers:{'Content-Type':"application/json"},
            body:JSON.stringify({id:productId}),
            credentials:"include"
        })
        const data=await res.json()
        return data

    }
)

//get cart 
export const getCart=createAsyncThunk(
    "cart/fetchCart",
    async()=>{
        const res=await fetch("http://localhost:3005/cart/get-cart",{
            method:"get",
            headers:{'Content-Type':"application/json"},
            
            credentials:"include"
        })
        const data=await res.json()
        return data.items
    }
)
//del all cart
export const delAllCart=createAsyncThunk(
    "cart/delAllCart",
    async()=>{
            const res=await fetch("http://localhost:3005/cart/del-allcart",{
            method:"Delete",
            headers:{'Content-Type':"application/json"},
            
            credentials:"include"
        })
        const data=await res.json()
        return data
    }
)


const cartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{
        addToCart(state,action){
            const item=action.payload
                if (!state.items) state.items = [];

            const existingProduct=state.items.find((i)=>i.productId==item.productId)
            if(existingProduct){
                existingProduct.quantity+=item.quantity
            }
            else{
                state.items.push(item)
            }
        },
        removeFromCart(state,action){
          
           state.items=state.items.filter((id:any)=>id.productId!=action.payload)
        },
        incrementQty(state,action){
            const item=state.items.find((id)=>id.productId==action.payload)
            if(item){
                item.quantity+=1
            }
            
        },
        decrementQty(state,action){
            const item=state.items.find((id)=>id.productId==action.payload)
            if(item && item.quantity>1){
                item.quantity-=1
            }
        }


    },
    extraReducers:(builder)=>{
        builder.addCase(getCart.fulfilled,(state,action)=>{
             state.items = action.payload; 
        }

     )
      .addCase(delAllCart.fulfilled, (state, action) => {
      state.items = []  
    })
    .addCase(RemoveProduct.fulfilled, (state, action) => {
      state.items = state.items.filter(i => i.productId !== action.payload.id)
    })
    }
})
export const {addToCart,incrementQty,decrementQty,removeFromCart}=cartSlice.actions
export default cartSlice.reducer