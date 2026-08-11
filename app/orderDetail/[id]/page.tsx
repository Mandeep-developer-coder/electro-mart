"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "@/app/redux/orders/orderSlice";
import Image from "next/image";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function OrderDetail() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const id = params.id as string;
  const { orders } = useSelector((state: RootState) => state.order);
  const filterOrder = orders.find((order) => order._id === id);

  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [productId,setProductId]=useState("")
const [rating,setRating]=useState(0)

useEffect(() => {
  if (filterOrder && filterOrder.items.length > 0) {
   
    setProductId(filterOrder.items[0].productId._id);
  }
}, [filterOrder]);


  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);
useEffect(()=>{
  const getRating=async()=>{
    const res=await fetch(`http://localhost:3005/order/rating/${id}`,{
      method:"Get",
      headers:{'Content-Type':"application/json"},
      credentials:"include"
    })
    const data=await res.json()
    if(data.success)
    {
      setRating(data.rating)
    }
  }
  getRating()
},[id])
  if (!filterOrder) return <div>Loading order details...</div>;

  const {
    createdAt,
    paymentMethod,
    paymentStatus,
    orderStatus,
    shippingAddress,
    items,
    subtotal,
    shippingCharge,
    tax,
    totalAmount,
    statusHistory
  } = filterOrder;

  const downloadInvoice = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: ${id}`, 14, 30);
    doc.text(`Order Date: ${new Date(createdAt).toLocaleString()}`, 14, 36);
    doc.text(`Payment Method: ${paymentMethod}`, 14, 42);
    doc.text(`Payment Status: ${paymentStatus}`, 14, 48);
    doc.text(`Order Status: ${orderStatus}`, 14, 54);
    doc.text("Shipping Address:", 14, 64);
    doc.text(
      `${shippingAddress.name}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zip}, ${shippingAddress.country}`,
      14,
      70
    );
    let y = 90;
    doc.text("Items:", 14, y);
    y += 6;
    items.forEach((item) => {
      doc.text(
        `${item.productId.title} - Qty: ${item.quantity} - Price: ₹${item.price} - Subtotal: ₹${
          item.price * item.quantity
        }`,
        14,
        y
      );
      y += 6;
    });
    y += 6;
    doc.text(`Subtotal: ₹${subtotal}`, 14, y);
    y += 6;
    doc.text(`Tax: ₹${tax}`, 14, y);
    y += 6;
    doc.text(`Shipping Charge: ₹${shippingCharge}`, 14, y);
    y += 6;
    doc.text(`Total Amount: ₹${totalAmount}`, 14, y + 2);
    doc.save(`Invoice_${id}.pdf`);
  };
const saveRating=async(star:any,productId:string,orderId:string)=>{
  const res=await fetch("http://localhost:3005/rating/",{
    method:"Post",
    headers:{'Content-Type':'application/json'},
    credentials:"include",
    body:JSON.stringify({star,productId,orderId})
  })
  const data=await res.json()
  if(data.success){
    alert(data.msg)
  }


}
  return (
    <div className="max-w-5xl mx-auto p-6">
  
      <div className="mb-6 border p-4 rounded-md shadow-sm">
        <h2 className="font-semibold mb-2">Basic Info</h2>
        <p><strong>Order ID:</strong> {id}</p>
        <p><strong>Order Date:</strong> {new Date(createdAt).toLocaleString()}</p>
        <p><strong>Payment Status:</strong> {paymentStatus}</p>
        <p><strong>Payment Method:</strong> {paymentMethod}</p>
        <p><strong>Order Status:</strong> {orderStatus}</p>
      </div>

    
      <div className="mb-6 border p-4 rounded-md shadow-sm">
        <h2 className="font-semibold mb-2">Shipping Details</h2>
        <p><strong>Name:</strong> {shippingAddress.name}</p>
        <p><strong>Phone:</strong> {shippingAddress.phone}</p>
        <p>
          <strong>Address:</strong> {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.zip}, {shippingAddress.country}
        </p>
      </div>

     <div className="mb-6 p-4 shadow-md rounded-lg border">
      <div className="font-semibold mb-4">Order Tracking</div>
      <div className="relative flex flex-col gap-4">
        <div className="absolute left-3 top-2 bottom-2 w-1 bg-black"></div>
        {
        ["CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"].map((step) => {
  const found = filterOrder.statusHistory.find((s) => s.status === step);

  return (
    <div key={step} className="flex items-start gap-4 relative">
     
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
          found ? "bg-green-500" : "bg-gray-300"
        }`}
      ></div>

    
      <div>
        <p
          className={`font-semibold ${
            found ? "text-green-600" : "text-gray-400"
          }`}
        >
          {step}
        </p>

        {found && (
          <p className="text-sm text-gray-500">
            {new Date(found.date).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  );
})
        }

      </div>

     </div>
      <div className="mb-6 border p-4 rounded-md shadow-sm">
        <h2 className="font-semibold mb-2">Items</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId._id} className="flex items-center gap-4 border-b pb-2">
              <img
                src={item.productId.images[0]}
                alt={item.productId.title}
                width={80}
                height={80}
                className="object-cover rounded-md"
              />
              <div className="flex-1">
                <p className="font-medium">{item.productId.title}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price}</p>
                <p>Subtotal: ₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="mb-6 border p-4 rounded-md shadow-sm">
        <h2 className="font-semibold mb-2">Charges</h2>
        <p><strong>Subtotal:</strong> ₹{subtotal}</p>
        <p><strong>Tax:</strong> ₹{tax}</p>
        <p><strong>Shipping Charge:</strong> ₹{shippingCharge}</p>
        <p className="font-bold"><strong>Total Amount:</strong> ₹{totalAmount}</p>
      </div>
   {orderStatus=="DELIVERED" && (<div className="mb-6 border p-4 rounded-md shadow-sm">
  <h2 className="font-semibold mb-2">Rate this Order</h2>
  <div className="flex items-center space-x-1 mt-2">
  
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() =>{ setSelected(star); saveRating(star,productId,id) } }
        onMouseEnter={() => setHovered(star) }
        onMouseLeave={() => setHovered(0)}
        className="cursor-pointer text-2xl transition-colors duration-150"
      >
        {star <= (hovered || selected || rating) ? (
          <FaStar className="text-yellow-400" />
        ) : (
          <FaRegStar className="text-gray-300" />
        )}
      </span>
    ))}
  </div>
