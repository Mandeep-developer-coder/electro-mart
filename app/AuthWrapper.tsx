"use client"
import { useDispatch } from "react-redux"
import { checkAuth } from "./redux/authSlice"
import { AppDispatch } from "@/app/redux/store";
import { useEffect } from "react";
export function AuthWrapper({children}:{children:React.ReactNode}){
    const dispatch=useDispatch<AppDispatch>()
    useEffect(()=>{
          dispatch(checkAuth())
    },[dispatch])
    
return children
}