"use client";
import { useEffect ,useState} from "react";
import { RootState, AppDispatch } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getOrders } from "../redux/orders/orderSlice";

export default function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { orders } = useSelector((state: RootState) => state.order);
const [status,setStatus]=useState(true)  

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch,status]);
const handleCancelOrder=async(id:string)=>{
    const res=await fetch(`http://localhost:3005/order/cancel-order/${id}`,{
        method:"PATCH",
        headers:{'Content-Type':"application/json"},
          body:JSON.stringify({}),
        credentials:"include"
    })
    const data=await res.json()
    setStatus(!status)

}

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-lg">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => router.push(`/orderDetail/${order._id}`)}
              className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="font-semibold text-gray-700 text-lg">
                  Order #{order._id}
                </span>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.orderStatus === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : order.orderStatus === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.orderStatus}
                  </span>

           
                  {(["PLACED", "CONFIRMED", "PACKED"].includes(order.orderStatus))&&(["PENDING"].includes(order.paymentStatus)) && (
                  
                  <button
                      className="mt-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      onClick={(e) => { e.stopPropagation(); handleCancelOrder(order._id) }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-5">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="grid grid-cols-3 gap-4">
                {order.items.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex flex-col items-center bg-gray-50 p-3 rounded-lg hover:shadow-sm transition"
                  >
                    <img
                      src={item.productId.images[0]}
                      alt={item.title}
                      className="w-full h-24 rounded-lg mb-2 object-contain"
                    />
                    <p className="text-sm font-medium text-gray-700">{item.title}</p>
                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                    <p className="text-gray-800 font-semibold text-sm mt-1">
                      ₹{item.price}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-5">
                <p className="text-gray-800 font-bold text-lg">
                  Total: ₹{order.totalAmount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
