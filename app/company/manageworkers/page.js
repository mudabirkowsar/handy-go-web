"use client";
import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Star, 
  Search, 
  Plus, 
  X, 
  Phone, 
  Mail, 
  Briefcase, 
  SlidersHorizontal,
  Trash2,
  Edit2,
  AlertTriangle
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

export default function ManageWorkersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sample workers array mapping directly to your schema design
  const [workers, setWorkers] = useState([
    { id: "WRK-4021", name: "Amit Kumar", phone: "+91 98765 43210", email: "amit.k@company.com", primarySkill: "AC & Refrigeration", status: "Active", rating: 4.9, activeBookings: 2 },
    { id: "WRK-4022", name: "Vikram Singh", phone: "+91 99887 76655", email: "vikram.s@company.com", primarySkill: "Electrician", status: "Active", rating: 4.7, activeBookings: 0 },
    { id: "WRK-4023", name: "Suresh Sharma", phone: "+91 91234 56789", email: "suresh.s@company.com", primarySkill: "Plumbing Technician", status: "On Duty", rating: 4.8, activeBookings: 1 },
    { id: "WRK-4024", name: "Rohan Verma", phone: "+91 95555 44444", email: "rohan.v@company.com", primarySkill: "Home Painting", status: "Inactive", rating: 4.2, activeBookings: 0 },
  ]);

  const [newWorker, setNewWorker] = useState({
    name: '',
    phone: '',
    email: '',
    primarySkill: '',
  });

  const handleAddWorker = (e) => {
    e.preventDefault();
    const newWorkerObject = {
      id: `WRK-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newWorker,
      status: 'Active',
      rating: 5.0,
      activeBookings: 0
    };
    setWorkers([newWorkerObject, ...workers]);
    setIsModalOpen(false);
    setNewWorker({ name: '', phone: '', email: '', primarySkill: '' });
  };

  // Compute dynamic stats based on your state engine
  const totalWorkersCount = workers.length;
  const availableWorkersCount = workers.filter(w => w.status === 'Active' || w.status === 'On Duty').length;
  const fleetAverageRating = (workers.reduce((acc, curr) => acc + curr.rating, 0) / totalWorkersCount).toFixed(2);

  // Filter criteria logic
  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          worker.primarySkill.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || worker.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 w-full font-sans">
      
      {/* 1. Header Segment */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Workers Directory</h1>
          <p className="text-sm text-[#6B7280]">Manage, deploy, and monitor your on-field corporate service personnel.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#08B36A] hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus size={18} />
          Onboard New Worker
        </button>
      </div>

      {/* 2. Statistical Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Total Workforce</span>
            <p className="text-2xl font-black text-[#111827] mt-1">{totalWorkersCount} Registered</p>
          </div>
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-700">
            <Users size={22} />
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Operational Fleet</span>
            <p className="text-2xl font-black text-[#08B36A] mt-1">{availableWorkersCount} Active</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center text-[#08B36A]">
            <UserCheck size={22} />
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Average Rating</span>
            <p className="text-2xl font-black text-amber-500 mt-1">{fleetAverageRating} / 5.0</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center text-amber-500">
            <Star size={22} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* 3. Filtering Utility Control Strip */}
      <div className="bg-white p-4 border border-[#E5E7EB] rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search workers by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#08B36A] focus:ring-1 focus:ring-[#08B36A]"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <SlidersHorizontal size={16} className="text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#111827] focus:outline-none focus:border-[#08B36A]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="On Duty">On Duty Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* 4. Workers Matrix Tabulation Grid */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[11px] font-bold uppercase text-[#6B7280] tracking-wider">
                <th className="p-4 pl-6">Worker ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Specialization</th>
                <th className="p-4">Score</th>
                <th className="p-4">Active Jobs</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm text-[#111827]">
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs font-bold text-slate-400">{worker.id}</td>
                    <td className="p-4 font-semibold text-[#111827]">{worker.name}</td>
                    <td className="p-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium mb-0.5">
                        <Phone size={12} className="text-slate-400" /> {worker.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Mail size={12} className="text-slate-400" /> {worker.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">
                        <Briefcase size={12} className="text-slate-500" />
                        {worker.primarySkill}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-amber-500">
                      <div className="flex items-center gap-1">
                        <Star size={14} fill="currentColor" /> {worker.rating}
                      </div>
                    </td>
                    <td className="p-4 font-semibold pl-10">{worker.activeBookings}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        worker.status === "On Duty" ? "bg-blue-50 text-blue-600" :
                        worker.status === "Active" ? "bg-emerald-50 text-[#08B36A]" : "bg-red-50 text-[#EF4444]"
                      }`}>
                        {worker.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-3 text-xs">
                        <button className="flex items-center gap-1 text-[#08B36A] hover:underline font-bold cursor-pointer">
                          <Edit2 size={13} /> Edit
                        </button>
                        <button className="flex items-center gap-1 text-[#EF4444] hover:underline font-bold cursor-pointer">
                          <Trash2 size={13} /> Suspend
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-sm text-[#6B7280]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertTriangle size={24} className="text-slate-300" />
                      <span>No service professionals match your filtering parameters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Add Worker Sliding Context Window / Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-lg w-full max-w-md p-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Onboard Service Professional</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddWorker} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#111827]">Worker Full Name *</label>
                <input
                  type="text"
                  required
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3 py-2 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#08B36A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#111827]">Mobile Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={newWorker.phone}
                  onChange={(e) => setNewWorker({...newWorker, phone: e.target.value})}
                  placeholder="e.g. +91 99999 88888"
                  className="w-full px-3 py-2 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#08B36A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#111827]">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  value={newWorker.email}
                  onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#08B36A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#111827]">Primary Skill Category *</label>
                <input
                  type="text"
                  required
                  value={newWorker.primarySkill}
                  onChange={(e) => setNewWorker({...newWorker, primarySkill: e.target.value})}
                  placeholder="e.g. Carpenter, Plumber, Electrician"
                  className="w-full px-3 py-2 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#08B36A]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-[#E5E7EB] pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md text-sm font-semibold border border-[#E5E7EB] text-[#111827] hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-[#08B36A] hover:opacity-90 cursor-pointer"
                >
                  Register Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}