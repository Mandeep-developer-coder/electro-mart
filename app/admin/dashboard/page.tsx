"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
interface SaleData {
  date: string;
  total: number;
}

export default function Dashboard() {
  interface DetailType {
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    totalSales: number;
  }

  const [detail, setDetail] = useState<DetailType | null>(null);
  const [sales, setSales] = useState<SaleData[]>([]);

  useEffect(() => {
    const dashboardDetail = async () => {
      const res = await fetch("http://localhost:3005/admin/dashboard", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setDetail(data);
    };
    dashboardDetail();
  }, []);
  useEffect(() => {
    const fetchSales = async () => {
      const res = await fetch("http://localhost:3005/admin/sale-graph", {
        method: "GET",
        credentials: "include",
      });
      const data: SaleData[] = await res.json();
      setSales(data);
    };

    fetchSales();
  }, []);

  const cardData = [
    { label: "Total Users", value: detail?.totalUsers || 0 },
    { label: "Total Products", value: detail?.totalProducts || 0 },
    { label: "Total Orders", value: detail?.totalOrders || 0 },
    { label: "Total Sales", value: detail?.totalSales || 0, prefix: "₹" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-linear-to-r from-purple-600 to-indigo-600
                       text-white rounded-2xl shadow-xl p-6
                       flex flex-col justify-between
                       hover:scale-105 transition-transform duration-300
                       warp-break-words "
          >
            <p className="font-medium opacity-90">{card.label}</p>
            <h2 className="font-bold mt-4 break-all">
              {card.prefix ? card.prefix : ""}
              {typeof card.value === "number"
                ? card.value.toLocaleString("en-IN")
                : card.value}
            </h2>
          </div>
        ))}
      </div>
        <div className="w-full h-80 p-4 bg-white rounded-2xl shadow-lg ">
      <h2 className="text-xl font-bold mb-4">Last 30 Days Sales</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sales}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
        <Tooltip
          formatter={(value: any) =>
            value !== undefined && value !== null ? `₹${Number(value).toLocaleString()}` : "₹0"
          }
        />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#6B46C1"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
}
