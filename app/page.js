'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { loginCompany } from './service/CompanyAPI';

function LoginPage() {

  const router = useRouter();

  const [companyPhone, setCompanyPhone] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // LOGIN SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    // ==========================================
    // VALIDATION
    // ==========================================
    if (!companyPhone || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {

      setIsLoading(true);

      // ==========================================
      // API CALL
      // ==========================================
      const result = await loginCompany({
        companyPhone,
        password,
      });

      console.log("LOGIN RESPONSE:", result);

      // ==========================================
      // STORE TOKEN
      // ==========================================
      localStorage.setItem('companyToken', result.token);

      // ==========================================
      // STORE COMPANY INFO
      // ==========================================
      localStorage.setItem('companyInfo', JSON.stringify(result.company));

      localStorage.setItem('companyRole', result.company.role);

      localStorage.setItem('verificationStatus', result.company.verificationStatus);

      // ==========================================
      // REDIRECT BASED ON STATUS
      // ==========================================
      if (
        result.company.verificationStatus === 'pending'
      ) {

        router.push('/documents');

      } else if (
        result.company.verificationStatus === 'approved'
      ) {

        router.push('/company');

      } else if (
        result.company.verificationStatus === 'rejected'
      ) {

        router.push('/documents');

      } else {

        router.push('/company');

      }

    } catch (err) {

      console.log(err);

      const errorMessage =
        err.response?.data?.message ||
        'Login failed';

      setError(errorMessage);

    } finally {

      setIsLoading(false);

    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 font-sans bg-[#F8FAFC]">

      <div className="w-full max-w-[420px] p-10 bg-white rounded-xl border border-[#E5E7EB] shadow-sm">

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-center mb-2 text-[#0F172A]">
          Welcome Back
        </h2>

        <p className="text-sm text-center mb-8 text-[#6B7280]">
          Please enter your credentials
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-5 p-3 text-sm text-center bg-red-50 rounded-md border border-red-200 text-red-500">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >

          {/* PHONE */}
          <div className="flex flex-col gap-2">

            <label className="text-sm font-semibold text-[#111827]">
              Company Phone
            </label>

            <input
              type="text"
              value={companyPhone}
              onChange={(e) =>
                setCompanyPhone(e.target.value)
              }
              placeholder="9876543210"
              className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#08B36A]"
              disabled={isLoading}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">

            <label className="text-sm font-semibold text-[#111827]">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#08B36A]"
              disabled={isLoading}
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-md text-sm font-semibold text-white bg-[#08B36A] hover:opacity-90 transition-all disabled:opacity-60"
          >
            {isLoading
              ? 'Signing In...'
              : 'Sign In'}
          </button>

        </form>

        {/* FOOTER */}
        <p className="mt-6 text-sm text-center text-[#6B7280]">

          Don't have an account?{' '}

          <Link
            href="/signup"
            className="font-semibold text-[#08B36A] hover:underline"
          >
            Sign up
          </Link>

        </p>

      </div>

    </div>
  );
}

export default LoginPage;