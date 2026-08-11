import { Button } from "@/components/ui/button";
import Image from "next/image";
export const products = [
  "/images/earbud.jpeg",
  "/images/gadgets.jpg",
  "/images/laptop.jpeg",
  "/images/photo2.jpg",
  "/images/smartphone.jpg",
  "/images/earbud.jpeg",
  "/images/gadgets.jpg",
  "/images/laptop.jpeg",
  "/images/photo2.jpg",
  "/images/smartphone.jpg",
];

export const categories = [
  {
    id: 1,
    title: "Smartphones",
    description: "Latest Android & iOS phones",
    image: "/images/smartphone.jpg",
    buttonText: "Shop Phones",
    link: "/products?category=smartphones",
    bgColor: "bg-yellow-100",
  },
  {
    id: 2,
    title: "Laptops",
    description: "Work, gaming & study laptops",
    image: "/images/laptop.jpeg",
    buttonText: "Explore Laptops",
    link: "/products?category=laptops",
    bgColor: "bg-blue-100",
  },
  {
    id: 3,
    title: "Accessories",
    description: "Headphones, chargers & more",
    image: "/images/earbud.jpeg",
    buttonText: "View Accessories",
    link: "/products?category=accessories",
    bgColor: "bg-green-100",
  },
];

export default function Header() {
  return (
    <header>
    
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-10 bg-orange-300 overflow-hidden rounded-xl">
        
       
        <div
          className="absolute right-0 top-0 h-full w-1/2 bg-orange-400 z-0"
          style={{
            clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        />

     
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          
      
          <div className="flex flex-col gap-4 max-w-md">
            <p className="text-black text-xl font-bold">
              Electronics, Delivered fast
            </p>
            <div>
              <p className="text-sm">Quality Products, Quick Deliveries</p>
              <p className="text-sm">Great prices</p>
            </div>
            <Button className="w-fit text-white bg-amber-700">Shop Now</Button>
          </div>

         
          <div className="flex justify-center w-full md:w-1/2">
            <Image
              src="/images/photo2.jpg"
              alt="Electronics"
              width={260}
              height={260}
              className="rounded-full object-cover shadow-lg"
            />
          </div>
        </div>

      </div>


      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col items-center text-center p-6 rounded-xl shadow-md hover:shadow-lg transition ${item.bgColor}`}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={50}
              height={50}
              className="mb-4 object-contain"
            />
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{item.description}</p>
            <Button className="mt-4">{item.buttonText}</Button>
          </div>
        ))}
      </section>
      
        <div className="overflow-hidden py-6 bg-gray-100">

      <div className="flex animate-marquee gap-6">
        
        {products.concat(products).map((src, index) => (
          <div key={index} className="shrink-0 w-15 h-15 relative">
            <Image
              src={src}
              alt={`Product ${index + 1}`}
              fill
              className="object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>
    </div>

    </header>
  );
}
