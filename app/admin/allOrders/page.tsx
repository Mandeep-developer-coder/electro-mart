"use client";
import { useState, useEffect } from "react";

export default function AllOrders() {
  interface OrderType {
    _id: string;
    userId: {
      email: string;
    };
    items: any[];
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
  }

  const [orders, setOrders] = useState<OrderType[]>([]);
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("http://localhost:3005/admin/all-orders", {
        method: "Get",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const order = await res.json();
      setOrders(order);
    };
    fetchOrders();
  }, []);
  return (
    <>
      <div className="flex flex-col gap-5">
        <h1 className="font-bold text-pink-600">All Orders: {orders.length}</h1>
        <div className="overflow-x-auto bg-white border shadow-lg roundex-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm tracking-wide ">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length == 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No Orders Found
                  </td>
                </tr>
              ) : (
                orders.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t  hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-6 py-4 font-medium ">{item._id}</td>
                    <td className="px-6 py-4  text-gray-600">
                      {item.userId.email}
                    </td>
                    <td className="px-6 py-4  ">{item.items.length}</td>
                    <td className="px-6 py-4  ">{item.totalAmount}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.paymentStatus === "PAID"
                            ? "bg-green-400 text-green-700"
                            : "bg-pink-400 text-pink-800"
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4  ">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
