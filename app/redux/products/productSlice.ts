import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchProducts } from "./productThunk";

interface Product {
    _id:string,
  title: string;
  description: string;
  price: number;
  images: string[];
  category:string,
  stock:number,
  brand: string;
  rating: number;
}

interface ProductState {
  items: Product[];
    singleProduct: Product | null;
  loading: boolean;
  page: number;
  totalPage:number,
 

}

const initialState: ProductState = {
  items: [],
  singleProduct:null,
  loading: false,
  page: 1,
  totalPage:1,
  
  
};
export const getProduct=createAsyncThunk(
  "name/getProduct",
  async()=>{
    const res=await fetch("http://localhost:3005/products/getProducts",{
      method:"Get",
      headers:{'Content-Type':'application/json'},
      credentials:"include"
    })  
    const data=await res.json()
    return data
  }
)
export const getProductById=createAsyncThunk(
  "name/getProductById",
  async(id:string)=>{
    const res=await fetch(`http://localhost:3005/products/getProductById/${id}`,{
      method:'Get',
      headers:{'content-Type':'application/json'},
      credentials:"include"
      
    })
    const data=await res.json()
    return data
  }
)
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<{ data: Product[]; page: number; totalPages: number,currentPage:number }>) => {
          state.loading = false;
          state.items.push(...action.payload.data)
          state.page=action.payload.currentPage
          state.totalPage=action.payload.totalPages
        }
      )
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getProductById.pending, (state) => {
   state.singleProduct = null;
})

      .addCase(getProductById.fulfilled,(state,action)=>{
        state.singleProduct=action.payload.product
      })
      
       .addCase(getProduct.fulfilled,(state,action)=>{
         state.items=action.payload.product
      })
  },
});

export const { setPage } = productSlice.actions;
export default productSlice.reducer;
