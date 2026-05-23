'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { loginCompany } from './service/CompanyAPI';
import { loginAdmin } from './service/AdminAPI'; // Ensure this path is correct
import { LayoutDashboard, Building2, ShieldCheck, Lock, Smartphone, Mail, Loader2 } from 'lucide-react';

function LoginPage() {
  const router = useRouter();

  // State
  const [loginType, setLoginType] = useState('company'); // 'company' or 'admin'
  const [identifier, setIdentifier] = useState(''); // Holds phone or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!identifier || !password) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    try {
      if (loginType === 'company') {
        // ==========================================
        // COMPANY LOGIN FLOW
        // ==========================================
        const result = await loginCompany({
          companyPhone: identifier,
          password: password,
        });

        localStorage.setItem('companyToken', result.token);
        localStorage.setItem('companyInfo', JSON.stringify(result.company));
        localStorage.setItem('companyRole', result.company.role);
        localStorage.setItem('verificationStatus', result.company.verificationStatus);

        // Redirect based on verification status
        if (result.company.verificationStatus === 'pending' || result.company.verificationStatus === 'rejected') {
          router.push('/documents');
        } else {
          router.push('/company');
        }

      } else {
        // ==========================================
        // ADMIN LOGIN FLOW
        // ==========================================
        const result = await loginAdmin({
          email: identifier,
          password: password,
        });

        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminInfo', JSON.stringify(result.admin));
        localStorage.setItem('adminRole', result.admin.role);

        router.push('/admin');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 font-sans bg-[#F8FAFC] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

      <div className="w-full max-w-[440px] z-10">
        
        {/* LOGO / ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center justify-center">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <ShieldCheck size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          
          {/* TABS */}
          <div className="flex p-2 bg-slate-50 border-b border-slate-100">
            <button
              onClick={() => { setLoginType('company'); setError(''); setIdentifier(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                loginType === 'company' 
                ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Building2 size={18} />
              Company
            </button>
            <button
              onClick={() => { setLoginType('admin'); setError(''); setIdentifier(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                loginType === 'admin' 
                ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutDashboard size={18} />
              Admin
            </button>
          </div>

          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {loginType === 'company' ? 'Partner Login' : 'Admin Portal'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Access your {loginType} dashboard panel
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 text-sm bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                <Lock size={16} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* IDENTIFIER FIELD (Phone for Company, Email for Admin) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                  {loginType === 'company' ? 'Company Phone' : 'Admin Email'}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    {loginType === 'company' ? <Smartphone size={18} /> : <Mail size={18} />}
                  </div>
                  <input
                    type={loginType === 'company' ? 'text' : 'email'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={loginType === 'company' ? '9876543210' : 'admin@handygo.com'}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-900"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-900"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>

            {/* FOOTER */}
            {loginType === 'company' && (
              <p className="mt-8 text-sm text-center text-slate-500 font-medium">
                Don't have an account?{' '}
                <Link href="/signup" className="text-emerald-600 font-bold hover:underline">
                  Join as Partner
                </Link>
              </p>
            )}
            
            {loginType === 'admin' && (
              <p className="mt-8 text-xs text-center text-slate-400 leading-relaxed px-4">
                This is a secure administrative area. Unauthorized access attempts are logged.
              </p>
            )}
          </div>
        </div>

        {/* BACK BUTTON (Optional) */}
        <div className="text-center mt-6">
            <Link href="/" className="text-xs font-bold text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">
                ← Back to Website
            </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;