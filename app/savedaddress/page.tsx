"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAddress } from "../redux/address/addressSlice";

export default function SavedAddress() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { address } = useSelector((state: RootState) => state.address);

useEffect(()=>{
 dispatch(getAddress())
},[])
  if (address.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No saved addresses</p>;
  }
    const handleRemove = async (id: any) => {
    
    const res = await fetch(`http://localhost:3005/user/remove/${id}`, {
      method: "Delete",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
   
    dispatch(getAddress())
  };

  return (
    <div className="flex flex-col gap-3">
      {address.map((item) => (
        <div
          key={item._id}
          className="bg-gray-100 p-4 rounded-lg flex justify-between items-start"
        >
          <div className="flex-1">
            <p className="font-semibold">{item.name}</p>
            <p>
              {item.street}, {item.city}, {item.state} - {item.zip}, {item.country}
            </p>
            <p>{item.phone.startsWith("+91") ? item.phone.slice(3) : item.phone}</p>
          </div>

          <div className="flex gap-2">
            <button
             onClick={()=>router.push(`/edit/${item._id}`)}
              className="text-blue-600 px-2 py-1 border rounded hover:bg-blue-50"
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </button>
            <button
             onClick={()=>handleRemove(item._id)}
              className="text-red-600 px-2 py-1 border rounded hover:bg-red-50"
            >
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
