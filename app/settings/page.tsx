"use client";

import React, { useState } from 'react';
import { useStayFlow } from '../layout';
import { Save, RefreshCw, Sliders } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, clearAllData } = useStayFlow();

  // Form Controls State
  const [hotelName, setHotelName] = useState(settings.hotel_name);
  const [ownerName, setOwnerName] = useState(settings.owner_name);
  const [currency, setCurrency] = useState(settings.currency);
  const [checkIn, setCheckIn] = useState(settings.default_check_in_time);
  const [checkOut, setCheckOut] = useState(settings.default_check_out_time);
  const [cleaning, setCleaning] = useState(settings.cleaning_after_checkout);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      hotel_name: hotelName,
      owner_name: ownerName,
      currency,
      default_check_in_time: checkIn,
      default_check_out_time: checkOut,
      cleaning_after_checkout: cleaning
    });
    alert("System operational configurations committed safely.");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Global Configuration Space</h2>
        <p className="text-gray-400 text-sm">Configure system architecture variables, default constraints, and operational bounds.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="bg-[#14141f] border border-gray-800 rounded-xl p-6 space-y-6 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="text-gray-400 text-xs font-medium">Enterprise Property Identity Name</label>
            <input type="text" value={hotelName} onChange={e => setHotelName(e.target.value)} required />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-gray-400 text-xs font-medium">Managing Director / Proprietary Signature Name</label>
            <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Proprietor Identity Name" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-800/60 pt-4">
          <div className="flex flex-col space-y-1">
            <label className="text-gray-400 text-xs font-medium">Global Currency Tag Indicator</label>
            <input type="text" value={currency} onChange={e => setCurrency(e.target.value)} required />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-gray-400 text-xs font-medium">Standard Check-In Time Baseline</label>
            <input type="text" value={checkIn} onChange={e => setCheckIn(e.target.value)} required />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-gray-400 text-xs font-medium">Standard Check-Out Time Baseline</label>
            <input type="text" value={checkOut} onChange={e => setCheckOut(e.target.value)} required />
          </div>
        </div>

        <div className="border-t border-gray-800/60 pt-4 flex items-center justify-between">
          <div>
            <label className="text-gray-200 font-medium block">Automatic Post-Checkout Sanitization Trigger</label>
            <span className="text-xs text-gray-400 block mt-0.5">Automate state translation of assets to 'cleaning' state directly after departure check-out actions pass.</span>
          </div>
          <input 
            type="checkbox" 
            checked={cleaning} 
            onChange={e => setCleaning(e.target.checked)}
            className="w-4 h-4 text-purple-600 accent-purple-600 cursor-pointer"
          />
        </div>

        <div className="border-t border-gray-800/60 pt-4 flex justify-end">
          <button type="submit" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium transition">
            <Save className="w-4 h-4" /> Save System Variables
          </button>
        </div>
      </form>

      {/* Dangerous Operations Zone */}
      <div className="bg-red-950/10 border border-red-900/40 rounded-xl p-6 space-y-4">
        <div>
          <h4 className="text-red-400 font-semibold text-sm">Irreversible Critical Actions Zone</h4>
          <p className="text-xs text-gray-400 mt-1">Forced clean resets purge all local context objects from window cache storage structures entirely.</p>
        </div>
        <div>
          <button
            onClick={() => {
              if (confirm("Confirm absolute wipeout of all local database objects? This step is permanent.")) {
                clearAllData();
                alert("Storage cleared safely.");
                window.location.reload();
              }
            }}
            className="flex items-center gap-2 bg-red-900/30 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-700/40 px-4 py-2 rounded-lg text-xs font-medium transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Force Purge LocalStorage Context
          </button>
        </div>
      </div>
    </div>
  );
}