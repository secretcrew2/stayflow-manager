"use client";

import React, { useState } from 'react';
import { useStayFlow } from '../layout';
import { CalendarCheck, Check, LogOut, XCircle, Search, AlertTriangle } from 'lucide-react';

export default function BookingsPage() {
  const { bookings, rooms, guests, createBooking, updateBookingStatus, appState, setAppState } = useStayFlow();
  const [filter, setFilter] = useState('all');

  // Form Fields State
  const [roomId, setRoomId] = useState('');
  const [guestId, setGuestId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [notes, setNotes] = useState('');

  const handleRegisterBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !guestId || !checkIn || !checkOut) return;

    const success = createBooking({
      room_id: roomId,
      guest_id: guestId,
      check_in_date: checkIn,
      check_out_date: checkOut,
      notes
    });

    if (success) {
      setRoomId(''); setGuestId(''); setCheckIn(''); setCheckOut(''); setNotes('');
    }
  };

  const activeFilteredBookings = bookings.filter(b => filter === 'all' || b.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Reservation Scheduler</h2>
        <p className="text-gray-400 text-sm">Schedule arrivals, fulfill check-ins, and clear out departures.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reservation Entry form */}
        <div className="bg-[#14141f] p-6 rounded-xl border border-gray-800 h-fit">
          <h3 className="text-base font-semibold text-white mb-4">Draft New Reservation Order</h3>
          <form onSubmit={handleRegisterBooking} className="space-y-4 text-sm">
            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Assign Accommodation Room</label>
              <select value={roomId} onChange={e => setRoomId(e.target.value)} required>
                <option value="">-- Choose Room Number --</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    Room {r.number} ({r.type}) - ₱{r.rate_per_night}/nt [Status: {r.status}]
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Associate Guest Profile</label>
              <select value={guestId} onChange={e => setGuestId(e.target.value)} required>
                <option value="">-- Choose Profile --</option>
                {guests.map(g => (
                  <option key={g.id} value={g.id}>{g.full_name} ({g.phone || 'No Phone'})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">Check-In Calendar</label>
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">Check-Out Calendar</label>
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required />
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Scheduling Directives/Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Special conditions or arrangements..." rows={2} />
            </div>

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition">
              Verify & Instantiate Reservation
            </button>
          </form>
        </div>

        {/* Schedule Monitoring Ledger */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filtering states components */}
          <div className="flex items-center gap-2 bg-[#14141f] p-2 rounded-xl border border-gray-800 w-fit text-xs">
            <span className="text-gray-500 pl-2 font-medium">Filter Lifecycle:</span>
            {['all', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1 rounded-lg capitalize transition ${
                  filter === st ? 'bg-purple-600 text-white font-medium' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {activeFilteredBookings.length === 0 ? (
            <div className="bg-[#14141f] border border-gray-800 rounded-xl p-12 text-center text-gray-500 text-sm">
              No reservation orders fall within this systemic scope selection.
            </div>
          ) : (
            <div className="space-y-4">
              {activeFilteredBookings.map((b) => {
                const room = rooms.find(r => r.id === b.room_id);
                const guest = guests.find(g => g.id === b.guest_id);
                return (
                  <div key={b.id} className="bg-[#14141f] border border-gray-800 rounded-xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-bold text-white">{guest?.full_name || 'System Guest Profile'}</h4>
                        <p className="text-xs text-purple-300 font-medium mt-0.5">Assigned Room {room?.number || 'Unknown'} ({room?.type})</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          b.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {b.payment_status}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'checked_in' ? 'bg-amber-500/10 text-amber-400' : 'bg-purple-500/10 text-purple-400'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-300 bg-gray-900/40 p-3 rounded-lg font-mono">
                      <div><span className="text-gray-500 block text-[10px] uppercase">Arrival</span>{b.check_in_date}</div>
                      <div><span className="text-gray-500 block text-[10px] uppercase">Departure</span>{b.check_out_date}</div>
                      <div><span className="text-gray-500 block text-[10px] uppercase">Metrics</span>{b.nights} Nights</div>
                      <div><span className="text-gray-500 block text-[10px] uppercase">Balance</span>₱{b.balance_amount} / ₱{b.total_amount}</div>
                    </div>

                    {/* Operational Lifecycle triggers */}
                    {b.status !== 'cancelled' && b.status !== 'checked_out' && (
                      <div className="flex gap-2 justify-end pt-1">
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'checked_in')}
                            className="text-xs flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition"
                          >
                            <Check className="w-3.5 h-3.5" /> Execute Check-In
                          </button>
                        )}
                        {b.status === 'checked_in' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'checked_out')}
                            className="text-xs flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg transition"
                          >
                            <LogOut className="w-3.5 h-3.5" /> Finalize Departure
                          </button>
                        )}
                        <button
                          onClick={() => updateBookingStatus(b.id, 'cancelled')}
                          className="text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-red-400 px-3 py-1.5 rounded-lg transition"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Void Order
                        </button>
                      </div>
                    )}
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