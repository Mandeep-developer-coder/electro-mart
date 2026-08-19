"use client"

import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../redux/store"
import { incrementQty, decrementQty, removeFromCart } from "../redux/cart/cartSlice"
import { updateQty, RemoveProduct } from "../redux/cart/cartSlice"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Cart() {
  const { items = [] } = useSelector((state: RootState) => state.cart)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const handleIncrementQty = (item: any) => {
    dispatch(incrementQty(item.productId))
    dispatch(updateQty({ productId: item.productId, action: "INC" }))
  }

  const handleDecrementQty = (item: any) => {
    if (item.quantity > 1) {
      dispatch(decrementQty(item.productId))
      dispatch(updateQty({ productId: item.productId, action: "DEC" }))
    }
  }

  const handleRemoveCart = (id: string) => {
    dispatch(removeFromCart(id))
    dispatch(RemoveProduct(id))
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-gray-500 text-xl font-semibold">
          Your cart is empty
        </p>
      </div>
    )
  }
  const item = items.filter((i) => i.stock != 0)

  const Subtotal = item.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  )
  const shipping = Subtotal > 1000 ? 0 : 40
  const taxRate = 0.05
  const tax = Subtotal * taxRate
  const total = Subtotal + shipping + tax

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">

      {/* Cart Items */}
      <div className="flex flex-col gap-3 flex-1">
        <h1 className="font-bold text-xl">Shopping Cart</h1>

        <div className="flex flex-col gap-5">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row px-4 bg-white border shadow-lg rounded-2xl gap-4"
            >
              <div className="flex gap-2 items-center">
                <img
                  src={item.image}
                  className="object-contain w-32 h-32 md:w-40 md:h-40"
                />
                <p className="text-center md:text-left truncate w-60 md:w-80">
                  {item.description}
                </p>
              </div>

              <div className="flex gap-4 md:ml-auto items-center mt-2 md:mt-0">
                {item.stock < 1 ? (
                  <button className="text-white bg-orange-500 px-4 py-2 rounded">
                    Out of Stock
                  </button>
                ) : (
                  <>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handleIncrementQty(item)}
                        className="text-black border border-black bg-white w-8 h-8 rounded"
                      >
                        +
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => handleDecrementQty(item)}
                        className="text-black bg-white border border-black w-8 h-8 rounded"
                      >
                        -
                      </button>
                    </div>

                    <p className="font-black">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => handleRemoveCart(item.productId)}
                      className="flex items-center gap-1 text-pink-500 font-semibold"
                    >
                      <i className="fa-solid fa-trash-can"></i> Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      {items.length > 0 && (
        <div className="flex flex-col gap-4 w-full md:w-96 px-4 py-4 bg-white border shadow-2xl rounded-2xl self-start">
          <h1 className="font-bold text-xl">Order Summary</h1>

          <div className="mt-5 flex justify-between">
            <p className="text-gray-500">Subtotal</p>
            <p className="text-gray-500">₹{Subtotal.toFixed(2)}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-gray-500">Shipping</p>
            <p className="text-gray-500">₹{shipping}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-gray-500">Tax (5%)</p>
            <p className="text-gray-500">₹{tax.toFixed(2)}</p>
          </div>

          <hr className="border-t-4 border-gray-600 my-4" />

          <div className="flex justify-between mt-4">
            <h1 className="text-black font-bold text-2xl">Total</h1>
            <h1 className="text-black font-bold text-2xl">
              ₹{total.toFixed(2)}
            </h1>
          </div>

          {/* <div className="mt-5 flex gap-2">
            <input
              type="text"
              placeholder="Promo code"
              className="flex-1 py-2 px-3 border-2 rounded-md"
            />
            <Button className="text-black border-2 hover:bg-white bg-white px-4">
              Apply
            </Button>
          </div> */}

          <button
            onClick={() => router.push("/checkout")}
            className="mt-4 rounded py-2 bg-pink-900 text-white w-full"
          >
            Place Order
          </button>

          <div className="mt-6">
            <ul className="list-disc ml-5 space-y-1">
              <li className="text-gray-500">
                Free shipping on orders over ₹1000
              </li>
              <li className="text-gray-500">
                30-day return policy
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}