"use client";

import React, { useState } from 'react';
import { useStayFlow } from '../layout';
import { Search, UserPlus, Edit3, Contact } from 'lucide-react';

export default function GuestsPage() {
  const { guests, bookings, addGuest, updateGuest } = useStayFlow();
  const [search, setSearch] = useState('');

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [idType, setIdType] = useState<'none' | 'national_id' | 'drivers_license' | 'passport' | 'school_id' | 'other'>('none');
  const [idNumber, setIdNumber] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;

    const guestPayload = { full_name: fullName, phone, email, address, id_type: idType, id_number: idNumber };

    if (editingId) {
      updateGuest(editingId, guestPayload);
      setEditingId(null);
    } else {
      addGuest(guestPayload);
    }

    setFullName(''); setPhone(''); setEmail(''); setAddress(''); setIdType('none'); setIdNumber('');
  };

  const startEdit = (guest: any) => {
    setEditingId(guest.id);
    setFullName(guest.full_name);
    setPhone(guest.phone);
    setEmail(guest.email);
    setAddress(guest.address);
    setIdType(guest.id_type);
    setIdNumber(guest.id_number);
  };

  const filteredGuests = guests.filter(g => 
    g.full_name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Guest Information Directory</h2>
        <p className="text-gray-400 text-sm">Manage comprehensive profile ledgers and contact metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Guest Addition / Mod Form */}
        <div className="bg-[#14141f] p-6 rounded-xl border border-gray-800 h-fit">
          <h3 className="text-base font-semibold text-white mb-4">
            {editingId ? 'Modify Guest Profile' : 'Enroll New Profile Ledger'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Full Name (Required)</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">Mobile Number</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+639..." />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Home Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, City, Province" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">Government ID Type</label>
                <select value={idType} onChange={e => setIdType(e.target.value as any)}>
                  <option value="none">None Provided</option>
                  <option value="national_id">National ID</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="passport">Passport</option>
                  <option value="school_id">School ID</option>
                  <option value="other">Other ID Option</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">ID serial number</label>
                <input type="text" value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="ID Code Number" />
              </div>
            </div>

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition mt-2">
              {editingId ? 'Update Client Record' : 'Save Profile Ledger'}
            </button>
          </form>
        </div>

        {/* Directory Listings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            <input type="text" placeholder="Search profiles by name, email, parameters..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9" />
          </div>

          {filteredGuests.length === 0 ? (
            <div className="bg-[#14141f] border border-gray-800 rounded-xl p-12 text-center text-gray-500 text-sm">
              No matching client profiles identified in system directory.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGuests.map((guest) => {
                const guestBookings = bookings.filter(b => b.guest_id === guest.id);
                return (
                  <div key={guest.id} className="bg-[#14141f] border border-gray-800 rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{guest.full_name}</h4>
                        <span className="text-[10px] text-gray-400 font-mono bg-gray-800 px-2 py-0.5 rounded">ID: {guest.id}</span>
                      </div>
                      <div className="text-xs text-gray-400 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 pt-1">
                        <div><span className="text-gray-500">Contact:</span> {guest.phone || 'None'}</div>
                        <div><span className="text-gray-500">Email:</span> {guest.email || 'None'}</div>
                        <div><span className="text-gray-500">Address:</span> {guest.address || 'None'}</div>
                        <div><span className="text-gray-500">ID Verification:</span> <span className="uppercase text-purple-300">{guest.id_type}</span> {guest.id_number && `(${guest.id_number})`}</div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-between items-end border-t md:border-t-0 border-gray-800 pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">Booking Summary</span>
                        <span className="text-xs text-gray-300 font-medium">{guestBookings.length} total orders processed</span>
                      </div>
                      <button onClick={() => startEdit(guest)} className="mt-2 text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg transition">
                        <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                      </button>
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