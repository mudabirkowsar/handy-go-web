'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Swap with 'react-router-dom' if not using Next.js
import { registerCompany } from '../service/CompanyAPI'; // Adjust the import path as necessary
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function CompanySignup() {
  const router = useRouter();
  
  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    ownerName: '',
    companyPhone: '',
    companyEmail: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Password Match Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // 2. Controller Requirement Validation
    if (!formData.companyName || !formData.companyPhone || !formData.password || !formData.ownerName) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // Destructure to remove confirmPassword from backend payload
      const { confirmPassword, ...payload } = formData;

      // Executing API request using your service function
      const data = await registerCompany(payload);

      if (!data || !data.success) {
        throw new Error(data?.message || 'Registration failed');
      }

      // Store auth state tokens locally
      localStorage.setItem('companyToken', data.token);
      localStorage.setItem('companyRole', data.company.role);
      localStorage.setItem('companyInfo', JSON.stringify(data.company));

      // Role check and conditional redirect handling
      if (data.company.role === 'company') {
        router.push('/documents'); 
      } else {
        setError('Unauthorized account role returned.');
      }

    } catch (err) {
      const serverErrorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(serverErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Determine if confirm password field should visually alert mismatch error
  const isPasswordMismatched = formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center px-4 py-10 font-sans">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-12 w-full max-w-[560px] shadow-xl shadow-slate-900/5">
        
        {/* Header Zone */}
        <div className="text-center mb-8">
          <h1 className="text-[#0F172A] text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Create Corporate Account
          </h1>
          <p className="text-[#6B7280] text-sm sm:text-base">
            Provide your enterprise details to register your organization.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-[#EF4444] p-3.5 rounded-lg text-sm mb-6 flex items-center gap-2.5 entry-fade">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Two-Column Grid: Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[#0F172A] text-xs sm:text-sm font-semibold">
                Company Legal Name *
              </label>
              <div className="relative flex items-center">
                <Building2 size={18} className="absolute left-3.5 text-[#6B7280] pointer-events-none" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Acme Corp LLC"
                  className="w-full bg-[#FAFAFA] text-[#111827] text-sm pl-11 pr-4 py-3 border border-[#E5E7EB] rounded-lg outline-none focus:border-[#08B36A] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#0F172A] text-xs sm:text-sm font-semibold">
                Owner Full Name *
              </label>
              <div className="relative flex items-center">
                <User size={18} className="absolute left-3.5 text-[#6B7280] pointer-events-none" />
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Alex Mercer"
                  className="w-full bg-[#FAFAFA] text-[#111827] text-sm pl-11 pr-4 py-3 border border-[#E5E7EB] rounded-lg outline-none focus:border-[#08B36A] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Corporate Phone */}
          <div className="space-y-1.5">
            <label className="block text-[#0F172A] text-xs sm:text-sm font-semibold">
              Corporate Phone Number *
            </label>
            <div className="relative flex items-center">
              <Phone size={18} className="absolute left-3.5 text-[#6B7280] pointer-events-none" />
              <input
                type="tel"
                name="companyPhone"
                value={formData.companyPhone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-[#FAFAFA] text-[#111827] text-sm pl-11 pr-4 py-3 border border-[#E5E7EB] rounded-lg outline-none focus:border-[#08B36A] focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* Corporate Email */}
          <div className="space-y-1.5">
            <label className="block text-[#0F172A] text-xs sm:text-sm font-semibold">
              Corporate Email Address (Optional)
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3.5 text-[#6B7280] pointer-events-none" />
              <input
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                placeholder="contact@company.com"
                className="w-full bg-[#FAFAFA] text-[#111827] text-sm pl-11 pr-4 py-3 border border-[#E5E7EB] rounded-lg outline-none focus:border-[#08B36A] focus:bg-white transition-all"
              />
            </div>
          </div>

          <hr className="border-t border-[#E5E7EB] my-6" />

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-[#0F172A] text-xs sm:text-sm font-semibold">
              Password *
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-[#6B7280] pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#FAFAFA] text-[#111827] text-sm pl-11 pr-11 py-3 border border-[#E5E7EB] rounded-lg outline-none focus:border-[#08B36A] focus:bg-white transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#6B7280] hover:text-[#111827] focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="block text-[#0F172A] text-xs sm:text-sm font-semibold">
              Confirm Password *
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-[#6B7280] pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-[#FAFAFA] text-[#111827] text-sm pl-11 pr-4 py-3 border rounded-lg outline-none focus:bg-white transition-all ${
                  isPasswordMismatched 
                    ? 'border-[#EF4444] focus:border-[#EF4444]' 
                    : 'border-[#E5E7EB] focus:border-[#08B36A]'
                }`}
                required
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#08B36A] text-white py-3.5 px-6 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#079d5c] focus:outline-none transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-75 disabled:cursor-not-allowed shadow-md shadow-[#08B36A]/10"
          >
            <span>{loading ? 'Processing Registration...' : 'Register & Continue'}</span>
            {!loading && <ArrowRight size={18} />}
          </button>
          
        </form>
      </div>
    </div>
  );
}