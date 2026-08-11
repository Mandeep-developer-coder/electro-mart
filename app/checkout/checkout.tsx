// "use client";
// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState, AppDispatch } from "../redux/store";
// import { useRouter } from "next/navigation";
// import { getAddress } from "../redux/address/addressSlice";
// import { delAllCart } from "../redux/cart/cartSlice";
// import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// export default function CheckOut() {
//   const dispatch = useDispatch<AppDispatch>();

//   const idempotencyKey = crypto.randomUUID();
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
//   const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
// const [isSubmitting,setSubmitting]=useState(false)
//   const { items } = useSelector((state: RootState) => state.cart);
//   const { address } = useSelector((state: RootState) => state.address);

//   const router = useRouter();
//   const stripe=useStripe()
//   const elements=useElements()

//   useEffect(() => {
//     dispatch(getAddress());
//   }, [dispatch]);
//   const orderItems=items.map((item)=>({
//     productId:item.productId,
//     title:item.title,
//     price:item.price,
//     quantity:item.quantity
// }))

//   const Subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
//   const shipping = Subtotal > 1000 ? 0 : 40;
//   const taxRate = 0.05;
//   const tax = Subtotal * taxRate;
//   const total = Subtotal + shipping + tax;
// const subtotalRounded = Math.round(Subtotal * 100) / 100;
// const shippingRounded = Math.round(shipping * 100) / 100;
// const taxRounded = Math.round(tax * 100) / 100;
// const totalRounded = Math.round(total * 100) / 100;
//   const handleRemove = async (id: any) => {
//     const res = await fetch(`http://localhost:3005/user/remove/${id}`, {
//       method: "Delete",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//     });
//     const data = await res.json();
//     setSelectedIndex(null);
//     dispatch(getAddress());
//   };
// const handleOrder=async()=>{
//   setSubmitting(true)
//   const res=await fetch("http://localhost:3005/order/add-order",{
//     method:"Post",
//     headers:{'Content-Type':'application/json'},
//     credentials:"include",
//     body:JSON.stringify({
//       items:orderItems,
//       shippingAddress:JSON.parse(localStorage.getItem("selectedAddress")||"null"),
//       subtotal:subtotalRounded,
//       shippingCharge:shippingRounded,
//       tax:taxRounded,
//       totalAmount:totalRounded,
//       paymentMethod,
//       idempotencyKey

//     })
//   })
//   const data=await res.json()
//   if(data.success){
//     setSubmitting(false)
//   router.push("/orderConfirmation")
//   dispatch(delAllCart())
    
//   }

// }
//   return (
//     <div className="flex flex-col md:flex-row justify-center gap-12 p-4">

//       <div className="flex flex-col gap-4 w-full md:w-96 px-4 py-4 bg-white border shadow-2xl rounded-2xl self-start">
//         <h1 className="font-bold text-xl">Order Summary</h1>
//         <div className="mt-5 flex justify-between">
//           <p className="text-gray-500">Subtotal</p>
//           <p className="text-gray-500">₹{Subtotal.toFixed(2)}</p>
//         </div>
//         <div className="flex justify-between">
//           <p className="text-gray-500">Shipping</p>
//           <p className="text-gray-500">₹{shipping}</p>
//         </div>
//         <div className="flex justify-between">
//           <p className="text-gray-500">Tax (5%)</p>
//           <p className="text-gray-500">₹{tax.toFixed(2)}</p>
//         </div>
//         <hr className="border-t-4 border-gray-600 my-4" />
//         <div className="flex justify-between mt-4">
//           <h1 className="text-black font-bold text-2xl">Total</h1>
//           <h1 className="text-black font-bold text-2xl">₹{total.toFixed(2)}</h1>
//         </div>
//         <div className="mt-6">
//           <ul className="list-disc ml-5 space-y-1">
//             <li className="text-gray-500">Free shipping on orders over ₹1000</li>
//             <li className="text-gray-500">30-day return policy</li>
//           </ul>
//         </div>
//       </div>

    
//       <div className="ml-6 w-full md:w-96">
//         {address.length !== 0 && <h1 className="font-bold mb-2">Select Address</h1>}
//         {address.map((item, index) => (
//           <div key={index} className="bg-gray-100 p-4 rounded-lg flex justify-between items-start mb-2">
//             <label className="flex-1 cursor-pointer">
//               <input
//                 type="radio"
//                 name="selectedAddress"
//                 checked={selectedIndex == index}
//                 onChange={() => {
//                   setSelectedIndex(index);
//                   localStorage.setItem("selectedAddress", JSON.stringify(item));
//                 }}
//                 className="mr-2"
//               />
//               <span className="font-semibold">{item.name}</span> <br />
//               <span>
//                 {item.street}, {item.city}, {item.state} - {item.zip}, {item.country}
//               </span>{" "}
//               <br />
//               <span>{item.phone.startsWith("+91") ? item.phone.slice(3) : item.phone}</span>
//             </label>
//             <button onClick={() => handleRemove(item._id)} className="text-pink-950 px-3 py-1">
//               <i className="fa-regular fa-trash-can"></i>
//             </button>
//           </div>
//         ))}

    
//         <p
//           onClick={() => router.push("/addressform")}
//           className="w-full border-2 text-center p-4 font-bold cursor-pointer mt-2"
//         >
//           + Add Address
//         </p>
// {selectedIndex != null && (
 
