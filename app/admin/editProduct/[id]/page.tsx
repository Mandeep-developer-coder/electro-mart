"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
export default function EditProduct() {
  const [product, setProduct] = useState<any>(null);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `http://localhost:3005/products/fetch-product/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
      } else {
        console.error(data.message || "Product fetch failed");
      }
    };
    fetchProducts();
  }, [id]);
  const handleEdit = async () => {
    const res = await fetch(
      `http://localhost:3005/products/edit-product/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
        credentials: "include",
      },
    );
    const data = await res.json();
    if(data.success){
        setProduct(data.product);
        toast.success(data.msg)

    }
    else{
        toast.error(data.msg)
    }
    
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Product</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <img
            src={product.images?.[0]}
            className="w-64 h-64 object-contain rounded-2xl border border-gray-200 shadow-sm"
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Product Title</label>
            <input
              type="text"
              value={product.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Price</label>
            <input
              type="text"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Category</label>
            <input
              type="text"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Brand</label>
            <input
              type="text"
              value={product.brand}
              onChange={(e) =>
                setProduct({ ...product, brand: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Description</label>
            <textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-none overflow-y-auto text-sm focus:ring-2 focus:ring-green-300 outline-none"
            />
          </div>

          <Button
            onClick={handleEdit}
            className="bg-green-600 hover:bg-green-700 text-white w-40 mt-4"
          >
            Save Changes
          </Button>
        </div>
      </div>
   <div className="mt-6 p-4 bg-white rounded-2xl shadow-md flex items-center gap-4">

  <span
    className={`px-3 py-1 rounded-full font-medium ${
      product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
  </span>

  
  <input
    type="number"
    value={product.stock}

  onChange={(e) => {
    const value = Number(e.target.value);
    if (value < 0) return; 
    setProduct({ ...product, stock: value });
  }}
    className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-300 outline-none flex-1"
   
  />


  <Button
    onClick={() => handleEdit()}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
  >
    Update Stock
  </Button>
</div>

    </div>
  );
}
