import Image from "next/image";
import { Button } from "./button";

export default function Banner() {
  return (
    <section className="w-full bg-linear-to-r from-blue-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10">
       
        <div className="flex-1">
          <p className="text-3xl md:text-4xl font-bold mb-4">
            Latest Electronics at Best Prices
          </p>

          <p className="text-lg  text-gray-500 mb-6 ">
            Smartphones, Laptops, and Gadgets at best prices. Upgrade your tech now!
          </p>

          <div className="flex gap-4">
            <Button className="bg-white text-blue-600">
              Shop Now
            </Button>
            <Button className="bg-blue-800 text-white">
              View Details
            </Button>
          </div>
        </div>

        
        <div
          className="
            w-full
            max-w-xs
            h-420px
            rounded-2xl
            bg-white/10
            border border-white/30
            shadow-[0_20px_40px_rgba(0,0,0,0.25)]
            backdrop-blur-md
            flex
            items-center
            justify-center
          "
        >
          <Image
            src="/images/gadgets.jpg"
            alt="Electronics"
            width={330}
            height={380}
            className="object-contain rounded-xl"
            priority
          />
        </div>

      </div>
    </section>
  );
}
