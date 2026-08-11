import { createAsyncThunk } from "@reduxjs/toolkit";
export const fetchProducts=createAsyncThunk(
    "products/fetch",
    async({page,limit}:{page:number,limit:number})=>{
        const res=await fetch(`http://localhost:3005/products?page=${page}&limit=${limit}`)
     const data = await res.json();
    return { ...data, currentPage: page }; 
    }
)