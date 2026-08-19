"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaTachometerAlt, FaBoxOpen, FaUsers, FaShippingFast, FaUser, FaSignOutAlt, FaChartBar } from "react-icons/fa";
import { logout } from "../redux/authSlice";
import { Dispatch } from "react";
import { RootState,AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch=useDispatch<AppDispatch>()

  const navItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, href: "/admin/dashboard" },
    { label: "Orders", icon: <FaBoxOpen />, href: "/admin/allOrders" },
    { label: "Add Products", icon: <FaBoxOpen />, href: "/admin/addProducts" },
     { label: "Products", icon: <FaBoxOpen />, href: "/admin/products" },
    { label: "Customers", icon: <FaUsers />, href: "/admin/customers" },
    { label: "Reports", icon: <FaChartBar />, href: "/admin/reports" },
    // { label: "Shipping", icon: <FaShippingFast />, href: "/admin/shipping" },
  ];

  const bottomItems = [
    { label: "SignUp", icon: <FaUser />, href: "/admin/signup" },
    { label: "Logout", icon: <FaSignOutAlt />, 
        
    },
  ];
   const handleLogout = async () => {
      await fetch("http://localhost:3005/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      dispatch(logout());
         
      router.push("/");
    };
  

  return (
    <div className="flex min-h-screen bg-gray-100">
   
      <aside className={`bg-white shadow-lg ${collapsed ? "w-20" : "w-64"} transition-all duration-300 flex flex-col justify-between`}>
        <div>
     
          <div className="p-4 font-bold text-xl text-pink-500 flex justify-between items-center">
            {!collapsed && <span>Admin Dashboard</span>}
            <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500">
              {collapsed ? "☰" : "✕"}
            </button>
          </div>

        
          <nav className="flex flex-col mt-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-pink-50 hover:text-pink-500 transition-colors ${
                  pathname === item.href ? "bg-pink-100 text-pink-500 font-semibold" : "text-gray-700"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>


       <div className="mb-4">
  {bottomItems.map((item) =>
    item.label === "Logout" ? (
      <button
        key={item.label}
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
      >
        <span className="text-lg">{item.icon}</span>
        {!collapsed && <span>{item.label}</span>}
      </button>
    ) : (
      <Link
        key={item.label}
        href={item.href || "#"} 
        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
      >
        <span className="text-lg">{item.icon}</span>
        {!collapsed && <span>{item.label}</span>}
      </Link>
    )
  )}
</div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
