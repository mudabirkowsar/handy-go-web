"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Search,
  Plus,
  X,
  Phone,
  Mail,
  Briefcase,
  Trash2,
  Edit2,
  Loader2,
  CheckCircle2,
  MapPin,
  Image as ImageIcon,
  Wrench,
  Clock,
  ChevronRight,
} from "lucide-react";

import {
  createCompanyWorker,
  updateCompanyWorker,
  deleteCompanyWorker,
  toggleCompanyWorkerStatus,
  fetchCompanyWrokers,
} from "../../service/CompanyAPI";

export default function ManageWorkersPage() {
  // ======================================================
  // STATES
  // ======================================================
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ======================================================
  // FORM STATE (Updated with all Schema Keys)
  // ======================================================
  const initialFormState = {
    fullName: "",
    phone: "",
    email: "",
    employeeId: "",
    designation: "Worker",
    serviceProvided: "", // From Schema
    skills: "",
    experienceYears: "",
    isAvailable: true, // From Schema
    address: {
      city: "",
      state: "",
      country: "",
    },
    profileImage: null,
  };

  const [formData, setFormData] = useState(initialFormState);

  // ======================================================
  // FETCH WORKERS
  // ======================================================
  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCompanyWrokers();
      setWorkers(response?.workers || response?.data?.workers || []);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch workers");
    } finally {
      setIsLoading(false);
    }
  };

  // ======================================================
  // OPEN MODAL
  // ======================================================
  const handleOpenModal = (worker = null) => {
    if (worker) {
      setEditingWorker(worker);
      setFormData({
        fullName: worker.fullName || "",
        phone: worker.phone || "",
        email: worker.email || "",
        employeeId: worker.employeeId || "",
        designation: worker.designation || "Worker",
        serviceProvided: worker.serviceProvided || "",
        skills: worker.skills?.join(", ") || "",
        experienceYears: worker.experienceYears || "",
        isAvailable: worker.isAvailable ?? true,
        address: {
          city: worker.address?.city || "",
          state: worker.address?.state || "",
          country: worker.address?.country || "",
        },
        profileImage: null,
      });
    } else {
      setEditingWorker(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  // ======================================================
  // HANDLE CHANGE
  // ======================================================
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // ======================================================
  // HANDLE ADDRESS CHANGE
  // ======================================================
  const handleAddressChange = (field, value) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [field]: value,
      },
    });
  };

  // ======================================================
  // SUBMIT
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("employeeId", formData.employeeId);
      data.append("designation", formData.designation);
      data.append("serviceProvided", formData.serviceProvided);
      data.append("isAvailable", formData.isAvailable);
      data.append(
        "skills",
        JSON.stringify(
          formData.skills
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "")
        )
      );
      data.append("experienceYears", formData.experienceYears);
      data.append("address", JSON.stringify(formData.address));

      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      if (editingWorker) {
        await updateCompanyWorker(editingWorker._id, data);
      } else {
        await createCompanyWorker(data);
      }

      await fetchWorkers();
      setIsModalOpen(false);
      setFormData(initialFormState);
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ======================================================
  // TOGGLE STATUS
  // ======================================================
  const handleToggleStatus = async (workerId) => {
    try {
      await toggleCompanyWorkerStatus(workerId);
      fetchWorkers();
    } catch (error) {
      console.log(error);
      alert("Failed to toggle status");
    }
  };

  // ======================================================
  // DELETE
  // ======================================================
  const handleDelete = async (workerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this worker?"
    );
    if (!confirmDelete) return;
    try {
      await deleteCompanyWorker(workerId);
      fetchWorkers();
    } catch (error) {
      console.log(error);
      alert("Failed to delete worker");
    }
  };

  // ======================================================
  // FILTER WORKERS
  // ======================================================
  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.serviceProvided?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && worker.isActive) ||
      (statusFilter === "Inactive" && !worker.isActive);

    return matchesSearch && matchesStatus;
  });

  const totalWorkers = workers.length;
  const activeWorkers = workers.filter((worker) => worker.isActive).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-0 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Worker Management
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <Users size={16} className="text-[#08B36A]" />
              Manage your workforce and field agents efficiently
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#08B36A] hover:bg-[#069a5a] text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-100 hover:shadow-emerald-200 active:scale-95 cursor-pointer"
          >
            <Plus size={20} />
            Add New Worker
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <StatCard
            label="Total Workforce"
            value={totalWorkers}
            icon={<Users size={24} />}
            trend="Total staff registered"
            color="indigo"
          />
          <StatCard
            label="Active Now"
            value={activeWorkers}
            icon={<UserCheck size={24} />}
            trend={`${((activeWorkers / totalWorkers) * 100 || 0).toFixed(0)}% Activity rate`}
            color="emerald"
          />
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, role or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#08B36A]/20 focus:bg-white transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 md:flex-none px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none hover:border-[#08B36A] transition-colors"
            >
              <option value="All">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <Loader2 className="animate-spin text-[#08B36A]" size={48} />
                <div className="absolute inset-0 blur-xl bg-[#08B36A]/20 animate-pulse"></div>
              </div>
              <p className="mt-4 text-slate-500 font-medium italic">Synchronizing worker database...</p>
            </div>
          ) : filteredWorkers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <Users size={48} strokeWidth={1} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No records found</h3>
              <p className="text-sm">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Worker Profile</th>
                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Service & Role</th>
                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Contact Details</th>
                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Experience</th>
                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">Availability</th>
                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredWorkers.map((worker) => (
                    <tr key={worker._id} className="group hover:bg-slate-50/80 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {worker.profileImage ? (
                              <img src={worker.profileImage} alt="profile" className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-sm" />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 ring-2 ring-white shadow-sm">
                                <Users size={20} />
                              </div>
                            )}
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${worker.isActive ? 'bg-[#08B36A]' : 'bg-slate-300'}`}></div>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-[#08B36A] transition-colors">{worker.fullName}</p>
                            <p className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">{worker.employeeId || 'ST-000'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#08B36A] text-xs font-bold w-fit">
                            <Wrench size={12} /> {worker.serviceProvided || "General"}
                          </span>
                          <span className="text-xs text-slate-500 font-medium ml-1 italic">{worker.designation}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                            <Phone size={12} className="text-slate-400" /> {worker.phone}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <Mail size={12} /> {worker.email || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">
                            {worker.experienceYears || 0} Years
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(worker._id)}
                          className={`mx-auto px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${worker.isActive
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                            }`}
                        >
                          {worker.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenModal(worker)} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(worker._id)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col scale-in-center border border-white/20">

            {/* MODAL HEADER */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editingWorker ? "Edit Profile" : "Register Worker"}
                </h2>
                <p className="text-sm text-slate-500">Fill in the professional details below</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>

            {/* MODAL FORM */}
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar">
              <div className="space-y-8">

                {/* SECTION: PERSONAL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-[#08B36A]">
                      <Users size={16} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Personal Info</h3>
                  </div>

                  <FormGroup label="Full Name *" value={formData.fullName} onChange={(v) => handleChange("fullName", v)} required placeholder="e.g. John Doe" />
                  <FormGroup label="Phone Number *" value={formData.phone} onChange={(v) => handleChange("phone", v)} required placeholder="+1 234..." />
                  <FormGroup label="Email Address" value={formData.email} onChange={(v) => handleChange("email", v)} type="email" placeholder="john@example.com" />
                  <FormGroup label="Employee ID" value={formData.employeeId} onChange={(v) => handleChange("employeeId", v)} placeholder="ST-001" />
                </div>

                {/* SECTION: PROFESSIONAL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                  <div className="md:col-span-2 flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <Briefcase size={16} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Work Details</h3>
                  </div>

                  <FormGroup label="Service Provided *" value={formData.serviceProvided} onChange={(v) => handleChange("serviceProvided", v)} required placeholder="e.g. Plumbing, Electrician" />
                  <FormGroup label="Designation" value={formData.designation} onChange={(v) => handleChange("designation", v)} placeholder="e.g. Senior Tech" />
                  <FormGroup label="Years of Experience" value={formData.experienceYears} onChange={(v) => handleChange("experienceYears", v)} type="number" placeholder="0" />

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Availability Status</label>
                    <div
                      onClick={() => handleChange("isAvailable", !formData.isAvailable)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${formData.isAvailable ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                    >
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${formData.isAvailable ? 'left-6' : 'left-1'}`}></div>
                      </div>
                      <span className="text-sm font-bold">{formData.isAvailable ? 'Ready to Work' : 'On Leave'}</span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <FormGroup label="Skills (comma separated)" value={formData.skills} onChange={(v) => handleChange("skills", v)} placeholder="Welding, Pipe fitting, HVAC" />
                  </div>
                </div>

                {/* SECTION: ADDRESS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
                  <div className="md:col-span-3 flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                      <MapPin size={16} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Location</h3>
                  </div>
                  <FormGroup label="City" value={formData.address.city} onChange={(v) => handleAddressChange("city", v)} placeholder="City" />
                  <FormGroup label="State" value={formData.address.state} onChange={(v) => handleAddressChange("state", v)} placeholder="State" />
                  <FormGroup label="Country" value={formData.address.country} onChange={(v) => handleAddressChange("country", v)} placeholder="Country" />
                </div>

                {/* SECTION: MEDIA */}
                <div className="pt-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3">Profile Photo</label>
                  <label className="group relative border-2 border-dashed border-slate-200 rounded-[24px] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#08B36A] hover:bg-emerald-50/30 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-white transition-all">
                      <ImageIcon size={24} />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-bold text-slate-700 block">Click to upload photo</span>
                      <span className="text-[11px] text-slate-400">JPG, PNG up to 5MB</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
                    />
                    {formData.profileImage && (
                      <div className="absolute inset-0 bg-[#08B36A] rounded-[22px] flex items-center justify-center text-white font-bold animate-in fade-in">
                        <CheckCircle2 className="mr-2" /> Image Selected
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="sticky bottom-0 mt-10 pt-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-3.5 bg-[#08B36A] hover:bg-[#069a5a] text-white rounded-xl font-black text-sm shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                  {editingWorker ? "Save Profile Update" : "Complete Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ======================================================
// REFINED COMPONENTS
// ======================================================

function StatCard({ label, value, icon, color, trend }) {
  const themes = {
    indigo: "from-indigo-500 to-blue-600 shadow-indigo-100 text-indigo-600 bg-indigo-50",
    emerald: "from-[#08B36A] to-emerald-600 shadow-emerald-100 text-emerald-600 bg-emerald-50",
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-xl ${themes[color].split(' shadow')[2]} ${themes[color].split(' shadow')[1]}`}>
        {icon}
      </div>
      <div>
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{label}</span>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black text-slate-900">{value}</p>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{trend}</span>
        </div>
      </div>
    </div>
  );
}

function FormGroup({ label, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-[#08B36A] outline-none transition-all placeholder:text-slate-300"
      />
    </div>
  );
}