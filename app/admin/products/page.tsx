"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Products() {
  const [pages, setPage] = useState(1);
  const router=useRouter()
  const [totalpages, setTotalPages] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `http://localhost:3005/products/get-products?page=${pages}&limit=${8}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    };
    fetchProducts();
  }, [pages]);

  const handleEdit = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    router.push(`/admin/editProduct/${item._id}`)
  
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:3005/products/delete-product/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(data.msg || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((item, index) => (
        <div
          key={index}
          className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col cursor-pointer"
        >
      
          <i
            className="fa-regular fa-pen-to-square text-green-600 hover:text-green-800 absolute top-4 right-12 cursor-pointer text-lg"
            onClick={(e) => handleEdit(e, item)}
          ></i>

          <i
            className="fa-regular fa-trash-can text-red-600 hover:text-red-800 absolute top-4 right-4 cursor-pointer text-lg"
            onClick={(e) => handleDelete(e, item._id)}
          ></i>

          <img
            className="h-48 w-full object-contain rounded-xl bg-gray-100"
            src={item.images?.[0]}
          />

          <div className="mt-4 flex flex-col gap-2 flex-grow">
            <h2 className="text-lg font-semibold">
              {item.brand} | {item.title}
            </h2>

            <p className="text-sm text-gray-600 line-clamp-2">
              {item.description}
            </p>

            <div className="flex justify-between items-center mt-2">
              <p className="text-base font-bold text-gray-800">
                ₹{item.price}
              </p>

              <p
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.stock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.stock > 0
                  ? `In Stock (${item.stock})`
                  : "Out of Stock"}
              </p>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button disabled={pages==1} onClick={()=>setPage(pages-1)} className={`px-4 py-2 rounded-lg border transition ${
      pages === 1
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-white hover:bg-gray-100"
    }`}
  >
    Prev</button>

  <span className="font-medium">
    Page {pages} {totalpages && `of ${totalpages}`}
  </span>
  <button disabled={pages==totalpages} onClick={()=>setPage(pages+1)} className={`px-4 py-2 rounded-lg border transition ${
    pages==totalpages? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-white hover:bg-gray-100"
  }`}>Next</button>
      </div>
    </div>
  );
}
