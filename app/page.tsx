"use client";

import React from 'react';
import { useStayFlow } from './layout';
import { BedDouble, Users, CalendarDays, CircleDollarSign, ShieldCheck, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function Dashboard() {
  const { rooms, guests, bookings, payments } = useStayFlow();

  // Compute Metrics matching SML Compute Declarations
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const reservedRooms = rooms.filter(r => r.status === 'reserved').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;
  
  const totalGuests = guests.length;
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in').length;
  
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingBalance = bookings.reduce((sum, b) => sum + b.balance_amount, 0);
  
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const averageBookingValue = bookings.length > 0 ? Math.round(bookings.reduce((sum, b) => sum + b.total_amount, 0) / bookings.length) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckIns = bookings.filter(b => b.check_in_date === todayStr).length;
  const todayCheckOuts = bookings.filter(b => b.check_out_date === todayStr).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-gray-400 text-sm">Real-time room analytics and transaction logs.</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#14141f] p-5 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start text-gray-400">
            <span className="text-sm font-medium">Room Inventory</span>
            <BedDouble className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{totalRooms}</div>
          <div className="flex items-center gap-4 text-xs text-gray-400 mt-2 border-t border-gray-800/50 pt-2">
            <div><span className="text-emerald-400 font-semibold">{availableRooms}</span> Free</div>
            <div><span className="text-amber-400 font-semibold">{occupiedRooms}</span> Stay</div>
            <div><span className="text-blue-400 font-semibold">{reservedRooms}</span> Booked</div>
          </div>
        </div>

        <div className="bg-[#14141f] p-5 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start text-gray-400">
            <span className="text-sm font-medium">Occupancy Performance</span>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{occupancyRate}%</div>
          <div className="text-xs text-gray-400 mt-2 border-t border-gray-800/50 pt-2 flex justify-between">
            <span>Active Bookings</span>
            <span className="text-white font-medium">{activeBookings}</span>
          </div>
        </div>

        <div className="bg-[#14141f] p-5 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start text-gray-400">
            <span className="text-sm font-medium">Financial Revenue</span>
            <CircleDollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">₱{totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-2 border-t border-gray-800/50 pt-2 flex justify-between">
            <span>Avg Value</span>
            <span className="text-gray-200">₱{averageBookingValue.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-[#14141f] p-5 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start text-gray-400">
            <span className="text-sm font-medium">Uncollected Receivables</span>
            <CircleDollarSign className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400 mt-2">₱{pendingBalance.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-2 border-t border-gray-800/50 pt-2 flex justify-between">
            <span>Maintenance Rooms</span>
            <span className="text-amber-500 font-semibold">{maintenanceRooms}</span>
          </div>
        </div>
      </div>

      {/* Operational Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#14141f] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Expected Check-Ins Today</div>
            <div className="text-2xl font-bold text-white mt-1">{todayCheckIns} Arrivals</div>
          </div>
          <ArrowUpRight className="w-8 h-8 text-blue-500 bg-blue-500/10 p-1.5 rounded-lg" />
        </div>
        <div className="bg-[#14141f] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Expected Check-Outs Today</div>
            <div className="text-2xl font-bold text-white mt-1">{todayCheckOuts} Departures</div>
          </div>
          <ArrowDownRight className="w-8 h-8 text-amber-500 bg-amber-500/10 p-1.5 rounded-lg" />
        </div>
      </div>

      {/* Lists Summary Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-[#14141f] p-6 rounded-xl border border-gray-800">
          <h3 className="text-base font-semibold text-white mb-4">Recent Bookings Log</h3>
          {bookings.length === 0 ? (
            <p className="text-xs text-gray-500">No recent guest registrations available.</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(-4).reverse().map((b) => {
                const room = rooms.find(r => r.id === b.room_id);
                const guest = guests.find(g => g.id === b.guest_id);
                return (
                  <div key={b.id} className="flex justify-between items-center p-3 bg-gray-900/40 rounded-lg border border-gray-800/60">
                    <div>
                      <div className="text-sm font-medium text-gray-200">{guest?.full_name || 'Unknown Guest'}</div>
                      <div className="text-xs text-gray-400">Room {room?.number} • {b.nights} Nights</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-purple-400">₱{b.total_amount}</div>
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        b.status === 'checked_in' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>{b.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-[#14141f] p-6 rounded-xl border border-gray-800">
          <h3 className="text-base font-semibold text-white mb-4">Recent Payments Log</h3>
          {payments.length === 0 ? (
            <p className="text-xs text-gray-500">No payment transaction records captured yet.</p>
          ) : (
            <div className="space-y-3">
              {payments.slice(-4).reverse().map((p) => {
                const guest = guests.find(g => g.id === p.guest_id);
                return (
                  <div key={p.id} className="flex justify-between items-center p-3 bg-gray-900/40 rounded-lg border border-gray-800/60">
                    <div>
                      <div className="text-sm font-medium text-gray-200">₱{p.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">{guest?.full_name || 'Guest'} via <span className="uppercase">{p.method}</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 font-mono">{p.created_at}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{p.reference_number || 'No Ref'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}