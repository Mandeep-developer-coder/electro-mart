"use client"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCart } from "./redux/cart/cartSlice";
import { AppDispatch } from "@/app/redux/store";
export default function AppWrapper({children}:{children:React.ReactNode}){
    const dispatch=useDispatch<AppDispatch>()
    useEffect(()=>{
        dispatch(getCart())
    })
return children
}