//           <div className="mt-4">
//             <h2 className="font-bold mb-2">Select Payment Method</h2>
//             <div className="flex flex-col gap-2">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="payment"
//                   value="online"
//                   checked={paymentMethod === "online"}
//                   onChange={() => setPaymentMethod("online")}
//                   className="mr-2"
//                 />
//                 Online Payment
//               </label>
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="payment"
//                   value="cod"
//                   checked={paymentMethod === "cod"}
//                   onChange={() => setPaymentMethod("cod")}
//                   className="mr-2"
//                 />
//                 Cash on Delivery (COD)
//               </label>
//             </div>
//           </div>
//         )}
//         {selectedIndex != null && (
//           paymentMethod=="cod"?(
//           <button
//           onClick={handleOrder}
//             disabled={!paymentMethod||isSubmitting} 
//             className="mt-4 w-full rounded py-2 bg-pink-900 text-white disabled:opacity-50"
//           >
//             Place Order
//           </button>):(  <button
//             disabled={!paymentMethod} 
//             className="mt-4 w-full rounded py-2 bg-pink-900 text-white disabled:opacity-50"
//           >
//             Proceed to Payment
//           </button>)
// )}
//    {selectedIndex != null && paymentMethod === "online" && (
//           <div className="mt-6 p-4 border rounded-xl shadow-md bg-white">
//             <h3 className="font-semibold mb-3 text-lg">Enter Card Details</h3>
//             <div className="p-3 border rounded-lg bg-gray-50">
//               <CardElement
//                 options={{
//                   style: {
//                     base: {
//                       fontSize: "16px",
//                       color: "#32325d",
//                       "::placeholder": { color: "#aab7c4" },
//                     },
//                     invalid: { color: "#fa755a" },
//                   },
//                 }}
//               />
//             </div>
//             <button
//             //   onClick={handleOnlinePayment}
//               disabled={isSubmitting}
//               className="mt-4 w-full bg-pink-900 text-white py-2 rounded-lg disabled:opacity-50"
//             >
//               Pay ₹{totalRounded}
//             </button>
//           </div>
//         )}
      
        
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { useRouter } from "next/navigation";
import { getAddress } from "../redux/address/addressSlice";
import { delAllCart } from "../redux/cart/cartSlice";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

