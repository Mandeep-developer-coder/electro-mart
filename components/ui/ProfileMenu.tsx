"use client";
import { useState,useEffect } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "@/app/redux/authSlice";
import { useRouter } from "next/navigation";
import { getCart } from "@/app/redux/cart/cartSlice";
import { RootState,AppDispatch } from "@/app/redux/store";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
const [preview, setPreview] = useState("https://cdn-icons-png.flaticon.com/512/149/149071.png");
 useEffect(()=>{
        const fetchProfile=async()=>{
            const res=await fetch("http://localhost:3005/profile/get-profile",{
                method:"Get",
                headers:{'Content-Type':"application.json"},
                credentials:"include"
            })
            const data=await res.json()
           
            if (data.avatar) {
      setPreview(data.avatar);
    } else {
      setPreview("https://cdn-icons-png.flaticon.com/512/149/149071.png"); 
    }

        }
    fetchProfile()
    },[])
  const handleLogout = async () => {
    await fetch("http://localhost:3005/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    dispatch(logout());
        dispatch(getCart())
    router.push("/");
  };

  return (
    <div className="relative">
   
      <img
        src={preview}
        alt="profile"
        className="w-9 h-9 rounded-full cursor-pointer"
        onClick={() => setOpen(!open)}
      />


      {open && (
        <div className="absolute right-0 mt-3 w-44 bg-white shadow-lg rounded-xl p-2 z-50">
          <Link
            href="/profile"
            className="block px-3 py-2 hover:bg-gray-100 rounded"
          >
            My Profile
          </Link>
            <Link
            href="/savedaddress"
            className="block px-3 py-2 hover:bg-gray-100 rounded"
          >
            Saved address
          </Link>
          <Link
            href="/orders"
            className="block px-3 py-2 hover:bg-gray-100 rounded"
          >
            My Orders
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
