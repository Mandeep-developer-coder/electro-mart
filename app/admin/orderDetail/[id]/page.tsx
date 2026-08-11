"use client"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useDispatch,useSelector } from "react-redux"
import { RootState,AppDispatch } from "@/app/redux/store"
import { orderDetail } from "@/app/redux/admin/orderDetail/orderDetailSlice"
import { HiArrowLeft } from "react-icons/hi";
export default function OrderDetail(){
    const params=useParams()
    const id=params.id as string
    const router=useRouter()
    const {order}=useSelector((state:RootState)=>state.orderDetail)
    const dispatch=useDispatch<AppDispatch>()
    useEffect(()=>{
      dispatch(orderDetail(id))
    },[id])
if(!order){
   return <p>Loading...</p>
    
}
return(
    <>
    <div className="flex flex-col gap-4 p-4 bg-white shadow-lg rounded-2xl">
        <Button onClick={()=>router.push(`/admin/customerDetail/${order.userId._id}`)} className="w-20 rounded-2xl">  <HiArrowLeft /> Back</Button>
        <h1 className="font-bold">Order ID: <span className="text-gray-400">{order._id}</span></h1>
        <div className="flex justify-between mt-5">
            <div className="flex flex-col"> <p className=" font-bold">User: <span className="text-gray-400">{order.userId.name}</span></p>
            <p className="">Email: <span className="text-gray-400">{order.userId.email}</span></p></div>
         <div className={`p-4 text-white rounded-2xl ${
  order.orderStatus === "CANCELLED" ? "bg-red-600" : "bg-green-600"
}`}>
  {order.orderStatus === "CANCELLED" ? "CANCELLED" : order.paymentStatus}
</div>

            
        </div>
        <div className="flex flex-col bg-white shadow-lg rounded-2xl p-4">
            <h1 className="font-bold">Shipping Address</h1>
             
      <p className="font-semibold">Shipping To:</p>
      <p className="text-gray-600">{order.shippingAddress.name}</p>
      <p className="text-gray-600">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
      <p className="text-gray-600">{order.shippingAddress.state} - {order.shippingAddress.zip}</p>
      <p className="text-gray-600">{order.shippingAddress.country}</p>




        </div>
       <div className="mt-5 flex flex-col gap-4">
  <h2 className="font-bold">Ordered Items:</h2>
  {order.items.map((item, index) => (
    <div key={index} className="flex items-center gap-4 bg-gray-200 p-4 rounded-xl">
      
      <img
        className="object-contain w-32 h-32 rounded-lg"
        src={item.productId.images[0]}
        alt={item.title}
      />

     
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-lg">{item.title}</p>
        <p>Price: ₹{item.price}</p>
        <p>Quantity: {item.quantity}</p>
        <p>Total: ₹{item.price * item.quantity}</p>
         <p>ShippingCharging: ₹{order.shippingCharge}</p>
          <p>Tax: ₹{order.tax}</p>
      </div>
    </div>
  ))}
   <div className="bg-gray-300 p-4 text-black rounded-2xl text-center ">
    <p>TotalAmount: {order.totalAmount}</p>
   </div>

</div>


    </div>
    </>
)

}