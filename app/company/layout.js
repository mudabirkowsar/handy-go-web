import React from 'react';
import Link from 'next/link';

// Custom design colors mapped from your design system
const COLORS = {
  primary: "#08B36A",
  secondary: "#0F172A",
  background: "#F8FAFC",
  card: "#FFFFFF",
  text: "#111827",
  subtext: "#6B7280",
  border: "#E5E7EB",
};

export default function DashboardLayout({ children }) {
  // Navigation Links array structured around your Company Mongoose Schema fields
  const navLinks = [
    { name: 'Overview', href: '/company', icon: '📊' },
    { name: 'Service Catalog', href: '/dashboard/services', icon: '🛠️' },
    { name: 'Workers & Staff', href: '/company/manageworkers', icon: '👥' },
    { name: 'Bookings & Analytics', href: '/dashboard/bookings', icon: '📅' },
    { name: 'Documents & KYC', href: '/dashboard/verification', icon: '📂' },
    { name: 'Payouts & Wallet', href: '/dashboard/financials', icon: '💰' },
    { name: 'Business Hours', href: '/dashboard/hours', icon: '⏳' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] font-sans">
      
      {/* LEFT SIDEBAR PANEL */}
      <aside className="w-64 h-full flex flex-col justify-between border-r border-[#E5E7EB] bg-[#FFFFFF] shrink-0">
        
        {/* Top Segment: Branding/Logo */}
        <div>
          <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB] gap-3">
            {/* Simple Dynamic Logo using your primary color */}
            <div className="w-8 h-8 rounded-lg bg-[#08B36A] flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#0F172A] leading-tight">Company Panel</h1>
              <span className="text-[11px] font-medium text-[#08B36A] bg-emerald-50 px-1.5 py-0.5 rounded">Verified Enterprise</span>
            </div>
          </div>

          {/* Navigation Matrix */}
          <nav className="flex flex-col gap-1 p-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-3.5 px-4 py-3 text-sm font-semibold rounded-lg text-[#6B7280] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-all group"
              >
                {/* Icon Wrapper */}
                <span className="text-base grayscale group-hover:grayscale-0 transition-all">
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Segment: Quick Profile Context Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0">
              HQ
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#111827] truncate">Main Office Admin</p>
              <p className="text-[10px] text-[#6B7280] truncate">Role: Company</p>
            </div>
          </div>
          <Link 
            href="/logout" 
            className="text-xs p-1.5 rounded hover:bg-red-50 text-[#6B7280] hover:text-[#EF4444] transition-colors"
            title="Log Out"
          >
            ❌
          </Link>
        </div>

      </aside>

      {/* RIGHT SIDEBAR VIEWPORT CONTROLLER */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        
        {/* Top Global Dashboard Header Navbar */}
        <header className="h-16 border-b border-[#E5E7EB] bg-[#FFFFFF] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#0F172A]">Management Console</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Quick Balance Status display reflecting Schema attributes */}
            <div className="text-right">
              <span className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Wallet Balance</span>
              <span className="text-sm font-black text-[#0F172A]">₹0.00</span>
            </div>
            <div className="w-px h-8 bg-[#E5E7EB]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#08B36A] animate-pulse" title="System Live"></div>
          </div>
        </header>

        {/* Main Fluid Content Scroll Workspace */}
        <main className="flex-1 overflow-y-auto p-8 focus:outline-none">
          {children}
        </main>

      </div>
    </div>
  );
}