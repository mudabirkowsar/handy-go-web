import React from 'react';

// Design color palette system
const COLORS = {
  primary: "#08B36A",
  secondary: "#0F172A",
  background: "#F8FAFC",
  card: "#FFFFFF",
  text: "#111827",
  subtext: "#6B7280",
  border: "#E5E7EB",
  white: "#FFFFFF",
  danger: "#EF4444",
};

export default function DashboardPage() {
  // Mock data mimicking your schema fields for demo purposes
  const stats = [
    { title: "Total Bookings", value: "1,248", change: "+12% this month", icon: "📈", bg: "bg-blue-50" },
    { title: "Completion Rate", value: "94.2%", change: "Target: >90%", icon: "✅", bg: "bg-emerald-50" },
    { title: "Active Workers", value: "18 / 25", change: "7 Currently on-duty", icon: "👥", bg: "bg-amber-50" },
    { title: "Avg Rating", value: "4.82 / 5", change: "Based on 310 reviews", icon: "⭐", bg: "bg-purple-50" },
  ];

  const recentBookings = [
    { id: "BKG-9081", customer: "Rahul Sharma", service: "AC Deep Cleaning", price: "₹1,499", type: "fixed", status: "In Progress" },
    { id: "BKG-9080", customer: "Priya Patel", service: "Electrical Inspection", price: "₹499", type: "inspection", status: "Completed" },
    { id: "BKG-9079", customer: "Amit Verma", service: "Home Painting (Hourly)", price: "₹650/hr", type: "hourly", status: "Pending Verification" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* 1. Dashboard Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#0F172A] p-6 md:p-8 rounded-xl text-white shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome Back, To Company Dashboard!</h1>
          <p className="text-sm text-slate-400 mt-1">Here is what's happening with your service dispatches today.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="px-4 py-2.5 bg-[#08B36A] hover:bg-emerald-600 font-semibold text-sm rounded-lg transition-all cursor-pointer shadow-sm">
            + Add New Service
          </button>
          <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-sm rounded-lg transition-all cursor-pointer">
            View Analytics
          </button>
        </div>
      </div>

      {/* 2. KPI Analytical Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">{stat.title}</span>
              <span className="text-3xl font-black text-[#111827] mt-1">{stat.value}</span>
              <span className="text-xs font-medium text-[#08B36A] mt-1">{stat.change}</span>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center text-xl`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Detailed Data Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Aspect Grid: Live Booking Desks */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#111827]">Live Dispatch Ledger</h3>
              <p className="text-xs text-[#6B7280]">Monitor critical real-time customer bookings</p>
            </div>
            <span className="text-xs font-semibold text-[#08B36A] bg-emerald-50 px-2.5 py-1 rounded-full cursor-pointer hover:underline">
              View All
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[11px] font-bold uppercase text-[#6B7280] tracking-wider">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Assigned Service</th>
                  <th className="p-4">Base Rate</th>
                  <th className="p-4 pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-sm text-[#111827]">
                {recentBookings.map((bkg) => (
                  <tr key={bkg.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 pl-6 font-mono text-xs font-bold text-slate-500">{bkg.id}</td>
                    <td className="p-4 font-semibold">{bkg.customer}</td>
                    <td className="p-4 text-[#6B7280]">{bkg.service}</td>
                    <td className="p-4 font-medium">
                      {bkg.price}
                      <span className="block text-[10px] text-slate-400 font-normal uppercase">{bkg.type}</span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${bkg.status === "Completed" ? "bg-emerald-50 text-[#08B36A]" :
                          bkg.status === "In Progress" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                        }`}>
                        {bkg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Aspect Grid: Financial Wallet & Verification Guard */}
        <div className="flex flex-col gap-6">

          {/* Box A: Wallet Performance Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-[#111827] mb-4 text-sm uppercase tracking-wider text-slate-400">Financial Ledger</h3>
            <div className="flex items-center justify-between bg-[#F8FAFC] p-4 rounded-lg border border-[#E5E7EB]">
              <div>
                <span className="text-xs text-[#6B7280] font-medium">Withdrawable Balance</span>
                <p className="text-2xl font-black text-[#111827] mt-0.5">₹48,250.00</p>
              </div>
              <button className="px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs rounded-md transition-colors cursor-pointer">
                Payout
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
              <div>
                <span className="text-slate-400 block">Total Earnings</span>
                <span className="font-bold text-[#111827] text-sm">₹2,84,900.00</span>
              </div>
              <div>
                <span className="text-slate-400 block">Commission Share</span>
                <span className="font-bold text-slate-500 text-sm">12% standard</span>
              </div>
            </div>
          </div>

          {/* Box B: System KYC Checklist status */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#111827]">Compliance Check</h3>
              <span className="text-[10px] font-bold text-[#08B36A] uppercase tracking-widest animate-pulse">Live Gateway</span>
            </div>

            <div className="flex flex-col gap-2.5 mt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                <span className="text-slate-600">GSTIN Registration</span>
                <span className="font-bold text-emerald-600">Verified ✓</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                <span className="text-slate-600">Corporate PAN Mapping</span>
                <span className="font-bold text-emerald-600">Verified ✓</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                <span className="text-slate-600">Business Liability Insurance</span>
                <span className="font-bold text-amber-600">Pending Review ⏳</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}