</div>)}
    

    
      <div className="mb-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={downloadInvoice}
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
}


// "use client";
// import { useParams } from "next/navigation";
// import { useEffect } from "react";
// import { RootState, AppDispatch } from "@/app/redux/store";
// import { useDispatch, useSelector } from "react-redux";
// import { getOrders } from "@/app/redux/orders/orderSlice";
// import Image from "next/image";
// // import jsPDF from "jspdf";
// // import "jspdf-autotable";
// import ReactStars from "react-rating-stars-component";
// import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

// export default function OrderDetail() {
//   const params = useParams();
//   const dispatch = useDispatch<AppDispatch>();
//   const id = params.id as string;
//   const { orders } = useSelector((state: RootState) => state.order);
//   const filterOrder = orders.find((order) => order._id === id);

//   useEffect(() => {
//     dispatch(getOrders());
//   }, [dispatch]);

//   if (!filterOrder) return <div>Loading order details...</div>;

//   const {
//     createdAt,
//     paymentMethod,
//     paymentStatus,
//     orderStatus,
//     shippingAddress,
//     items,
//     subtotal,
//     shippingCharge,
//     tax,
//     totalAmount,
//   } = filterOrder;
// const downloadInvoice = async () => {
//   const { default: jsPDF } = await import("jspdf");

//   const doc = new jsPDF();

