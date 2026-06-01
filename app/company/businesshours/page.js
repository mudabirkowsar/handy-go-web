'use client'

import React, { useState, useEffect } from 'react';
import {
    getAllCompanyBusinessHours,
    updateCompanyBusinessHours,
    updateSingleDayBusinessHours,
    toggleCompanyBusinessDayStatus
} from '../../service/CompanyAPI'; // Adjust path based on your folder structure
import { 
    Clock, Save, ToggleLeft, ToggleRight, RefreshCcw, 
    CheckCircle2, AlertTriangle, Calendar, ShieldAlert 
} from 'lucide-react';

export default function BusinessHoursPage() {
    const [hoursData, setHoursData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Hardcoded day structures to guarantee perfect layout ordering regardless of DB ordering
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    useEffect(() => {
        fetchHours();
    }, []);

    const fetchHours = async () => {
        try {
            setLoading(true);
            const res = await getAllCompanyBusinessHours();
            // Fallback for wrapped schema layouts
            setHoursData(res.businessHours || res.data || res);
        } catch (error) {
            console.error("Error retrieving operating matrix:", error);
            alert("Failed to grab your latest schedule data node.");
        } finally {
            setLoading(false);
        }
    };

    // Handles local state changes when users type into time inputs
    const handleTimeChange = (day, field, value) => {
        setHoursData(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));
    };

    // 1. Trigger rapid toggle pipeline for individual day status
    const handleToggleDay = async (day) => {
        try {
            // Optimistic local update for lightning fast click responses
            setHoursData(prev => ({
                ...prev,
                [day]: { ...prev[day], isOpen: !prev[day].isOpen }
            }));

            await toggleCompanyBusinessDayStatus(day);
        } catch (error) {
            console.error("Toggle pipeline error:", error);
            alert("Failed to change status on the live platform server.");
            fetchHours(); // Re-sync state to correct divergence
        }
    };

    // 2. Trigger single targeted day metrics save
    const handleSaveSingleDay = async (day) => {
        try {
            setActionLoading(true);
            const targets = hoursData[day];
            await updateSingleDayBusinessHours(day, targets);
            alert(`Saved adjustments for ${day.toUpperCase()} successfully.`);
        } catch (error) {
            console.error("Single target put failure:", error);
            alert("Failed to finalize changes for this day node.");
        } finally {
            setActionLoading(false);
        }
    };

    // 3. Trigger bulk update pipeline for full week settings
    const handleSaveWholeWeek = async () => {
        try {
            setActionLoading(true);
            // Match the controller payload wrapper expectations
            await updateCompanyBusinessHours({ businessHours: hoursData });
            alert("Entire weekly business operational calendar updated successfully.");
        } catch (error) {
            console.error("Bulk save request failure:", error);
            alert("Failed to apply full week configurations.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen font-sans antialiased text-[#111827]">
            
            {/* Page Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
                        <Clock className="w-8 h-8 text-[#08B36A]" /> Business Hours
                    </h1>
                    <p className="text-sm text-[#6B7280] mt-1">
                        Configure regular operating times, open intervals, and booking availability matrix rules.
                    </p>
                </div>

                {hoursData && (
                    <button
                        onClick={handleSaveWholeWeek}
                        disabled={actionLoading}
                        className="flex items-center justify-center gap-2 bg-[#08B36A] hover:bg-[#069658] disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition active:scale-95 self-start sm:self-auto"
                    >
                        <Save className="w-4 h-4" /> Save Weekly Matrix
                    </button>
                )}
            </div>

            {/* Content Body */}
            {loading ? (
                <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-20 text-center">
                    <RefreshCcw className="w-8 h-8 animate-spin text-[#08B36A] mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[#6B7280]">Syncing business calendar configurations...</p>
                </div>
            ) : !hoursData ? (
                <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-16 text-center max-w-xl mx-auto">
                    <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#0F172A]">Operating Data Profile Missing</h3>
                    <p className="text-xs text-[#6B7280] mt-1 mb-4">
                        We couldn't read an active layout format. Ensure your profile setup is complete.
                    </p>
                    <button onClick={fetchHours} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition">
                        Retry Core Pull
                    </button>
                </div>
            ) : (
                /* Schedule Matrix Roster */
                <div className="space-y-4 max-w-4xl">
                    {daysOfWeek.map((day) => {
                        const dayConfig = hoursData[day] || { isOpen: false, open: "09:00", close: "18:00" };
                        
                        return (
                            <div 
                                key={day}
                                className={`bg-[#FFFFFF] border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-150 ${
                                    dayConfig.isOpen 
                                        ? 'border-[#E5E7EB] shadow-sm' 
                                        : 'border-slate-200/60 bg-slate-50/50 opacity-80'
                                }`}
                            >
                                {/* Left: Day Label and Status Switch */}
                                <div className="flex items-center justify-between md:justify-start gap-6 min-w-[200px]">
                                    <h3 className="text-sm font-bold text-[#0F172A] capitalize w-24">
                                        {day}
                                    </h3>
                                    
                                    <button
                                        type="button"
                                        onClick={() => handleToggleDay(day)}
                                        className="focus:outline-none transition active:scale-95"
                                        title={`Mark ${day} as ${dayConfig.isOpen ? 'Closed' : 'Open'}`}
                                    >
                                        {dayConfig.isOpen ? (
                                            <div className="flex items-center gap-1.5 text-[#08B36A] font-semibold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                                <ToggleRight className="w-5 h-5" /> Active
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-[#6B7280] font-semibold text-xs bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                                                <ToggleLeft className="w-5 h-5 text-slate-400" /> Offline
                                            </div>
                                        )}
                                    </button>
                                </div>

                                {/* Center: Operational Time Inputs */}
                                <div className="flex items-center gap-3 flex-1 max-w-md">
                                    {dayConfig.isOpen ? (
                                        <div className="grid grid-cols-2 gap-3 w-full">
                                            <div>
                                                <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1">Open Time</label>
                                                <input 
                                                    type="time" 
                                                    value={dayConfig.open || "09:00"}
                                                    onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08B36A]/20 focus:border-[#08B36A] font-medium bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1">Close Time</label>
                                                <input 
                                                    type="time" 
                                                    value={dayConfig.close || "18:00"}
                                                    onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08B36A]/20 focus:border-[#08B36A] font-medium bg-white"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full py-2 bg-slate-100/50 border border-dashed border-slate-200 text-center rounded-xl text-xs font-medium text-slate-400 italic">
                                            Gate access locked. Booking engine ignores operations for this specific day slot.
                                        </div>
                                    )}
                                </div>

                                {/* Right: Micro-action buttons */}
                                <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                                    {dayConfig.isOpen && (
                                        <button
                                            onClick={() => handleSaveSingleDay(day)}
                                            disabled={actionLoading}
                                            className="w-full md:w-auto px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
                                            title="Save updates for this day node only"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#08B36A]" /> Update Day
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Bottom Utility Controls */}
                    <div className="bg-white border border-[#E5E7EB] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>Full-week modifications require hitting the top or bottom global save triggers.</span>
                        </div>
                        <button
                            onClick={handleSaveWholeWeek}
                            disabled={actionLoading}
                            className="w-full sm:w-auto bg-[#0F172A] hover:bg-slate-800 disabled:bg-slate-300 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
                        >
                            Commit All Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}