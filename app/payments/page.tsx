"use client";

import React, { useState } from 'react';
import { useStayFlow } from '../layout';
import { Receipt, CreditCard, Search, DollarSign } from 'lucide-react';

export default function PaymentsPage() {
  const { payments, bookings, guests, recordPayment } = useStayFlow();
  
  // Form input controls state
  const [bookingId, setBookingId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'cash' | 'gcash' | 'bank_transfer' | 'card' | 'other'>('cash');
  const [refNum, setRefNum] = useState('');

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId || Number(amount) <= 0) return;

    recordPayment({ booking_id: bookingId, amount: Number(amount), method, reference_number: refNum });
    setBookingId(''); setAmount(''); setRefNum('');
  };

  const selectedBookingData = bookings.find(b => b.id === bookingId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Payment Accounts Ledger</h2>
        <p className="text-gray-400 text-sm">Collect deposits, verify reference hashes, and compute overall ledger statements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Collection input capture module form */}
        <div className="bg-[#14141f] p-6 rounded-xl border border-gray-800 h-fit">
          <h3 className="text-base font-semibold text-white mb-4">Record Financial Collection</h3>
          <form onSubmit={handlePaymentSubmit} className="space-y-4 text-sm">
            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Target Reservation Booking</label>
              <select value={bookingId} onChange={e => setBookingId(e.target.value)} required>
                <option value="">-- Choose Target Account --</option>
                {bookings.filter(b => b.status !== 'cancelled').map(b => {
                  const guest = guests.find(g => g.id === b.guest_id);
                  return (
                    <option key={b.id} value={b.id}>
                      {guest?.full_name} - Balance: ₱{b.balance_amount} [Total: ₱{b.total_amount}]
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedBookingData && (
              <div className="bg-purple-950/20 border border-purple-900/50 p-3 rounded-lg text-xs space-y-1 text-purple-300">
                <div><strong>Outstanding Balance:</strong> ₱{selectedBookingData.balance_amount}</div>
                <div><strong>Current Payment Status:</strong> <span className="uppercase font-semibold">{selectedBookingData.payment_status}</span></div>
              </div>
            )}

            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Collected Cash Value (₱)</label>
              <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Gateway Protocol Method</label>
              <select value={method} onChange={e => setMethod(e.target.value as any)}>
                <option value="cash">Hard Cash</option>
                <option value="gcash">GCash Digital Wallet</option>
                <option value="bank_transfer">Electronic Bank Wire</option>
                <option value="card">Credit/Debit Card Terminal</option>
                <option value="other">Alternative Provision</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Transaction Hash / Reference Serial</label>
              <input type="text" value={refNum} onChange={e => setRefNum(e.target.value)} placeholder="e.g. Instapay Ref ID" />
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition">
              Inject Transaction Entry
            </button>
          </form>
        </div>

        {/* Audit Logs Table Ledger Component */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-semibold text-white">System Transaction Settlement Audit Logs</h3>
          {payments.length === 0 ? (
            <div className="bg-[#14141f] border border-gray-800 rounded-xl p-12 text-center text-gray-500 text-sm">
              No payments captured via client gateway yet.
            </div>
          ) : (
            <div className="bg-[#14141f] border border-gray-800 rounded-xl overflow-hidden text-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-gray-400 border-b border-gray-800 text-xs uppercase font-mono">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Profile</th>
                    <th className="p-4">Channel</th>
                    <th className="p-4">Tracking Code</th>
                    <th className="p-4 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {payments.map((p) => {
                    const guest = guests.find(g => g.id === p.guest_id);
                    return (
                      <tr key={p.id} className="hover:bg-gray-800/20 transition-all">
                        <td className="p-4 font-mono text-xs text-gray-400">{p.created_at}</td>
                        <td className="p-4 text-gray-200 font-medium">{guest?.full_name || 'System Guest'}</td>
                        <td className="p-4"><span className="text-xs uppercase bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{p.method}</span></td>
                        <td className="p-4 font-mono text-xs text-purple-300">{p.reference_number || '--'}</td>
                        <td className="p-4 text-right text-emerald-400 font-bold">₱{p.amount.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}