"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { customerDetail } from "@/app/redux/admin/customerDetail/customerDetailSlice";
import { useEffect } from "react";
import { RootState, AppDispatch } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { HiArrowLeft } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/app/redux/admin/customerDetail/customerDetailSlice";
export default function CustomerDetail() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user, order } = useSelector(
    (state: RootState) => state.customerDetail,
  );
  const id = params.id as string;
  useEffect(() => {
    dispatch(customerDetail(id));
  }, [id]);
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="flex flex-col gap-4 ">
        <Button
          onClick={() => router.push("/admin/customers/")}
          className="w-20 rounded-2xl"
        >
          {" "}
          <HiArrowLeft /> Back
        </Button>
        <div className="p-4 border shadow-lg rounded-2xl bg-white flex flex-col gap-2 ">
          <img
            src={user.avatar}
            width={100}
            height={100}
            className="rounded-full object-contain"
          ></img>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.phone}</p>
          <p>Joined on:{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="">
          <h2 className="font-semibold">Address</h2>
          <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.addresses.map((adr, index) => (
              <div
                key={index}
                className="border bg-gray-50 shadow-md rounded-xl"
              >
                <p className="font-semibold">{adr.name}</p>
                <p>{adr.phone}</p>
                <p>
                  {adr.street} ,{adr.city}
                </p>
                <p>
                  {adr.state} - {adr.zip}
                </p>
                <p>{adr.country}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto mt-6 bg-white rounded-2xl shadow-lg border">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">PaymentMethod</th>
                <th className="px-6 py-4">OrderStatus</th>
                <th className="px-6 py-4">Change Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {order.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No Orders Found
                  </td>
                </tr>
              ) : (
                order.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{item._id}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">{item.items.length}</td>

                    <td className="px-6 py-4 font-semibold text-green-600">
                      ₹{item.totalAmount}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {item.paymentMethod}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.orderStatus === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : item.orderStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.orderStatus === "CONFIRMED"
                                ? "bg-pink-300 text-pink-900"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        defaultValue=""
                        onChange={(e) =>
                          dispatch(
                            updateOrderStatus({
                              orderId: item._id,
                              orderStatus: e.target.value,
                            }),
                          )
                        }
                        className="px-3 py-1 text-xs border rounded-lg outline-none"
                        disabled={
                          item.orderStatus === "DELIVERED" ||
                          item.orderStatus === "CANCELLED"
                        }
                      >
                        <option value="" disabled>
                          Update
                        </option>
                           <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                       

                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          router.push(`/admin/orderDetail/${item._id}`)
                        }
                        className="px-4 py-2 text-xs font-medium rounded-lg bg-black text-white hover:bg-gray-800 transition"
                      >
                        View
                      </button>
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
