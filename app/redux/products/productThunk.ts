import { createAsyncThunk } from "@reduxjs/toolkit";
export const fetchProducts=createAsyncThunk(
    "products/fetch",
    async({page,limit,category}:{page:number,limit:number,category?:string})=>{
        let url = `http://localhost:3005/products?page=${page}&limit=${limit}`;
        if (category) {
            url += `&category=${encodeURIComponent(category)}`;
        }
        const res=await fetch(url)
     const data = await res.json();
    return { ...data, currentPage: page }; 
    }
)