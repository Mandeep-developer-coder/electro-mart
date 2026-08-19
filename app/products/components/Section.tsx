"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchProducts } from "@/app/redux/products/productThunk";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter, useSearchParams } from "next/navigation";


export default function Section() {
    const router=useRouter()
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const dispatch = useDispatch<AppDispatch>();
  const { page, items, loading, totalPage } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 2, category }));
  }, [dispatch, category]);

  const fetchData = () => {
    if (page < totalPage) {
      dispatch(fetchProducts({ page: page + 1, limit: 2, category }));
    }
  };

  return (
    <section className="mt-10 flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <InfiniteScroll
        className="p-4"
        dataLength={items.length}
        next={fetchData}
        hasMore={page < totalPage}
        loader={
          <div className="flex justify-center mt-6">
            <div className="w-12 h-12 border-4 border-yellow-700 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
       
      >
        <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {items.map((item, index) => (
            <div
              key={index} onClick={()=>router.push(`/productDetail/${item._id}`)}
              className="shadow-lg rounded-2xl bg-white p-5 flex flex-col hover:shadow-2xl transition-shadow duration-300"
            >
       
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-300">
  <img
    src={item.images?.[0] || "/images/photo2.jpg"}
    alt={item.brand || "Product"}
    className="w-full h-full object-contain"
  />
</div>


              <h3 className="mt-3 font-semibold text-base md:text-lg line-clamp-1">
                {item.brand || "Product Name"}
              </h3>

            
              <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-sm rounded-full w-max">
                ⭐ <span>{item.rating || 4.5}</span>
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
      </InfiniteScroll>
    </section>
  );
}
