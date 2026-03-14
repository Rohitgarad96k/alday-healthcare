import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Welcome back. Here's what's happening with your store today.</p>
      </div>
      
      {/* Responsive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">₹1,24,500</span>
          <span className="text-sm text-green-500 mt-2 font-medium bg-green-50 w-max px-2 py-1 rounded-md">↑ 12% from last month</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Orders</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">142</span>
          <span className="text-sm text-green-500 mt-2 font-medium bg-green-50 w-max px-2 py-1 rounded-md">↑ 5% from last month</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Products</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">84</span>
          <span className="text-sm text-red-500 mt-2 font-medium bg-red-50 w-max px-2 py-1 rounded-md">12 Low in stock</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customers</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">1,204</span>
          <span className="text-sm text-green-500 mt-2 font-medium bg-green-50 w-max px-2 py-1 rounded-md">↑ 18 new this week</span>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
          <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/80 transition-colors">
                <td className="p-4 font-semibold text-slate-800">#ORD-001</td>
                <td className="p-4 text-gray-600">Sarah Jenkins</td>
                <td className="p-4 text-gray-500 text-sm">Today, 10:24 AM</td>
                <td className="p-4 font-semibold text-slate-800">₹1,240.00</td>
                <td className="p-4"><span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">Processing</span></td>
              </tr>
              <tr className="hover:bg-gray-50/80 transition-colors">
                <td className="p-4 font-semibold text-slate-800">#ORD-002</td>
                <td className="p-4 text-gray-600">Michael Chen</td>
                <td className="p-4 text-gray-500 text-sm">Yesterday, 4:30 PM</td>
                <td className="p-4 font-semibold text-slate-800">₹450.00</td>
                <td className="p-4"><span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">Shipped</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;