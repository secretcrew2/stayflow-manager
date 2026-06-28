"use client";

import React from 'react';
import { useStayFlow } from '../layout';
import { BarChart3, PieChart, TrendingUp, DollarSign, ShieldAlert } from 'lucide-react';

export default function ReportsPage() {
  const { rooms, bookings, payments } = useStayFlow();

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingReceivables = bookings.reduce((sum, b) => sum + b.balance_amount, 0);
  const averageBookingValue = bookings.length > 0 ? Math.round(bookings.reduce((sum, b) => sum + b.total_amount, 0) / bookings.length) : 0;
  
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Derive categories calculations
  const roomTypeDistribution = rooms.reduce((acc: any, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">System Reports & Financial Audits</h2>
        <p className="text-gray-400 text-sm">Aggregated matrix metrics mapping systemic and occupancy operational vectors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#14141f] border border-gray-800 p-5 rounded-xl">
          <div className="text-xs font-mono uppercase tracking-wider text-purple-300">Net Aggregated Yield</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">₱{totalRevenue.toLocaleString()}</div>
          <p className="text-[11px] text-gray-500 mt-2">Sum computation of all structural invoice settlements.</p>
        </div>

        <div className="bg-[#14141f] border border-gray-800 p-5 rounded-xl">
          <div className="text-xs font-mono uppercase tracking-wider text-purple-300">Uncollected Tenant Debt</div>
          <div className="text-3xl font-extrabold text-red-400 mt-1">₱{outstandingReceivables.toLocaleString()}</div>
          <p className="text-[11px] text-gray-500 mt-2">Active reservation pipeline balances remaining unpaid.</p>
        </div>

        <div className="bg-[#14141f] border border-gray-800 p-5 rounded-xl">
          <div className="text-xs font-mono uppercase tracking-wider text-purple-300 text-purple-300">Avg Registered Transaction Value</div>
          <div className="text-3xl font-extrabold text-white mt-1">₱{averageBookingValue.toLocaleString()}</div>
          <p className="text-[11px] text-gray-500 mt-2">Mean total calculation across gross reservation orders.</p>
        </div>
      </div>

      {/* Graphical Breakdown Metrics representation using pure CSS/Tailwind structural metrics panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Occupancy Progress Bar Chart Framework component */}
        <div className="bg-[#14141f] border border-gray-800 p-6 rounded-xl space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-purple-400" /> Operational Capacity Performance</h3>
          
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">Occupancy Distribution Matrix Coefficient</span>
              <span className="text-purple-400 font-bold">{occupancyRate}%</span>
            </div>
            <div className="w-full bg-gray-900 h-3 rounded-full overflow-hidden border border-gray-800">
              <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${occupancyRate}%` }}></div>
            </div>
          </div>
          <div className="text-xs text-gray-400 grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800/40">
              <span className="text-gray-500 block text-[10px]">Active Units</span>
              <span className="text-base font-bold text-white">{occupiedRooms} / {totalRooms} Units</span>
            </div>
            <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800/40">
              <span className="text-gray-500 block text-[10px]">Reservations Active</span>
              <span className="text-base font-bold text-white">{bookings.filter(b => b.status === 'confirmed').length} Holds</span>
            </div>
          </div>
        </div>

        {/* Structural Room Categorization Metric distribution panel */}
        <div className="bg-[#14141f] border border-gray-800 p-6 rounded-xl space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2"><BarChart3 className="w-4 h-4 text-purple-400" /> Asset Allocation Matrix</h3>
          
          <div className="space-y-2.5">
            {Object.keys(roomTypeDistribution).length === 0 ? (
              <p className="text-xs text-gray-500 italic pt-4">No structural assets cataloged to extrapolate dimensions.</p>
            ) : (
              Object.entries(roomTypeDistribution).map(([type, count]: [string, any]) => {
                const percentage = Math.round((count / totalRooms) * 100);
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-xs capitalize text-gray-300 font-mono">
                      <span>{type} Units</span>
                      <span>{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}