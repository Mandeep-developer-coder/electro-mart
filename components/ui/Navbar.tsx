"use client"
import { useState } from "react";
import Link from "next/link";
import { Button } from "./button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
// import { logout } from "@/app/redux/authSlice";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const router=useRouter()
  const pathname=usePathname()
  const [open, setOpen] = useState(false);
  const {loading,loggedIn,role}=useSelector((state:RootState)=>state.auth)
  const {items}=useSelector((state:RootState)=>state.cart)
  // const cartLength=items.length
  const dispatch=useDispatch()
//  const handleLogout=async()=>{
//   const res=await fetch("http://localhost:3005/auth/logout",{
//     method:"Post",
//     credentials:"include"
//   })
//   const data=await res.json()
//   if(data.success){
//     dispatch(logout())
//     router.push("/")
//   }

//  }
if (role === "admin" || pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
  return null;
}

  return (
    <nav className="bg-gray-50 text-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="shrink-0 flex items-center gap-2">
            <Link href="/">
              <i className="fa-solid fa-cart-shopping text-pink-500 text-2xl"></i>
            </Link>
            <p className="text-pink-500 font-bold">ElectroMart</p>
          </div>


          <div className="hidden md:flex gap-7 text-black items-center">
            <Link href="/" className="font-bold">Home</Link>
            <Link href="/products" className="font-bold">Products</Link>
            <Link href="/cart" className="relative flex items-center">
              <i className="fa-solid fa-cart-shopping text-2xl"></i>
              <span className="-top-2 -right-2 absolute w-4 h-4 rounded-full flex items-center justify-center text-white bg-pink-300">{items?.length??0}</span>
            </Link>
            {loading ?null :loggedIn?(   <ProfileMenu />):<Link href="/login"> <Button className="bg-linear-to-r from-pink-500 to-purple-700 text-white hover:from-pink-600 hover:to-purple-800">
              Login
            </Button></Link> }
          
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)}>
              {open ? (
                <XMarkIcon className="w-6 h-6 text-gray-800" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-2 flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow-lg">
            <Link href="/" className="font-bold">Home</Link>
            <Link href="/products" className="font-bold">Products</Link>
            <Link href="/cart" className="relative flex items-center">
              <i className="fa-solid fa-cart-shopping text-2xl"></i>
              <span className="-top-2 ml-5 absolute w-5 h-5 rounded-full flex items-center justify-center text-white bg-pink-300">1</span>
            </Link>
         {loading ? null :loggedIn? (
             <ProfileMenu />
) : (
  <Link href="/login">
    <Button className="bg-linear-to-r from-pink-500 to-purple-700 text-white hover:from-pink-600 hover:to-purple-800">
      Login
    </Button>
  </Link>
)}
          </div>
        )}
      </div>
    </nav>
  );
}