export default function CheckOut() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const idempotencyKey = crypto.randomUUID();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const { items } = useSelector((state: RootState) => state.cart);
  const { address } = useSelector((state: RootState) => state.address);

  useEffect(() => {
    dispatch(getAddress());
  }, [dispatch]);

  const orderItems = items.map((item) => ({
    productId: item.productId,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
  }));

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const shipping = subtotal > 1000 ? 0 : 40;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const subtotalRounded = Math.round(subtotal * 100) / 100;
  const shippingRounded = Math.round(shipping * 100) / 100;
  const taxRounded = Math.round(tax * 100) / 100;
  const totalRounded = Math.round(total * 100) / 100;

  const handleRemove = async (id: any) => {
    await fetch(`http://localhost:3005/user/remove/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setSelectedIndex(null);
    dispatch(getAddress());
  };

  const handleOrder = async (method: "CARD" | "COD", paymentIntentId?: string) => {
    setSubmitting(true);
    const res = await fetch("http://localhost:3005/order/add-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        items: orderItems,
        shippingAddress: JSON.parse(localStorage.getItem("selectedAddress") || "null"),
        subtotal: subtotalRounded,
        shippingCharge: shippingRounded,
        tax: taxRounded,
        totalAmount: totalRounded,
        paymentMethod: method,
        paymentIntentId: paymentIntentId || null,
        idempotencyKey,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setSubmitting(false);
      dispatch(delAllCart());
      router.push("/orderConfirmation");
    }
  };

  const handleOnlinePayment = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);

    try {
    
      const res = await fetch("http://localhost:3005/order/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(totalRounded * 100) }),
        credentials:"include"
      });
      const { clientSecret, paymentIntentId } = await res.json();


      const cardElement = elements.getElement(CardElement)!;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.paymentIntent?.status === "succeeded") {

        await handleOrder("CARD", paymentIntentId);
      } else {
        setSubmitting(false);
        alert("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      alert("Something went wrong with payment.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center gap-12 p-4">
  
      <div className="flex flex-col gap-4 w-full md:w-96 px-4 py-4 bg-white border shadow-2xl rounded-2xl self-start">
        <h1 className="font-bold text-xl">Order Summary</h1>
        <div className="mt-5 flex justify-between">
          <p className="text-gray-500">Subtotal</p>
          <p className="text-gray-500">₹{subtotalRounded.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Shipping</p>
          <p className="text-gray-500">₹{shippingRounded}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Tax (5%)</p>
          <p className="text-gray-500">₹{taxRounded.toFixed(2)}</p>
        </div>
        <hr className="border-t-4 border-gray-600 my-4" />
        <div className="flex justify-between mt-4">
          <h1 className="text-black font-bold text-2xl">Total</h1>
          <h1 className="text-black font-bold text-2xl">₹{totalRounded.toFixed(2)}</h1>
        </div>
      </div>

  
      <div className="ml-6 w-full md:w-96">
        {address.length > 0 && <h1 className="font-bold mb-2">Select Address</h1>}
        {address.map((item, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg flex justify-between items-start mb-2">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="selectedAddress"
                checked={selectedIndex === index}
                onChange={() => {
                  setSelectedIndex(index);
                  localStorage.setItem("selectedAddress", JSON.stringify(item));
                }}
                className="mr-2"
              />
              <span className="font-semibold">{item.name}</span> <br />
              <span>
                {item.street}, {item.city}, {item.state} - {item.zip}, {item.country}
              </span>
              <br />
              <span>{item.phone.startsWith("+91") ? item.phone.slice(3) : item.phone}</span>
            </label>
            <button onClick={() => handleRemove(item._id)} className="text-pink-950 px-3 py-1">
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>
        ))}

        <p
          onClick={() => router.push("/addressform")}
          className="w-full border-2 text-center p-4 font-bold cursor-pointer mt-2"
        >
          + Add Address
        </p>

        {selectedIndex != null && (
          <div className="mt-4">
            <h2 className="font-bold mb-2">Select Payment Method</h2>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                  className="mr-2"
                />
                Online Payment
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mr-2"
                />
                Cash on Delivery (COD)
              </label>
            </div>
          </div>
        )}


        {selectedIndex != null && paymentMethod === "cod" && (
          <button
            onClick={() => handleOrder("COD")}
            disabled={isSubmitting}
            className="mt-4 w-full rounded py-2 bg-pink-900 text-white disabled:opacity-50"
          >
            Place Order
          </button>
        )}


        {selectedIndex != null && paymentMethod === "online" && (
          <div className="mt-6 p-4 border rounded-xl shadow-md bg-white">
            <h3 className="font-semibold mb-3 text-lg">Enter Card Details</h3>
            <div className="p-3 border rounded-lg bg-gray-50">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#32325d",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#fa755a" },
                  },
                }}
              />
            </div>
            <button
              onClick={handleOnlinePayment}
              disabled={isSubmitting}
              className="mt-4 w-full bg-pink-900 text-white py-2 rounded-lg disabled:opacity-50"
            >
              Pay ₹{totalRounded}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
