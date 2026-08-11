"use client"
import { useState,useEffect } from "react"
import { useDispatch,useSelector } from "react-redux"
import { RootState,AppDispatch } from "@/app/redux/store"
import { getCustomers } from "@/app/redux/admin/customerSlice"
import { useRouter } from "next/navigation"

import { filterCustomer } from "@/app/redux/admin/customerSlice"

export default function CustomersPage() {
    const dispatch=useDispatch<AppDispatch>()
    const [search,setSearch]=useState("")
    const router = useRouter()

    useEffect(()=>{
         dispatch(getCustomers())
    },[dispatch])
    const handleSearch=async(e: React.ChangeEvent<HTMLInputElement>)=>{

              const searchTerm=e.target.value.trim()
              
              
              setSearch(searchTerm)
          
             
    }
    useEffect(()=>{
            dispatch(filterCustomer(search))

    },[search])
    const {customer}=useSelector((state:RootState)=>state.customer)
    return(
        <>
        <h1 className="text-3xl font-bold mb-6 text-pink-500">Customers</h1>
        <input type="text" onChange={(e)=>handleSearch(e)} name="search" placeholder="Search here" className="p-4 border-4 "></input>
       
        <div className="overflow-x-auto mt-3">
            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden table-auto">
                <thead className="bg-pink-100 text-gray-700 uppercase text-sm">
                    <tr>
                        <th className="px-4 sm:px-6 py-3 text-left">Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left">Phone</th>
                        <th className="px-4 sm:px-6 py-3 text-left">Email</th>
                        <th className="px-4 sm:px-6 py-3 text-left">Avatar</th>
                        <th className="px-4 sm:px-6 py-3 text-left">Joined Date</th>
                        <th className="px-4 sm:px-6 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customer.map((c,index)=>(
                        <tr key={index} className="border-b hover:bg-pink-50 transition-colors">
                            <td className="px-4 sm:px-6 py-4 font-medium text-gray-800">{c.name}</td>
                            <td className="px-4 sm:px-6 py-4 text-gray-600">{c.phone}</td>
                            <td className="px-4 sm:px-6 py-4 text-gray-600">{c.email}</td>
                            <td className="px-4 sm:px-6 py-4">
                                <img 
                                    src={c.avatar} 
                                    width={50} 
                                    height={50} 
                                    className="object-cover rounded-full border border-gray-200 shadow-sm"
                                    alt={c.name}
                                />
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-gray-600">{new Date(c.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 sm:px-6 py-4">
                                <button 
                                    onClick={() => router.push(`/admin/customerDetail/${c._id}`)} 
                                    className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                                >
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="block sm:hidden mt-6 space-y-4">
            {customer.map((c,index)=>(
                <div key={index} className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <img 
                            src={c.avatar} 
                            width={50} 
                            height={50} 
                            className="object-cover rounded-full border border-gray-200 shadow-sm"
                            alt={c.name}
                        />
                        <h2 className="font-medium text-gray-800">{c.name}</h2>
                    </div>
                    <p className="text-gray-600"><strong>Email:</strong> {c.email}</p>
                    <p className="text-gray-600"><strong>Phone:</strong> {c.phone}</p>
                    <p className="text-gray-600"><strong>Joined:</strong> {new Date(c.createdAt).toLocaleDateString()}</p>
                    <button 
                        onClick={() => router.push(`/admin/customerDetail/${c._id}`)} 
                        className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-sm transition-colors self-start"
                    >
                        Details
                    </button>
                </div>
            ))}
        </div>
        </>
    )
}
