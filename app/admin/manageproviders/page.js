'use client'

import React, { useState, useEffect } from 'react';
import {
    adminGetAllProviders,
    adminVerifyProvider,
    adminToggleBlockProvider,
    adminDeleteProvider,
    adminGetProviderStats
} from '../../service/AdminAPI'; // Adjust path based on your folder structure
import {
    CheckCircle, XCircle, Ban, Trash2, Eye, Star, MapPin, Mail, Phone,
    Search, Filter, RefreshCcw, UserCheck, Users, AlertCircle, Briefcase,
    Calendar, Award, Building, Landmark, CreditCard, ShieldCheck, HelpCircle, AlertTriangle
} from 'lucide-react';

const ProviderManagementPage = () => {
    const [providers, setProviders] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState(null); // For Detail Modal
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        page: 1,
        limit: 10
    });

    useEffect(() => {
        fetchData();
        fetchStats();
    }, [filters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await adminGetAllProviders(filters);
            setProviders(res.data || []);
        } catch (error) {
            console.error("Error fetching providers", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await adminGetProviderStats();
            setStats(res.data);
        } catch (error) {
            console.error("Error fetching stats", error);
        }
    };

    const handleVerify = async (id, status) => {
        let rejectionReason = "";
        if (status === 'rejected') {
            rejectionReason = prompt("Please enter reason for rejection:");
            if (!rejectionReason) return;
        }

        try {
            await adminVerifyProvider(id, { status, rejectionReason });
            alert(`Provider ${status} successfully`);
            fetchData();
            fetchStats();
            setSelectedProvider(null);
        } catch (error) {
            alert("Action failed: " + error.message);
        }
    };

    const handleToggleBlock = async (id, currentBlockStatus) => {
        const reason = !currentBlockStatus ? prompt("Enter reason for blocking:") : "";
        try {
            await adminToggleBlockProvider(id, {
                isBlocked: !currentBlockStatus,
                blockedReason: reason
            });
            fetchData();
            fetchStats();

            // Sync modal state if active
            if (selectedProvider && selectedProvider._id === id) {
                setSelectedProvider(prev => ({ ...prev, isBlocked: !currentBlockStatus }));
            }
        } catch (error) {
            alert("Action failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this provider? This action is permanent.")) {
            try {
                await adminDeleteProvider(id);
                fetchData();
                fetchStats();
                if (selectedProvider && selectedProvider._id === id) {
                    setSelectedProvider(null);
                }
            } catch (error) {
                alert("Delete failed");
            }
        }
    };

    return (
        <div className="p-6 md:p-8 pt-0 bg-slate-50 min-h-screen font-sans antialiased text-slate-800">
            {/* Header & Stats */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Provider Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Review credentials, verify system access, and monitor onboarded service providers.</p>
                </div>
                <button
                    onClick={() => { fetchData(); fetchStats(); }}
                    className="flex items-center gap-2 self-start md:self-auto px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 transition active:scale-95"
                >
                    <RefreshCcw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Data
                </button>
            </div>

            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <StatCard title="Total Providers" value={stats.total} icon={Users} color="blue" />
                    <StatCard title="Pending Review" value={stats.pending} icon={AlertCircle} color="amber" />
                    <StatCard title="Approved Providers" value={stats.approved} icon={UserCheck} color="emerald" />
                    <StatCard title="Blocked Account" value={stats.blocked} icon={Ban} color="rose" />
                </div>
            )}

            {/* Filters Control Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, email..."
                            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl w-full text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                        />
                    </div>
                    <div className="relative">
                        <select
                            className="appearance-none border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium text-slate-700 cursor-pointer w-full sm:w-44"
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                            defaultValue=""
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">⏳ Pending</option>
                            <option value="approved">✅ Approved</option>
                            <option value="rejected">❌ Rejected</option>
                        </select>
                        <Filter className="absolute right-3.5 top-3.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
                <div className="text-xs font-medium text-slate-400 self-end sm:self-auto">
                    Showing {providers.length} records
                </div>
            </div>

            {/* Table Core */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                <th className="px-6 py-4.5">Provider Identity</th>
                                <th className="px-6 py-4.5">Core Service</th>
                                <th className="px-6 py-4.5">Verification Status</th>
                                <th className="px-6 py-4.5">Reputation</th>
                                <th className="px-6 py-4.5 text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20 text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <RefreshCcw className="w-6 h-6 animate-spin text-blue-500" />
                                            <span className="font-medium">Fetching provider roster...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : providers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20 text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <AlertTriangle className="w-8 h-8 text-slate-300" />
                                            <span className="font-medium text-slate-500">No matching providers found</span>
                                            <span className="text-xs text-slate-400">Try modifying your filter options or query keywords.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : providers.map((p) => (
                                <tr key={p._id} className={`hover:bg-slate-50/60 transition duration-150 ${p.isBlocked ? 'bg-rose-50/20' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3.5">
                                            <div className="relative">
                                                <img
                                                    src={p.profileImage || 'https://via.placeholder.com/40'}
                                                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-100 bg-slate-100"
                                                    alt="avatar"
                                                />
                                                {p.isBlocked && (
                                                    <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 border-2 border-white">
                                                        <Ban className="w-2.5 h-2.5" />
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                                    {p.fullName}
                                                </div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Phone className="w-3 h-3 text-slate-400" /> {p.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-semibold border border-blue-100">
                                            <Briefcase className="w-3 h-3" />
                                            {p.serviceProvided}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={p.verificationStatus} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            <span>{p.averageRating?.toFixed(1) || '0.0'}</span>
                                            <span className="text-slate-400 text-xs font-normal">({p.totalReviews || 0})</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => setSelectedProvider(p)}
                                                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                                                title="View Verification Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleBlock(p._id, p.isBlocked)}
                                                className={`p-2 rounded-xl transition ${p.isBlocked ? 'text-rose-600 bg-rose-100 hover:bg-rose-200' : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'}`}
                                                title={p.isBlocked ? "Unblock Provider" : "Block Provider"}
                                            >
                                                <Ban className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                                                title="Hard Delete Record"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* KYC Details Comprehensive Drawer/Modal */}
            {selectedProvider && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Credential Verification Desk</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Evaluate system profile parameters against government identifications.</p>
                            </div>
                            <button
                                onClick={() => setSelectedProvider(null)}
                                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg text-xl transition"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Content Scroll Shell */}
                        <div className="overflow-y-auto p-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Panel: Primary Metadata */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <UserCheck className="w-3.5 h-3.5" /> Core Parameters
                                    </h3>
                                    <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 space-y-3 text-slate-700">
                                        <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400 text-xs">Full Legal Name</span> <span className="font-semibold text-slate-900">{selectedProvider.fullName}</span></div>
                                        <div className="flex justify-between border-b border-slate-100 pb-2 flex-wrap gap-1"><span className="text-slate-400 text-xs">Email Endpoint</span> <span className="font-medium text-slate-900 flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {selectedProvider.email || 'N/A'}</span></div>
                                        <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400 text-xs">Contact Line</span> <span className="font-medium text-slate-900 flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {selectedProvider.phone}</span></div>
                                        <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400 text-xs">Industry Experience</span> <span className="font-semibold text-blue-700 flex items-center gap-1"><Award className="w-3 h-3" /> {selectedProvider.experienceYears} Years Active</span></div>
                                        <div className="flex flex-col gap-1 pt-1">
                                            <span className="text-slate-400 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> Declared Workplace Hub</span>
                                            <span className="text-xs text-slate-900 font-medium pl-4">{selectedProvider.address?.street || 'No street info'}, {selectedProvider.address?.city || ''}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Verification Dossier
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="border border-slate-100 bg-slate-50/30 p-3 rounded-xl">
                                            <p className="text-xs text-slate-500 font-medium mb-2 flex items-center justify-between">
                                                <span>Aadhaar Identity Vector</span>
                                                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">[Aadhaar Omitted]</span>
                                            </p>
                                            <div className="flex gap-2.5">
                                                <div className="w-1/2 group relative">
                                                    <img src={selectedProvider.aadhaarFrontImage} alt="Aadhaar Front" className="w-full h-28 object-cover rounded-lg border border-slate-200 transition group-hover:brightness-95" />
                                                    <span className="absolute bottom-1 left-1 bg-slate-900/70 text-white text-[9px] px-1.5 py-0.5 rounded">Front Face</span>
                                                </div>
                                                <div className="w-1/2 group relative">
                                                    <img src={selectedProvider.aadhaarBackImage} alt="Aadhaar Back" className="w-full h-28 object-cover rounded-lg border border-slate-200 transition group-hover:brightness-95" />
                                                    <span className="absolute bottom-1 left-1 bg-slate-900/70 text-white text-[9px] px-1.5 py-0.5 rounded">Reverse Face</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border border-slate-100 bg-slate-50/30 p-3 rounded-xl">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">PAN Identifier</p>
                                                <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{selectedProvider.panNumber || 'Unspecified'}</span>
                                            </div>
                                            <div className="relative group">
                                                <img src={selectedProvider.selfieImage} alt="Provider Selfie" className="w-full h-36 object-cover rounded-lg border border-slate-200 transition group-hover:brightness-95" />
                                                <span className="absolute bottom-1 left-1 bg-slate-900/70 text-white text-[9px] px-1.5 py-0.5 rounded">Biometric Verification Portrait</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Financial Route & Execution Panel */}
                            <div className="flex flex-col justify-between space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <Landmark className="w-3.5 h-3.5" /> Clearinghouse & Banking Node
                                    </h3>
                                    <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner relative overflow-hidden group">
                                        <div className="absolute right-[-20px] top-[-20px] text-slate-800 opacity-20 pointer-events-none transition group-hover:scale-110 duration-500">
                                            <Building className="w-36 h-36" />
                                        </div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Banking Institution</p>
                                                <p className="text-lg font-bold tracking-tight text-white mt-0.5">{selectedProvider.bankDetails?.bankName || 'N/A'}</p>
                                            </div>
                                            <CreditCard className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div className="space-y-3.5 text-xs">
                                            <div>
                                                <p className="text-[9px] text-slate-400 uppercase font-medium">Account Beneficiary Signature</p>
                                                <p className="font-semibold text-slate-200 tracking-wide">{selectedProvider.bankDetails?.accountHolderName || 'N/A'}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-[9px] text-slate-400 uppercase font-medium">Routing / IFSC Key</p>
                                                    <p className="font-mono text-slate-200 font-bold">{selectedProvider.bankDetails?.ifscCode || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-slate-400 uppercase font-medium">Account Stream Code</p>
                                                    <p className="font-mono text-slate-200 font-bold tracking-wide">{selectedProvider.bankDetails?.accountNumber || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mt-auto">
                                    {selectedProvider.verificationStatus === 'approved' ? (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center text-emerald-800">
                                            <div className="flex items-center justify-center gap-2 font-bold mb-1">
                                                <CheckCircle className="w-5 h-5 text-emerald-600" /> Account Fully Verified
                                            </div>
                                            <p className="text-xs text-emerald-700">This partner has successfully validated all KYC procedures. Operational system workflows are running normally.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <h4 className="text-center font-bold text-slate-800 text-sm mb-3.5 flex items-center justify-center gap-1.5">
                                                <HelpCircle className="w-4 h-4 text-slate-500" /> Executive Verdict Action
                                            </h4>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <button
                                                    onClick={() => handleVerify(selectedProvider._id, 'approved')}
                                                    className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 font-semibold text-sm shadow-sm hover:shadow transition active:scale-98"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> Approve Identity
                                                </button>
                                                <button
                                                    onClick={() => handleVerify(selectedProvider._id, 'rejected')}
                                                    className="flex-1 bg-white border border-rose-200 text-rose-600 py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-50 font-semibold text-sm shadow-sm transition active:scale-98"
                                                >
                                                    <XCircle className="w-4 h-4" /> Issue Rejection
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components
const StatCard = ({ title, value, icon: Icon, color }) => {
    const theme = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-100/50' },
        amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-100/50' },
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-100/50' },
        rose: { bg: 'bg-rose-500/10', text: 'text-rose-600', border: 'border-rose-100/50' },
    }[color];

    return (
        <div className={`bg-white p-5 rounded-2xl border ${theme.border} shadow-sm flex items-center justify-between transition hover:translate-y-[-2px] duration-200`}>
            <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{value ?? '0'}</p>
            </div>
            <div className={`p-3.5 ${theme.bg} rounded-xl transition-transform`}>
                <Icon className={`w-5 h-5 ${theme.text}`} />
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-amber-50 text-amber-800 border-amber-200/60",
        approved: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
        rejected: "bg-rose-50 text-rose-800 border-rose-200/60",
        incomplete: "bg-slate-100 text-slate-700 border-slate-300/60",
    }[status] || "bg-slate-100 text-slate-700 border-slate-200";

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'approved' ? 'bg-emerald-500' :
                    status === 'pending' ? 'bg-amber-500' :
                        status === 'rejected' ? 'bg-rose-500' : 'bg-slate-400'
                }`} />
            <span className="capitalize">{status}</span>
        </span>
    );
};

export default ProviderManagementPage;