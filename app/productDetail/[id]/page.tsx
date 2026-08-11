"use client";
import { useParams } from "next/navigation";
import { RootState, AppDispatch } from "@/app/redux/store";
import { useSelector, useDispatch } from "react-redux";
import Slider from "react-slick";
import ReactStars from "react-rating-stars-component";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { getProduct } from "@/app/redux/products/productSlice";

import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addToCart } from "@/app/redux/cart/cartSlice";
import { toast } from "react-toastify";
import { addCartItemDb } from "@/app/redux/cart/cartSlice";
import { getProductById } from "@/app/redux/products/productSlice";

export default function DetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [qty, setQty] = useState(1);
  const [itemAdded, setItemAdded] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id=params.id as string
  const { items } = useSelector((state: RootState) => state.products);
  const product=useSelector((state:RootState)=>state.products.singleProduct)
  useEffect(()=>{
 dispatch((getProduct()))
  },[])
useEffect(()=>{
  if(id){
  dispatch(getProductById(id))
  }

},[id])

  useEffect(() => {
    async function isProductExist() {
      try {
        const res = await fetch(`http://localhost:3005/cart/product-exist/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        setItemAdded(data.success);
      } catch (err) {
        console.error("Error checking product in cart:", err);
      }
    }
    isProductExist();
  }, [id]);

  // const product = items.find((i) => i._id === id);

  if (!product) {
    return <p className="text-pink-400 text-center mt-6">Loading...</p>;
  }

  const topProducts = items.filter(
  (item) =>
    item.category === product.category &&
    item.rating > 3.5 &&
    item._id !== product._id
);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const handleAddToCart = (product: any) => {
    if (qty < 1) {
      toast.error("Please select quantity first!");
      return;
    }

    const item = {
      productId: product._id,
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.images[0],
      quantity: qty,
    };

    const dbItem = {
      productId: product._id,
      price: product.price,
      quantity: qty,
    };

    dispatch(addToCart(item));
    dispatch(addCartItemDb(dbItem));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 p-4 md:p-6 justify-center">
        <div className="w-full md:w-1/2 max-w-md border bg-gray-100 rounded-xl p-3 shadow-md">
          <Slider {...settings}>
            {product.images.map((img, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="w-full h-64 flex items-center justify-center">
                  <img
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="w-full md:w-1/2 max-w-md flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          {product.rating&&(<div className="flex items-center gap-2">
            <ReactStars
              count={5}
              value={product.rating}
              size={24}
              isHalf={true}
              edit={false}
              activeColor="#facc15"
              emptyIcon={<FaRegStar />}
              halfIcon={<FaStarHalfAlt />}
              fullIcon={<FaStar />}
            />
            <span className="text-gray-600 text-sm">{product.rating.toFixed(1)}</span>
          </div>)}
          
          <p className="text-xl font-semibold text-green-600">₹{product.price}</p>
          <h2 className="mt-4 font-semibold">Description</h2>
          <p className="text-gray-500 text-sm md:text-base">{product.description}</p>

          <div className="flex gap-4 items-center mt-4">
            {product.stock < 1 ? (
              <button className="text-white bg-orange-500 px-4 py-2 rounded">
                Out of Stock
              </button>
            ) : !itemAdded ? (
              <>
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="text-white bg-orange-500 w-10 h-8 rounded"
                  >
                    +
                  </button>
                  <span>{qty}</span>
                  <button
                    onClick={() => setQty(qty > 0 ? qty - 1 : 0)}
                    className="text-white bg-orange-500 w-10 h-8 rounded"
                  >
                    -
                  </button>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="text-white bg-orange-500 px-4 py-2 rounded"
                >
                  Add to Cart
                </button>
              </>
            ) : (
              <Link href="/cart">
                <button className="text-white bg-orange-500 px-4 py-2 rounded">
                  Go to Cart
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
{topProducts.length>0 &&(   <div className="flex flex-col gap-4 p-6">
        <h1 className="font-bold">Top products in this category</h1>
        <div className="overflow-x-auto w-full custom-scrollbar">
          <div className="inline-flex min-w-max gap-6 py-2 px-4 scroll-smooth">
            {topProducts.map((item, index) => (
              <div
                key={index}
                onClick={() => router.push(`/productDetail/${item._id}`)}
                className="flex-shrink-0 w-48 sm:w-40 md:w-48 lg:w-52 shadow-lg rounded-2xl bg-white p-5 flex flex-col hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <div className="relative w-full h-48 md:h-32 lg:h-32 rounded-xl overflow-hidden border border-gray-300">
                  <img
                    src={item.images?.[0] || "/images/photo2.jpg"}
                    alt={item.brand || "Product"}
                  
                    className="object-contain"
                  ></img>
                </div>
                <h3 className="mt-3 font-semibold text-base md:text-lg line-clamp-1">
                  {item.brand || "Product Name"}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-sm rounded-full w-max">
                  ⭐ <span>{item.rating }</span>
                </div>
                <div className="flex items-center justify-between mt-4 gap-2">
                  <p className="text-orange-500 font-semibold text-base md:text-lg">
                    ₹{item.price || 400}
                  </p>
                  <button className="px-5 py-2 border border-orange-600 bg-orange-200 text-orange-600 text-md rounded-full skew-y-[-12deg]">
                    <span className="inline-block skew-x-[-12deg]">+</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>)}
   
    </>
  );
}

// "use client";

// import { useParams } from "next/navigation";
// import { RootState, AppDispatch } from "@/app/redux/store";
// import { useSelector, useDispatch } from "react-redux";
// import Slider from "react-slick";
// import ReactStars from "react-rating-stars-component";
// import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
// import Image from "next/image";
// import Link from "next/link";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { addToCart } from "@/app/redux/cart/cartSlice";
// import { toast } from "react-toastify";
// import { addCartItemDb } from "@/app/redux/cart/cartSlice";

// export default function DetailPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const [qty, setQty] = useState(1);
//   const [itemAdded, setItemAdded] = useState(false);

//   const router = useRouter();
//   const { id } = useParams();
//   const { items } = useSelector((state: RootState) => state.products);

 
//   useEffect(() => {
//     async function isProductExist() {
//       try {
//         const res = await fetch(`http://localhost:3005/cart/product-exist/${id}`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//         });
//         const data = await res.json();
//         setItemAdded(data.success);
//       } catch (err) {
//         console.error("Error checking product in cart:", err);
//       }
//     }
//     isProductExist();
//   }, [id]);

//   const product = items.find((i) => i._id === id);

//   if (!product) {
//     return <p className="text-pink-400 text-center mt-6">Product not found</p>;
//   }

//   const topProducts = items.filter(
//     (item) => item.category === "smartphones" && item.rating > 3.5
//   );

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     arrows: true,
//   };

//   const handleAddToCart = (product: any) => {
//     if (qty < 1) {
//       toast.error("Please select quantity first!");
//       return;
//     }

//     const item = {
//       productId: product._id,
//       title: product.title,
//       price: product.price,
//       description: product.description,
//       image: product.images[0],
//       quantity: qty,
//     };

//     const dbItem = {
//       productId: product._id,
//       price: product.price,
//       quantity: qty,
//     };

//     dispatch(addToCart(item));
//     dispatch(addCartItemDb(dbItem));
//     // setItemAdded(true);
//     // toast.success("Added to cart!");
//   };

//   return (
//     <>
  
//       <div className="flex flex-col md:flex-row gap-8 p-4 md:p-6 justify-center">
   
//         <div className="w-full md:w-1/2 max-w-md border bg-gray-100 rounded-xl p-3 shadow-md">
//           <Slider {...settings}>
//             {product.images.map((img, index) => (
//               <div key={index} className="flex items-center justify-center">
//                 <div className="w-full h-64 flex items-center justify-center">
//                   <img
//                     src={img}
//                     alt={`Slide ${index + 1}`}
//                     className="max-w-full max-h-full object-contain rounded-xl"
//                   />
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </div>

        
//         <div className="w-full md:w-1/2 max-w-md flex flex-col gap-4">
//           <h1 className="text-2xl font-bold">{product.title}</h1>
//           <div className="flex items-center gap-2">
//             <ReactStars
//               count={5}
//               value={product.rating}
//               size={24}
//               isHalf={true}
//               edit={false}
//               activeColor="#facc15"
//               emptyIcon={<FaRegStar />}
//               halfIcon={<FaStarHalfAlt />}
//               filledIcon={<FaStar />}
//             />
//             <span className="text-gray-600 text-sm">{product.rating.toFixed(1)}</span>
//           </div>
//           <p className="text-xl font-semibold text-green-600">₹{product.price}</p>
//           <h2 className="mt-4 font-semibold">Description</h2>
//           <p className="text-gray-500 text-sm md:text-base">{product.description}</p>

          
//           <div className="flex gap-4 items-center mt-4">
            
//             {(!itemAdded) ? (
//               <>
//                 <div className="flex gap-3 items-center">
//                   <button
//                     onClick={() => setQty(qty + 1)}
//                     className="text-white bg-orange-500 w-10 h-8 rounded"
//                   >
//                     +
//                   </button>
//                   <span>{qty}</span>
//                   <button
//                     onClick={() => setQty(qty > 0 ? qty - 1 : 0)}
//                     className="text-white bg-orange-500 w-10 h-8 rounded"
//                   >
//                     -
//                   </button>
//                 </div>
//                 <button
//                   onClick={() => handleAddToCart(product)}
//                   className="text-white bg-orange-500 px-4 py-2 rounded"
//                 >
//                   Add to Cart
//                 </button>
//               </>
//             ) : (
//               <Link href="/cart">
//                 <button className="text-white bg-orange-500 px-4 py-2 rounded">
//                   Go to Cart
//                 </button>
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>

  
//       <div className="flex flex-col gap-4 p-6">
//         <h1 className="font-bold">Top products in this category</h1>
//         <div className="overflow-x-auto w-full custom-scrollbar">
//           <div className="inline-flex min-w-max gap-6 py-2 px-4 scroll-smooth">
//             {topProducts.map((item, index) => (
//               <div
//                 key={index}
//                 onClick={() => router.push(`/productDetail/${item._id}`)}
//                 className="flex-shrink-0 w-48 sm:w-40 md:w-48 lg:w-52 shadow-lg rounded-2xl bg-white p-5 flex flex-col hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
//               >
//                 <div className="relative w-full h-48 md:h-32 lg:h-32 rounded-xl overflow-hidden border border-gray-300">
//                   <Image
//                     src={item.images?.[0] || "/images/photo2.jpg"}
//                     alt={item.brand || "Product"}
//                     fill
//                     className="object-contain"
//                   />
//                 </div>
//                 <h3 className="mt-3 font-semibold text-base md:text-lg line-clamp-1">
//                   {item.brand || "Product Name"}
//                 </h3>
//                 <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-sm rounded-full w-max">
//                   ⭐ <span>{item.rating || 4.5}</span>
//                 </div>
//                 <div className="flex items-center justify-between mt-4 gap-2">
//                   <p className="text-orange-500 font-semibold text-base md:text-lg">
//                     ₹{item.price || 400}
//                   </p>
//                   <button className="px-5 py-2 border border-orange-600 bg-orange-200 text-orange-600 text-md rounded-full skew-y-[-12deg]">
//                     <span className="inline-block skew-x-[-12deg]">+</span>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



