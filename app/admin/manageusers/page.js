"use client";
import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX,
  Search, 
  SlidersHorizontal, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  Calendar,
  MoreVertical,
  CheckCircle2,
  Ban,
  Trash2
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

export default function ManageUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Mock global user baseline state
  const [users, setUsers] = useState([
    { id: "USR-9021", name: "Aarav Mehta", email: "aarav.mehta@gmail.com", phone: "+91 98765 12345", city: "Mumbai", totalBookings: 24, status: "Active", joinedDate: "Jan 14, 2025" },
    { id: "USR-9022", name: "Diya Sharma", email: "diya.sharma@yahoo.com", phone: "+91 99887 11223", city: "Delhi NCR", totalBookings: 8, status: "Active", joinedDate: "Mar 02, 2025" },
    { id: "USR-9023", name: "Kabir Malhotra", email: "kabir.m@outlook.com", phone: "+91 91234 88888", city: "Bengaluru", totalBookings: 42, status: "Flagged", joinedDate: "Nov 20, 2024" },
    { id: "USR-9024", name: "Riya Sen", email: "riya.sen@gmail.com", phone: "+91 95555 77777", city: "Kolkata", totalBookings: 0, status: "Suspended", joinedDate: "May 10, 2026" },
  ]);

  // Handle updates to user account status
  const handleUpdateStatus = (id, newStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
    setActiveMenuId(null);
    if (selectedUser?.id === id) {
      setSelectedUser(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Diagnostic filtering calculations
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytic card summary metrics
  const totalCount = users.length;
  const activeCount = users.filter(u => u.status === 'Active').length;
  const flaggedCount = users.filter(u => u.status === 'Flagged' || u.status === 'Suspended').length;

  return (
    <div className="flex flex-col gap-6 w-full font-sans">
      
      {/* 1. Header Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">User Account Console</h1>
          <p className="text-sm text-[#6B7280]">Monitor customer metrics, review account activity levels, and manage user privileges.</p>
        </div>
      </div>

      {/* 2. Statistical Metrics Segment */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Global User Registry</span>
            <p className="text-2xl font-black text-[#111827] mt-1">{totalCount} Accounts</p>
          </div>
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-700">
            <Users size={22} />
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Active Customers</span>
            <p className="text-2xl font-black text-[#08B36A] mt-1">{activeCount} Verified</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-[#08B36A]">
            <UserCheck size={22} />
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Restricted / Flagged</span>
            <p className="text-2xl font-black text-[#EF4444] mt-1">{flaggedCount} Flagged</p>
          </div>
          <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-[#EF4444]">
            <UserX size={22} />
          </div>
        </div>
      </div>

      {/* 3. Operational Strip: Search & Filter Layout */}
      <div className="bg-white p-4 border border-[#E5E7EB] rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#08B36A] focus:ring-1 focus:ring-[#08B36A] text-black"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <SlidersHorizontal size={16} className="text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#08B36A]"
          >
            <option value="All">All Standings</option>
            <option value="Active">Active status</option>
            <option value="Flagged">Flagged status</option>
            <option value="Suspended">Suspended status</option>
          </select>
        </div>
      </div>

      {/* 4. Main Tabular Directory Grid */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[11px] font-bold uppercase text-[#6B7280] tracking-wider">
                <th className="p-4 pl-6">User Profile</th>
                <th className="p-4">Contact Gateway</th>
                <th className="p-4">Location Zone</th>
                <th className="p-4">Platform Bookings</th>
                <th className="p-4">Registration Date</th>
                <th className="p-4">Standing</th>
                <th className="p-4 pr-6 text-right">Action Engine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm text-[#111827]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 onClick={() => setSelectedUser(user)} className="font-bold text-[#111827] hover:text-[#08B36A] cursor-pointer transition-colors">{user.name}</h4>
                          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">{user.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-700">{user.email}</div>
                      <div className="text-xs text-slate-400">{user.phone}</div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{user.city}</td>
                    <td className="p-4 font-bold pl-12">{user.totalBookings}</td>
                    <td className="p-4 text-xs text-slate-500 font-medium">{user.joinedDate}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        user.status === "Active" ? "bg-emerald-50 border-emerald-200 text-[#08B36A]" :
                        user.status === "Flagged" ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-red-50 border-red-200 text-[#EF4444]"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    
                    {/* Actions Context Row Dropdown Menu */}
                    <td className="p-4 pr-6 text-right relative">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeMenuId === user.id && (
                        <div className="absolute right-6 top-12 w-44 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 z-50 animate-fadeIn text-left">
                          <button 
                            onClick={() => handleUpdateStatus(user.id, 'Active')}
                            className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <CheckCircle2 size={14} className="text-[#08B36A]" /> Activate Account
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(user.id, 'Flagged')}
                            className="w-full px-4 py-2 text-xs font-semibold text-amber-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <ShieldAlert size={14} /> Flag Account
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(user.id, 'Suspended')}
                            className="w-full px-4 py-2 text-xs font-semibold text-[#EF4444] hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Ban size={14} /> Suspend Access
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-sm text-[#6B7280]">
                    No corporate client profiles match your filtering conditions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Secondary Profile Info Drawer Panel Overlay */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-end z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between border-l border-[#E5E7EB] animate-slideLeft">
            
            <div>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-6">
                <h3 className="text-base font-bold text-[#0F172A]">Detailed Client Dossier</h3>
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
                >
                  ×
                </button>
              </div>

              {/* Identity Display layout */}
              <div className="flex flex-col items-center gap-2 text-center mb-6 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5E7EB]">
                <div className="w-14 h-14 rounded-full bg-[#0F172A] text-white font-bold text-lg flex items-center justify-center shadow-sm">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#111827]">{selectedUser.name}</h4>
                  <p className="text-xs font-mono text-slate-400 font-bold uppercase">{selectedUser.id}</p>
                </div>
                <span className={`px-3 py-0.5 mt-1 rounded-full text-xs font-bold border bg-white ${
                  selectedUser.status === "Active" ? "border-emerald-200 text-[#08B36A]" : "border-red-200 text-[#EF4444]"
                }`}>
                  {selectedUser.status}
                </span>
              </div>

              {/* Attributes Structural Lists */}
              <div className="flex flex-col gap-4 text-xs">
                <h5 className="font-bold text-[#6B7280] uppercase tracking-wider border-b border-slate-100 pb-1">Communication & Location Metadata</h5>
                <div className="flex items-center gap-3 text-slate-700">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <span className="font-medium">{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  <span className="font-medium">{selectedUser.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <MapPin size={16} className="text-slate-400 shrink-0" />
                  <span className="font-medium">{selectedUser.city}, India</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Calendar size={16} className="text-slate-400 shrink-0" />
                  <span>Account Registered: <span className="font-semibold">{selectedUser.joinedDate}</span></span>
                </div>
              </div>
            </div>

            {/* Quick Access Control Buttons at footer */}
            <div className="border-t border-[#E5E7EB] pt-4 flex gap-3">
              {selectedUser.status !== 'Active' ? (
                <button
                  onClick={() => handleUpdateStatus(selectedUser.id, 'Active')}
                  className="flex-1 py-2 bg-[#08B36A] hover:bg-emerald-600 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
                >
                  Unrestrict Client
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateStatus(selectedUser.id, 'Suspended')}
                  className="flex-1 py-2 bg-white hover:bg-red-50 border border-red-200 text-[#EF4444] font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
                >
                  Suspend User
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}