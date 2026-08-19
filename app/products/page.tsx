"use client"
import { Suspense } from "react"
import Header from "./components/Header"
import Section from "./components/Section"
export default function Product(){
    return(
        <>
        <Header />
        <Suspense fallback={<div className="text-center py-10">Loading products...</div>}>
          <Section />
        </Suspense>
        </>
    )
}