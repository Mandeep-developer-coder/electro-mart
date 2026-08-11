export default function Footer() {
  return (
    <footer className="bg-white py-6 px-10 flex flex-col gap-8 md:flex-row  items-center justify-between">
      <div className="flex flex-col ">
        <div className="flex">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
          <i className="fa-solid fa-truck text-sm"></i>
        </div>

        <span className="text-sm text-gray-700 font-medium mt-3">
          Free Shipping
        </span>
        </div>
        <p className="text-gray-500">On orders over $50</p>
      </div>
      <div className="flex flex-col ">
        <div className="flex">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
         <i className="fa-solid fa-money-check-dollar"></i>
        </div>

        <span className="text-sm text-gray-700 font-medium mt-3">
          Secure Payment
        </span>
        </div>
        <p className="text-gray-500 text-sm">100% secure transactions</p>
      </div>
 <div className="flex flex-col ">
        <div className="flex">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
        <i className="fa-solid fa-circle-question text-sm"></i>
        </div>

        <span className="text-sm text-gray-700 font-medium mt-3">
          24/7 Support
        </span>
        </div>
        <p className="text-gray-500">Always here to help</p>
      </div>

      
    </footer>
  );
}