//   doc.setFontSize(18);
//   doc.text("Invoice", 14, 20);

//   doc.setFontSize(12);
//   doc.text(`Order ID: ${id.slice(-6)}`, 14, 30);
//   doc.text(`Order Date: ${new Date(createdAt).toLocaleString()}`, 14, 36);
//   doc.text(`Payment Method: ${paymentMethod}`, 14, 42);
//   doc.text(`Payment Status: ${paymentStatus}`, 14, 48);
//   doc.text(`Order Status: ${orderStatus}`, 14, 54);

//   doc.text("Shipping Address:", 14, 64);
//   doc.text(
//     `${shippingAddress.name}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zip}, ${shippingAddress.country}`,
//     14,
//     70
//   );

//   let y = 90;
//   doc.text("Items:", 14, y);
//   y += 6;

//   items.forEach((item) => {
//     doc.text(
//       `${item.productId.title} - Qty: ${item.quantity} - Price: ₹${item.price} - Subtotal: ₹${
//         item.price * item.quantity
//       }`,
//       14,
//       y
//     );
//     y += 6;
//   });

//   y += 6;
//   doc.text(`Subtotal: ₹${subtotal}`, 14, y);
//   y += 6;
//   doc.text(`Tax: ₹${tax}`, 14, y);
//   y += 6;
//   doc.text(`Shipping Charge: ₹${shippingCharge}`, 14, y);
//   y += 6;
//   doc.text(`Total Amount: ₹${totalAmount}`, 14, y + 2);

//   doc.save(`Invoice_${id.slice(-6)}.pdf`);
// };



//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Order Details</h1>

//       <div className="mb-6 border p-4 rounded-md shadow-sm">
//         <h2 className="font-semibold mb-2">Basic Info</h2>
//         <p><strong>Order ID:</strong> {id}</p>
//         <p><strong>Order Date:</strong> {new Date(createdAt).toLocaleString()}</p>
//         <p><strong>Payment Status:</strong> {paymentStatus}</p>
//         <p><strong>Payment Method:</strong> {paymentMethod}</p>
//         <p><strong>Order Status:</strong> {orderStatus}</p>
//       </div>

//       <div className="mb-6 border p-4 rounded-md shadow-sm">
//         <h2 className="font-semibold mb-2">Shipping Details</h2>
//         <p><strong>Name:</strong> {shippingAddress.name}</p>
//         <p><strong>Phone:</strong> {shippingAddress.phone}</p>
//         <p>
//           <strong>Address:</strong> {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.zip}, {shippingAddress.country}
//         </p>
//       </div>

//       <div className="mb-6 border p-4 rounded-md shadow-sm">
//         <h2 className="font-semibold mb-2">Items</h2>
//         <div className="space-y-4">
//           {items.map((item) => (
//             <div key={item.productId._id} className="flex items-center gap-4 border-b pb-2">
//               <Image
//                 src={item.productId.images[0]}
//                 alt={item.productId.title}
//                 width={80}
//                 height={80}
//                 className="object-cover rounded-md"
//               />
//               <div className="flex-1">
//                 <p className="font-medium">{item.productId.title}</p>
//                 <p>Quantity: {item.quantity}</p>
//                 <p>Price: ₹{item.price}</p>
//                 <p>Subtotal: ₹{item.price * item.quantity}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mb-6 border p-4 rounded-md shadow-sm">
//         <h2 className="font-semibold mb-2">Charges</h2>
//         <p><strong>Subtotal:</strong> ₹{subtotal}</p>
//         <p><strong>Tax:</strong> ₹{tax}</p>
//         <p><strong>Shipping Charge:</strong> ₹{shippingCharge}</p>
//         <p className="font-bold"><strong>Total Amount:</strong> ₹{totalAmount}</p>
//       </div>

//       <div className="mb-6">
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           onClick={downloadInvoice}
//         >
//           Download Invoice
//         </button>
//       </div>
//     </div>
//   );
// }
