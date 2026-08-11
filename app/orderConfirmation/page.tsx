"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa"; 

export default function OrderSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-pink-100 p-6 relative">
      

      <FaCheckCircle className="text-green-500 w-32 h-32 mb-6 animate-bounce" />

      
      <h1 className="text-4xl md:text-5xl font-extrabold text-pink-900 mb-4 text-center">
        🎉 Your Order is Placed!
      </h1>
      <p className="text-gray-700 text-center text-lg md:text-xl mb-6">
        Thank you for shopping with us. Your order has been successfully placed.
      </p>

     
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => router.push("/products")}
          className="py-3 px-6 bg-pink-900 text-white font-bold rounded-xl shadow-lg hover:bg-pink-800 transition transform hover:-translate-y-1"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => router.push("/")}
          className="py-3 px-6 bg-white border-2 border-pink-900 text-pink-900 font-bold rounded-xl shadow-lg hover:bg-pink-50 transition transform hover:-translate-y-1"
        >
          Go to Homepage
        </button>
      </div>

    </div>
  );
}
