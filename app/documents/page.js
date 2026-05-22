'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadCompanyDocuments } from '../service/CompanyAPI';
import {
  FileText, UploadCloud, CheckCircle, AlertCircle,
  ArrowRight, ShieldCheck, FileCheck, Loader2, LogOut, Clock, ShieldAlert
} from 'lucide-react';

export default function DocumentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [textFields, setTextFields] = useState({
    gstNumber: '', panNumber: '', cinNumber: '', businessRegistrationNumber: '',
  });

  const [files, setFiles] = useState({
    gstCertificate: null, businessLicense: null, insuranceDocument: null, ownerIdProof: null,
  });

  const [fileNames, setFileNames] = useState({
    gstCertificate: '', businessLicense: '', insuranceDocument: '', ownerIdProof: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('companyToken');
    if (!token) {
      router.push('/'); // Ensure they are logged in
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('companyToken');
    localStorage.removeItem('companyRole');
    localStorage.removeItem('companyInfo');
    localStorage.removeItem('verificationStatus');
    router.push('/');
  };

  const handleTextChange = (e) => {
    setTextFields({ ...textFields, [e.target.name]: e.target.value.toUpperCase().trim() });
  };

  const handleFileChange = (e, fieldName) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError(`File is too large (Max 5MB)`);
        return;
      }
      setFiles({ ...files, [fieldName]: selectedFile });
      setFileNames({ ...fileNames, [fieldName]: selectedFile.name });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!files.ownerIdProof || !files.businessLicense) {
      setError('Business License and Owner ID Proof are required.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      // Add text
      Object.keys(textFields).forEach(key => {
        if (textFields[key]) formData.append(key, textFields[key]);
      });
      // Add files
      Object.keys(files).forEach(key => {
        if (files[key]) formData.append(key, files[key]);
      });

      const response = await uploadCompanyDocuments(formData);

      if (response.success) {
        setSuccess(true);
        // We no longer auto-redirect to /company, we show the modal instead
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error during upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6 sm:p-12 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 shadow-inner">
            <ShieldCheck size={32} className="text-[#08B36A]" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Business Verification</h1>
          <p className="text-slate-500 mt-2 max-w-md">Complete your profile by uploading official company documentation for admin approval.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3 animate-shake">
            <ShieldAlert size={20} className="shrink-0" />
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Text Fields Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <FileText size={16} className="text-slate-600" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Official Identifiers</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'GST Number', name: 'gstNumber', placeholder: '12ABCDE1234F1Z5' },
                { label: 'PAN Number', name: 'panNumber', placeholder: 'ABCDE1234F' },
                { label: 'CIN Number', name: 'cinNumber', placeholder: 'L12345MH2023PLC123456' },
                { label: 'Registration No.', name: 'businessRegistrationNumber', placeholder: 'REG-12345678' }
              ].map((field) => (
                <div key={field.name} className="flex flex-col group">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 ml-1 transition-colors group-focus-within:text-emerald-600">
                    {field.label}
                  </label>
                  <input
                    className="p-3.5 border border-slate-200 rounded-xl text-black bg-white transition-all outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-sm font-medium"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={textFields[field.name]}
                    onChange={handleTextChange}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <UploadCloud size={16} className="text-slate-600" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Required Documents</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { key: 'businessLicense', label: 'Business License', required: true },
                { key: 'ownerIdProof', label: 'Owner ID Proof', required: true },
                { key: 'gstCertificate', label: 'GST Certificate', required: false },
                { key: 'insuranceDocument', label: 'Insurance Policy', required: false }
              ].map((item) => (
                <div key={item.key} className="relative group">
                  <div className={`h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 ${fileNames[item.key] ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 group-hover:border-emerald-400'}`}>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                      onChange={(e) => handleFileChange(e, item.key)}
                    />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${fileNames[item.key] ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 group-hover:text-emerald-500 shadow-sm'}`}>
                      {fileNames[item.key] ? <CheckCircle size={24} /> : <FileCheck size={24} />}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{item.label} {item.required && <span className="text-emerald-500">*</span>}</span>
                    <p className="text-[10px] text-slate-400 mt-1 px-4 text-center">PDF, PNG or JPG (Max 5MB)</p>

                    {fileNames[item.key] && (
                      <div className="mt-3 px-3 py-1 bg-white border border-emerald-100 rounded-full shadow-sm max-w-[80%]">
                        <p className="text-[10px] text-emerald-600 font-medium truncate">{fileNames[item.key]}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-[#08B36A] text-white py-4 px-8 rounded-2xl font-bold flex justify-center items-center gap-3 hover:bg-[#079d5c] transition-all disabled:opacity-50 shadow-lg shadow-emerald-200 text-lg active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing Documents...</span>
                </>
              ) : (
                <>
                  <span>Submit for Verification</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* PREMIUM VERIFICATION MODAL */}
      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"></div>

          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-[110] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="h-2 bg-emerald-500 w-full"></div>

            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
                <Clock size={40} className="text-emerald-600" />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Application Submitted!</h2>

              <div className="space-y-4 mb-10">
                <p className="text-slate-600 leading-relaxed">
                  Your business documents are now being reviewed by our verification team.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  STATUS: PENDING VERIFICATION
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-500 text-left mb-4">
                  <p className="font-semibold text-slate-700 mb-1">What happens next?</p>
                  You will be notified via email once your account is activated. This usually takes 24-48 business hours.
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                >
                  <LogOut size={18} />
                  <span>Logout for Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}