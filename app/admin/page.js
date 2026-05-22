"use client";
import React, { useState } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  IndianRupee, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  Eye, 
  ExternalLink,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

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

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Top-level cross-platform diagnostic statistics
  const metrics = [
    { title: "Total Registered Companies", value: "342", change: "+24 this week", icon: Building2, bg: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { title: "Pending Verifications", value: "14", change: "Requires immediate review", icon: ShieldAlert, bg: "bg-amber-50 text-amber-600", border: "border-amber-100" },
    { title: "Platform Gross Revenue", value: "₹8,43,900", change: "+18.4% growth matrix", icon: IndianRupee, bg: "bg-emerald-50 text-[#08B36A]", border: "border-emerald-100" },
    { title: "Active System Workers", value: "1,104", change: "Across all provider fleets", icon: CheckCircle2, bg: "bg-purple-50 text-purple-600", border: "border-purple-100" },
  ];

  // Mock application queue tracking company validation pipeline state
  const verificationQueue = [
    { id: "COM-9821", name: "Apex Smart Plumbers", owner: "Sanjay Dutt", type: "Premium", date: "May 18, 2026", status: "Pending Approval" },
    { id: "COM-9819", name: "Z-Core Electricals", owner: "Raman Preet", type: "Basic", date: "May 17, 2026", status: "Documents Uploaded" },
    { id: "COM-9818", name: "Urban Tech Solutions", owner: "Nisha Goel", type: "Enterprise", date: "May 16, 2026", status: "Pending Approval" },
  ];

  // Filter queue records dynamically based on search parameter
  const filteredQueue = verificationQueue.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 w-full font-sans">
      
      {/* 1. Global Platform Greeting Jumbotron */}
      <div className="relative overflow-hidden bg-[#0F172A] p-6 md:p-8 rounded-xl text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#08B36A]/20 text-[#08B36A] px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
              <Sparkles size={12} fill="currentColor"/> Root Engine Live
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Super Admin Control Workspace</h1>
          <p className="text-sm text-slate-400 mt-1">Platform management console: Oversee verified partners, review credentials, and monitor financials.</p>
        </div>
        
        {/* Quick System Action Trigger Group */}
        <div className="flex gap-3 shrink-0 z-10">
          <button className="px-4 py-2.5 bg-[#08B36A] hover:bg-emerald-600 font-semibold text-sm rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-2">
            System Configuration
          </button>
          <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-sm rounded-lg transition-all cursor-pointer">
            Export Master Log
          </button>
        </div>
        
        {/* Background Decorative Abstract Vector */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
      </div>

      {/* 2. Analytical Diagnostic Core Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className={`p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex items-start justify-between hover:shadow-md transition-shadow`}>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">{metric.title}</span>
                <span className="text-2xl font-black text-[#111827] mt-1">{metric.value}</span>
                <span className="text-xs font-semibold text-[#08B36A] flex items-center gap-1 mt-1.5">
                  <TrendingUp size={12} /> {metric.change}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl ${metric.bg} border ${metric.border} flex items-center justify-center`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Operational Data Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column Window: Company KYC Verification Verification Desk */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-[#111827]">Company Approval & KYC Pipeline</h3>
              <p className="text-xs text-[#6B7280]">Incoming corporate registration forms waiting for credential validation</p>
            </div>
            
            {/* Context Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company or owner..."
                className="w-full pl-9 pr-4 py-1.5 border border-[#E5E7EB] rounded-md text-xs focus:outline-none focus:border-[#08B36A] bg-slate-50 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Table Framework */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[11px] font-bold uppercase text-[#6B7280] tracking-wider">
                  <th className="p-4 pl-6">Company ID</th>
                  <th className="p-4">Corporate Entity</th>
                  <th className="p-4">Owner Profile</th>
                  <th className="p-4">Tier Plan</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4 pr-6 text-right">KYC Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-sm text-[#111827]">
                {filteredQueue.length > 0 ? (
                  filteredQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-4 pl-6 font-mono text-xs font-bold text-slate-400">{item.id}</td>
                      <td className="p-4 font-bold text-[#111827] group-hover:text-[#08B36A] transition-colors flex items-center gap-1 cursor-pointer">
                        {item.name} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#08B36A]" />
                      </td>
                      <td className="p-4 text-[#6B7280] font-medium">{item.owner}</td>
                      <td className="p-4">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          item.type === "Enterprise" ? "bg-purple-100 text-purple-700" :
                          item.type === "Premium" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500 font-medium">{item.date}</td>
                      <td className="p-4 pr-6 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-full text-xs font-bold text-amber-700 border border-amber-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-xs text-[#6B7280] font-medium">
                      No matching pending corporate validations detected.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column Window: Security Audits & System Logs */}
        <div className="flex flex-col gap-6">
          
          {/* Security Alert Feed Box */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col h-full">
            <h3 className="font-bold text-sm text-[#111827] border-b border-[#E5E7EB] pb-3 mb-4 flex items-center justify-between">
              <span>Security Event Feed</span>
              <span className="text-[10px] font-bold text-[#EF4444] border border-red-200 bg-red-50 px-2 py-0.5 rounded">Realtime Monitoring</span>
            </h3>
            
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex gap-3 items-start border-l-2 border-red-500 pl-3 py-0.5 text-xs">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-[#111827]">Failed Insurance Validation Hook</p>
                  <p className="text-[#6B7280]">Company ID <span className="font-mono bg-slate-50 px-1 border rounded">COM-4012</span> uploaded corrupted or unreadable payload.</p>
                  <span className="text-[10px] text-slate-400 font-semibold">2 minutes ago</span>
                </div>
              </div>

              <div className="flex gap-3 items-start border-l-2 border-amber-500 pl-3 py-0.5 text-xs">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-[#111827]">Flagged Location Anomaly</p>
                  <p className="text-[#6B7280]">Geo-coordinates for service dispatch radius fell outside operational country polygon thresholds.</p>
                  <span className="text-[10px] text-slate-400 font-semibold">1 hour ago</span>
                </div>
              </div>

              <div className="flex gap-3 items-start border-l-2 border-emerald-500 pl-3 py-0.5 text-xs">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-[#111827]">System Backup Completed</p>
                  <p className="text-[#6B7280]">All document stores and wallet collections mirrored safely across cluster instances.</p>
                  <span className="text-[10px] text-slate-400 font-semibold">3 hours ago</span>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 text-center text-xs font-bold text-[#08B36A] hover:underline cursor-pointer pt-3 border-t border-[#E5E7EB] flex items-center justify-center gap-1">
              Open System Logs <ExternalLink size={12} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}