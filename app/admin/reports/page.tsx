"use client";

import { useState, useEffect } from "react";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface OrderType {
  _id: string;
  userId: {
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export default function Reports() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "7days" | "30days">("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3005/admin/all-orders", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        setOrders(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Something went wrong while fetching orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders based on the selected time range
  const getFilteredOrders = (): OrderType[] => {
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (timeFilter === "today") {
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      } else if (timeFilter === "7days") {
        const diffTime = Math.abs(now.getTime() - orderDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      } else if (timeFilter === "30days") {
        const diffTime = Math.abs(now.getTime() - orderDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      }
      return true; // "all"
    });
  };

  const filteredOrders = getFilteredOrders();

  // Compute metrics
  const totalOrders = filteredOrders.length;
  const paidOrders = filteredOrders.filter((o) => o.paymentStatus === "PAID");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalItemsSold = filteredOrders.reduce(
    (sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0),
    0
  );

  // Status breakdown metrics
  const deliveredOrdersCount = filteredOrders.filter((o) => o.orderStatus === "DELIVERED").length;
  const pendingOrdersCount = filteredOrders.filter(
    (o) => o.orderStatus === "PENDING" || o.orderStatus === "PROCESSING"
  ).length;
  const cancelledOrdersCount = filteredOrders.filter((o) => o.orderStatus === "CANCELLED").length;
  
  const unpaidOrdersCount = filteredOrders.filter((o) => o.paymentStatus !== "PAID").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Business Reports</h1>
          <p className="text-gray-500 mt-1">Analyze and review sales, order volumes, and payment status details.</p>
        </div>

        {/* Date Filters */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0 bg-white p-1.5 rounded-xl border shadow-xs">
          <button
            onClick={() => setTimeFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              timeFilter === "all"
                ? "bg-pink-500 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeFilter("today")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              timeFilter === "today"
                ? "bg-pink-500 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeFilter("7days")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              timeFilter === "7days"
                ? "bg-pink-500 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeFilter("30days")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              timeFilter === "30days"
                ? "bg-pink-500 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-md p-6 hover:scale-[1.02] transition-transform duration-300">
          <p className="text-sm font-medium opacity-90">Total Revenue (Paid Orders)</p>
          <h2 className="text-3xl font-extrabold mt-3">₹{totalRevenue.toLocaleString("en-IN")}</h2>
        </div>

        {/* Total Orders */}
        <div className="bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-md p-6 hover:scale-[1.02] transition-transform duration-300">
          <p className="text-sm font-medium opacity-90">Total Orders placed</p>
          <h2 className="text-3xl font-extrabold mt-3">{totalOrders.toLocaleString()}</h2>
        </div>

        {/* Average Order Value */}
        <div className="bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-2xl shadow-md p-6 hover:scale-[1.02] transition-transform duration-300">
          <p className="text-sm font-medium opacity-90">Average Order Value (AOV)</p>
          <h2 className="text-3xl font-extrabold mt-3">₹{Math.round(averageOrderValue).toLocaleString("en-IN")}</h2>
        </div>

        {/* Total Items Sold */}
        <div className="bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-md p-6 hover:scale-[1.02] transition-transform duration-300">
          <p className="text-sm font-medium opacity-90">Total Products Sold</p>
          <h2 className="text-3xl font-extrabold mt-3">{totalItemsSold.toLocaleString()}</h2>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Order Status Summary */}
        <div className="bg-white p-6 rounded-2xl border shadow-xs">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Order Fulfillment Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Delivered Orders</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                {deliveredOrdersCount} orders
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Pending / Processing</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                {pendingOrdersCount} orders
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Cancelled Orders</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                {cancelledOrdersCount} orders
              </span>
            </div>
          </div>
        </div>

        {/* Payment Status Summary */}
        <div className="bg-white p-6 rounded-2xl border shadow-xs">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Payment Collection Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Paid (Online / Settled)</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                {paidOrders.length} orders
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Unpaid (Cash on Delivery / Pending)</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">
                {unpaidOrdersCount} orders
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-2xl border shadow-xs overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Filtered Sales & Orders Report</h2>
          <p className="text-sm text-gray-500 mt-1">
            Displaying {filteredOrders.length} orders for the selected time filter.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer Email</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items Count</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Payment Status</th>
                <th className="px-6 py-4">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No orders found matching the filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-700">{order._id}</td>
                    <td className="px-6 py-4 text-gray-600">{order.userId?.email || "Guest"}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)} items
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.paymentStatus === "PAID"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-pink-50 text-pink-700 border border-pink-200"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.orderStatus === "DELIVERED"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : order.orderStatus === "CANCELLED"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
