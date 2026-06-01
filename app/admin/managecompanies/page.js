"use client";
import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, CheckCircle2, XCircle, Search, Clock, ShieldCheck,
  FileText, AlertCircle, ExternalLink, ChevronRight, Loader2, RefreshCw,
  User, Phone, Mail, MapPin, Briefcase, DollarSign, Award, Calendar
} from 'lucide-react';
import { fetchAllCompanies, adminVerifyCompany } from '../../service/AdminAPI';

export default function ManageCompaniesPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch Data
  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAllCompanies();

      if (res.success) {
        setCompanies(res.data || []);
      }
    } catch (err) {
      setError("Connection Error: Could not reach the administration server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // 2. Approve Action
  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      const res = await adminVerifyCompany(id, { status: 'approved' });

      if (res.success) {
        setCompanies(prev => prev.map(c => c._id === id ? { ...c, verificationStatus: 'approved' } : c));
        closeModal();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Reject Action
  const handleReject = async (id) => {
    if (!rejectionReason.trim()) return alert("Please provide a reason for rejection.");

    try {
      setActionLoading(true);
      const res = await adminVerifyCompany(id, {
        status: 'rejected',
        rejectionReason: rejectionReason
      });

      if (res.success) {
        setCompanies(prev => prev.map(c => c._id === id ? { ...c, verificationStatus: 'rejected', rejectionReason: rejectionReason } : c));
        closeModal();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  const closeModal = () => {
    setShowActionModal(false);
    setSelectedCompany(null);
    setRejectionReason('');
  };

  // Filtering
  const filteredCompanies = companies.filter(c => {
    const matchesTab = c.verificationStatus === activeTab;
    const matchesSearch = c.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-emerald-500 mb-2" size={32} />
      <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Loading Registry...</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 italic uppercase">Verification Center</h1>
          <p className="text-slate-500 text-sm">Reviewing {companies.length} registered organizations</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search companies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:border-emerald-500 w-64 bg-white"
            />
          </div>
          <button onClick={loadCompanies} className="p-2 hover:bg-white border rounded-xl transition-all">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2 font-bold text-sm"><AlertCircle size={18} /> {error}</div>}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        {['pending', 'approved', 'rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-black uppercase tracking-tighter transition-all ${activeTab === tab ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-400'}`}
          >
            {tab} ({companies.filter(c => c.verificationStatus === tab).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        {filteredCompanies.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium">No companies found in this section.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-6">Company Name</th>
                <th className="p-6">Contact</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompanies.map(company => (
                <tr key={company._id} className="hover:bg-slate-50/50 transition-all">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        {company.companyLogo ? <img src={company.companyLogo} alt="Logo" className="w-full h-full object-cover rounded-xl" /> : <Building2 size={20} />}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">{company.companyName}</span>
                        <span className="text-xs text-slate-400">Owner: {company.ownerName || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-slate-500 font-medium">
                    <div>{company.companyPhone}</div>
                    <div className="text-xs text-slate-400">{company.companyEmail}</div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${company.verificationStatus === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                        company.verificationStatus === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                      {company.verificationStatus}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button onClick={() => { setSelectedCompany(company); setShowActionModal(true); }} className="text-slate-900 font-bold text-xs bg-slate-50 border px-4 py-2 rounded-xl hover:bg-white transition-all">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Verification Modal */}
      {showActionModal && selectedCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-black text-slate-900 italic uppercase">AUDIT CONSOLE</h2>
                <p className="text-xs text-slate-500">ID: {selectedCompany._id}</p>
              </div>
              <button onClick={closeModal}><XCircle className="text-slate-300 hover:text-slate-500" size={24} /></button>
            </div>

            {/* Modal Body (Scrollable container) */}
            <div className="p-8 space-y-8 overflow-y-auto flex-1 text-slate-700">
              
              {/* SECTION 1: Core Profile */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden shadow-sm">
                    {selectedCompany.companyLogo ? <img src={selectedCompany.companyLogo} alt="Logo" className="w-full h-full object-cover" /> : <Building2 size={32} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedCompany.companyName}</h3>
                    <p className="text-sm text-slate-500 italic max-w-md">{selectedCompany.description || "No business description provided yet."}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="font-semibold text-slate-400 uppercase">Verification status:</span>
                    <span className="font-black text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded-md">{selectedCompany.verificationStatus}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="font-semibold text-slate-400 uppercase">Subscription:</span>
                    <span className="font-black text-purple-600 uppercase bg-purple-50 px-2 py-0.5 rounded-md">{selectedCompany.subscriptionPlan}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column: Communications & Corporate Identification */}
                <div className="space-y-6">
                  {/* Contacts Block */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><User size={14}/> Primary Registry Contacts</h4>
                    <div className="border border-slate-100 rounded-2xl p-4 space-y-3 bg-white shadow-sm">
                      <div className="flex items-center justify-between text-sm pb-2 border-b border-slate-50">
                        <span className="text-slate-400 font-medium">Authorized Owner</span>
                        <span className="font-bold text-slate-800">{selectedCompany.ownerName || 'Not Stated'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-medium flex items-center gap-1"><Phone size={14}/> Company Phone</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-800 block">{selectedCompany.companyPhone}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${selectedCompany.isPhoneVerified ? 'bg-emerald-50 text-emerald-600':'bg-red-50 text-red-500'}`}>
                            {selectedCompany.isPhoneVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-50">
                        <span className="text-slate-400 font-medium flex items-center gap-1"><Mail size={14}/> Company Email</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-800 block">{selectedCompany.companyEmail}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${selectedCompany.isEmailVerified ? 'bg-emerald-50 text-emerald-600':'bg-red-50 text-red-500'}`}>
                            {selectedCompany.isEmailVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Corporate Identifications */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><ShieldCheck size={14}/> Corporate Identifications</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">GST Number</span>
                        <span className="text-sm font-mono font-bold text-slate-800">{selectedCompany.gstNumber || 'N/A'}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">PAN Number</span>
                        <span className="text-sm font-mono font-bold text-slate-800">{selectedCompany.panNumber || 'N/A'}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">CIN Number</span>
                        <span className="text-sm font-mono font-bold text-slate-800">{selectedCompany.cinNumber || 'N/A'}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Business Reg. No</span>
                        <span className="text-sm font-mono font-bold text-slate-800">{selectedCompany.businessRegistrationNumber || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Settings */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><MapPin size={14}/> Logistical Footprint</h4>
                    <div className="border border-slate-100 rounded-2xl p-4 space-y-3 bg-white shadow-sm">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-medium">Service Radius</span>
                        <span className="font-bold text-slate-800">{selectedCompany.serviceRadiusKm} Km</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-medium">Current Registered Workers</span>
                        <span className="font-bold text-slate-800">{selectedCompany.totalWorkers} active</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-medium">Platform Commission rate</span>
                        <span className="font-bold text-emerald-600">{selectedCompany.commissionPercentage}% per project</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Business Hours & Financial Health */}
                <div className="space-y-6">
                  
                  {/* Business Operational Hours Grid */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Clock size={14}/> Weekly Business Schedule</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2">
                      {selectedCompany.businessHours && Object.entries(selectedCompany.businessHours).map(([day, config]) => (
                        <div key={day} className="flex items-center justify-between p-2 px-3 border rounded-xl text-xs bg-white shadow-sm">
                          <span className="capitalize font-bold text-slate-600">{day.substring(0,3)}</span>
                          <span className={`font-black text-[9px] px-2 py-0.5 rounded-md uppercase ${config.isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-400'}`}>
                            {config.isOpen ? 'Open' : 'Closed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Audit Block */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><DollarSign size={14}/> Financial Accounting Metrics</h4>
                    <div className="border border-slate-100 rounded-2xl p-4 space-y-3 bg-white shadow-sm">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-medium">Wallet Balance</span>
                        <span className="font-mono font-bold text-slate-800">${selectedCompany.walletBalance}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-medium">Gross Aggregated Earnings</span>
                        <span className="font-mono font-bold text-emerald-600">${selectedCompany.totalEarnings}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-medium">Total Volume Withdrawn</span>
                        <span className="font-mono font-bold text-slate-500">${selectedCompany.totalWithdrawn}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Quality Metrics */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Award size={14}/> Marketplace Statistics</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-3 border border-slate-100 bg-white rounded-xl shadow-sm">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Rating</span>
                        <span className="text-sm font-black text-slate-800">{selectedCompany.averageRating}★</span>
                      </div>
                      <div className="p-3 border border-slate-100 bg-white rounded-xl shadow-sm">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Total Jobs</span>
                        <span className="text-sm font-black text-slate-800">{selectedCompany.totalBookings}</span>
                      </div>
                      <div className="p-3 border border-slate-100 bg-white rounded-xl shadow-sm">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Completion</span>
                        <span className="text-sm font-black text-emerald-600">{selectedCompany.completionRate}%</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 3: Legal Documentation Attachments */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><FileText size={14}/> Verification Documentation Attachments</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Business License/Reg', url: selectedCompany.businessLicense },
                    { label: 'GST Certificate', url: selectedCompany.gstCertificate },
                    { label: 'Owner Identification ID', url: selectedCompany.ownerIdProof },
                    { label: 'Insurance Policy Doc', url: selectedCompany.insuranceDocument }
                  ].map(doc => (
                    <div key={doc.label} className="p-4 border rounded-2xl flex flex-col justify-between items-start gap-3 bg-white shadow-sm hover:border-slate-300 transition-all">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Document Type</span>
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">{doc.label}</span>
                      </div>
                      {doc.url ? (
                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-600 text-xs font-bold flex items-center gap-1 mt-1 bg-emerald-50/50 px-2.5 py-1.5 rounded-lg w-full justify-center border border-emerald-100/50">
                          Inspect File <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-xs font-medium text-slate-400 italic bg-slate-50 px-2 py-1 rounded w-full text-center">Missing Upload</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: Rejection Context Logs */}
              {activeTab === 'pending' && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><AlertCircle size={12}/> Rejection Feedback Log (Required if rejecting)</label>
                  <textarea
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-red-300 focus:bg-white transition-all text-sm"
                    rows={3}
                    placeholder="Provide detailed, clear points on why validation failed so the partner organization can adjust their data assets..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}

              {/* Show previous rejection reason if viewing a rejected company */}
              {activeTab === 'rejected' && selectedCompany.rejectionReason && (
                <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl text-sm">
                  <span className="text-xs font-bold text-red-700 block uppercase mb-1">Historical Rejection Reason:</span>
                  <p className="text-red-600 font-medium">{selectedCompany.rejectionReason}</p>
                </div>
              )}

            </div>

            {/* Modal Action Footer */}
            <div className="p-6 bg-slate-50 border-t flex gap-4 justify-end">
              <button 
                onClick={closeModal} 
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all"
              >
                Cancel Audit
              </button>
              
              {activeTab === 'pending' && (
                <>
                  <button
                    disabled={actionLoading || !rejectionReason.trim()}
                    onClick={() => handleReject(selectedCompany._id)}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-40 shadow-md shadow-red-100"
                  >
                    Reject Application
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleApprove(selectedCompany._id)}
                    className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                    Verify & Approve Company
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}