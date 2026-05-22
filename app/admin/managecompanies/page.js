"use client";
import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  FileText, 
  AlertCircle,
  ExternalLink,
  ChevronRight
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

export default function ManageCompaniesPage() {
  const [activeTab, setActiveTab] = useState('pending'); // pending | approved | rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);

  // Mock corporate data mapping directly to your schema design properties
  const [companies, setCompanies] = useState([
    {
      id: "COM-7012",
      companyName: "Hyperion Facility Management",
      ownerName: "Aman Malhotra",
      companyEmail: "onboarding@hyperion.in",
      companyPhone: "+91 98123 45670",
      gstNumber: "07AAAAA1111A1Z1",
      panNumber: "ABCDE1234F",
      verificationStatus: "pending",
      companySize: "26-50",
      foundedYear: 2021,
      city: "New Delhi"
    },
    {
      id: "COM-7013",
      companyName: "BlueCollar Electro-Mechanical Ltd",
      ownerName: "Harpreet Singh",
      companyEmail: "contact@bluecollar.com",
      companyPhone: "+91 91122 33445",
      gstNumber: "06BBBBB2222B2Z2",
      panNumber: "WXYZR9876Q",
      verificationStatus: "pending",
      companySize: "100+",
      foundedYear: 2018,
      city: "Gurugram"
    },
    {
      id: "COM-5001",
      companyName: "EcoClean Deep Cleaning Specialists",
      ownerName: "Meera Nair",
      companyEmail: "meera@ecoclean.org",
      companyPhone: "+91 95678 12345",
      gstNumber: "32CCCCC3333C3Z3",
      panNumber: "PLMKO7412N",
      verificationStatus: "approved",
      companySize: "11-25",
      foundedYear: 2023,
      city: "Mumbai"
    }
  ]);

  // Status adjustment workflows updating verification state hooks
  const handleUpdateStatus = (id, nextStatus, reason = "") => {
    setCompanies(prev => prev.map(company => {
      if (company.id === id) {
        return { 
          ...company, 
          verificationStatus: nextStatus,
          rejectionReason: reason,
          verifiedAt: nextStatus === 'approved' ? new Date() : undefined
        };
      }
      return company;
    }));
    setShowActionModal(false);
    setSelectedCompany(null);
    setRejectionReason('');
  };

  // Compute dynamic category filter lists
  const filteredCompanies = companies.filter(company => {
    const matchesTab = company.verificationStatus === activeTab;
    const matchesSearch = company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          company.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Structural dynamic counters matching metrics arrays
  const countByStatus = (status) => companies.filter(c => c.verificationStatus === status).length;

  return (
    <div className="flex flex-col gap-6 w-full font-sans">
      
      {/* 1. Header Area Layout */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Company Verification Desk</h1>
        <p className="text-sm text-[#6B7280]">Audit credentials, evaluate registration files, and manage live access statuses.</p>
      </div>

      {/* 2. Interactive Navigation Filtering Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-px">
        <div className="flex gap-2">
          {[
            { id: 'pending', name: 'Pending Review', icon: Clock, count: countByStatus('pending'), color: 'text-amber-600 bg-amber-50 border-amber-200' },
            { id: 'approved', name: 'Approved Partners', icon: ShieldCheck, count: countByStatus('approved'), color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            { id: 'rejected', name: 'Rejected Applications', icon: XCircle, count: countByStatus('rejected'), color: 'text-red-600 bg-red-50 border-red-200' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer relative ${
                  isActive ? 'border-[#08B36A] text-[#08B36A]' : 'border-transparent text-[#6B7280] hover:text-[#0F172A]'
                }`}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${
                  isActive ? tab.color : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Table Filter Input */}
        <div className="relative w-full sm:w-72 mb-2 sm:mb-0">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search enterprise or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#08B36A] text-black"
          />
        </div>
      </div>

      {/* 3. Companies Registry Display Grid */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[11px] font-bold uppercase text-[#6B7280] tracking-wider">
                <th className="p-4 pl-6">Company Profile</th>
                <th className="p-4">Primary Contact</th>
                <th className="p-4">Tax / Legal Identification</th>
                <th className="p-4">Size & Scale</th>
                <th className="p-4">Location</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm text-[#111827]">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Column 1: Core Branding Frame */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold border border-slate-200">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#111827]">{company.companyName}</h4>
                          <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">{company.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Operator Metadata */}
                    <td className="p-4">
                      <p className="font-semibold">{company.ownerName}</p>
                      <p className="text-xs text-[#6B7280]">{company.companyEmail}</p>
                    </td>

                    {/* Column 3: Corporate Identification Parameters */}
                    <td className="p-4 text-xs font-medium">
                      <div className="flex items-center gap-1"><FileText size={12} className="text-slate-400" /> GST: <span className="font-mono uppercase font-bold">{company.gstNumber}</span></div>
                      <div className="flex items-center gap-1 mt-0.5 text-slate-500"><FileText size={12} className="text-slate-400" /> PAN: <span className="font-mono uppercase">{company.panNumber}</span></div>
                    </td>

                    {/* Column 4: Operational Metrics */}
                    <td className="p-4">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {company.companySize} Crew members
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1">Est. {company.foundedYear}</span>
                    </td>

                    {/* Column 5: Location */}
                    <td className="p-4 font-medium text-slate-600">{company.city}</td>

                    {/* Column 6: Action Engine Row */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => { setSelectedCompany(company); setShowActionModal(true); }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#E5E7EB] hover:bg-slate-50 font-bold text-xs rounded-lg text-[#0F172A] transition-all cursor-pointer"
                      >
                        Review Application <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-sm text-[#6B7280] font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle size={24} className="text-slate-300" />
                      <span>No company records matching your filter parameters are currently available.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Action Verification Modal Overlay Panel */}
      {showActionModal && selectedCompany && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            
            {/* Modal Top Header Bar */}
            <div className="p-5 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Review Corporate Credentials</h2>
                <p className="text-xs text-[#6B7280]">Validate structural payload properties for: <span className="font-bold">{selectedCompany.companyName}</span></p>
              </div>
              <button 
                onClick={() => { setShowActionModal(false); setSelectedCompany(null); setRejectionReason(''); }}
                className="text-slate-400 hover:text-slate-600 text-xl cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Modal Corporate Data Matrix */}
            <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-[#E5E7EB] pb-4">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase tracking-wider">Legal Registered Name</span>
                  <span className="text-sm font-bold text-[#111827]">{selectedCompany.companyName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase tracking-wider">Managing Director</span>
                  <span className="text-sm font-bold text-[#111827]">{selectedCompany.ownerName}</span>
                </div>
                <div className="mt-2">
                  <span className="text-slate-400 block font-semibold uppercase tracking-wider">Corporate Email</span>
                  <span className="text-slate-700 font-medium">{selectedCompany.companyEmail}</span>
                </div>
                <div className="mt-2">
                  <span className="text-slate-400 block font-semibold uppercase tracking-wider">Corporate Hotline</span>
                  <span className="text-slate-700 font-medium">{selectedCompany.companyPhone}</span>
                </div>
              </div>

              {/* Document File Check row simulation */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#111827]">Uploaded Compliance Attachments</span>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'GSTIN Certificate Asset', value: selectedCompany.gstNumber },
                    { label: 'Permanent Account Number (PAN)', value: selectedCompany.panNumber }
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText size={14} className="text-slate-400 shrink-0" />
                        <span className="text-slate-700 font-medium truncate"><span className="font-bold">{doc.label}:</span> {doc.value}</span>
                      </div>
                      <a href="#view" className="text-[#08B36A] hover:underline font-bold flex items-center gap-0.5 shrink-0 ml-2">
                        View <ExternalLink size={11} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Conditional Rejection Field UI */}
              {selectedCompany.verificationStatus !== 'approved' && (
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-xs font-bold text-[#111827]">Rejection Logs <span className="text-slate-400 font-normal">(Only processed on Denial action)</span></label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide compliance rejection issue details (e.g., GSTIN numbers mismatched, document scan blur)..."
                    className="w-full p-3 border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:border-[#08B36A] text-black"
                  />
                </div>
              )}
            </div>

            {/* Modal Structural Action Footer Steering Strip */}
            <div className="p-4 border-t border-[#E5E7EB] bg-slate-50 flex flex-col sm:flex-row sm:justify-between items-center gap-3">
              <div>
                {selectedCompany.verificationStatus === 'rejected' && selectedCompany.rejectionReason && (
                  <p className="text-[11px] text-[#EF4444] font-medium max-w-xs">
                    <span className="font-bold">Prior Rejection Logic:</span> {selectedCompany.rejectionReason}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                {selectedCompany.verificationStatus !== 'rejected' && (
                  <button
                    type="button"
                    disabled={!rejectionReason.trim()}
                    onClick={() => handleUpdateStatus(selectedCompany.id, 'rejected', rejectionReason)}
                    className="px-4 py-2 bg-white hover:bg-red-50 border border-red-200 text-[#EF4444] font-bold text-xs rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Reject Partner
                  </button>
                )}
                {selectedCompany.verificationStatus !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedCompany.id, 'approved')}
                    className="px-4 py-2 bg-[#08B36A] hover:opacity-90 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    Approve & Verify
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}