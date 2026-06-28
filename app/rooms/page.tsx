"use client";

import React, { useState } from 'react';
import { useStayFlow } from '../layout';
import { Trash2, Edit2, Plus, Search, Filter } from 'lucide-react';

export default function RoomsPage() {
  const { rooms, addRoom, updateRoom, deleteRoom, appState, setAppState } = useStayFlow();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Form Fields State
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'single' | 'double' | 'family' | 'dorm' | 'boarding' | 'suite'>('single');
  const [floor, setFloor] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [rate, setRate] = useState(0);
  const [status, setStatus] = useState<'available' | 'reserved' | 'occupied' | 'cleaning' | 'maintenance'>('available');
  const [notes, setNotes] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number) return;

    const roomPayload = { number, name, type, floor, capacity: Number(capacity), rate_per_night: Number(rate), status, notes };

    if (editingId) {
      updateRoom(editingId, roomPayload);
      setEditingId(null);
    } else {
      addRoom(roomPayload);
    }

    // Reset Form
    setNumber(''); setName(''); setType('single'); setFloor(''); setCapacity(1); setRate(0); setStatus('available'); setNotes('');
  };

  const startEdit = (room: any) => {
    setEditingId(room.id);
    setNumber(room.number);
    setName(room.name);
    setType(room.type);
    setFloor(room.floor);
    setCapacity(room.capacity);
    setRate(room.rate_per_night);
    setStatus(room.status);
    setNotes(room.notes);
  };

  const filteredRooms = rooms.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch = r.number.toLowerCase().includes(search.toLowerCase()) || 
                          r.name.toLowerCase().includes(search.toLowerCase()) || 
                          r.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Room Inventory Configuration</h2>
        <p className="text-gray-400 text-sm">Add, configure, and monitor accommodation assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room Management Form */}
        <div className="bg-[#14141f] p-6 rounded-xl border border-gray-800 h-fit">
          <h3 className="text-base font-semibold text-white mb-4">
            {editingId ? 'Modify Configuration' : 'Register New Accommodation Asset'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">Room # (Required)</label>
                <input type="text" value={number} onChange={e => setNumber(e.target.value)} placeholder="e.g. 101" required />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">Label / Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Premium Corner" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">Category Type</label>
                <select value={type} onChange={e => setType(e.target.value as any)}>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="family">Family</option>
                  <option value="dorm">Dorm</option>
                  <option value="boarding">Boarding</option>
                  <option value="suite">Suite</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">Floor Level</label>
                <input type="text" value={floor} onChange={e => setFloor(e.target.value)} placeholder="e.g. 1st Floor" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">Capacity (Max Pax)</label>
                <input type="number" min="1" value={capacity} onChange={e => setCapacity(Number(e.target.value))} />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">Rate per Night (₱)</label>
                <input type="number" min="0" value={rate} onChange={e => setRate(Number(e.target.value))} />
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Initial Operational Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as any)}>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="occupied">Occupied</option>
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Internal System Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Amenities or structural notes..." rows={2} />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition">
                {editingId ? 'Save Configuration' : 'Commit Asset Entry'}
              </button>
              {editingId && (
                <button type="button" onClick={() => {
                  setEditingId(null);
                  setNumber(''); setName(''); setType('single'); setFloor(''); setCapacity(1); setRate(0); setStatus('available'); setNotes('');
                }} className="bg-gray-800 hover:bg-gray-700 px-3 rounded-lg text-gray-300">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Room Grid List View */}
        <div className="lg:col-span-2 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input type="text" placeholder="Search rooms by number, tags..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9" />
            </div>
            <div className="flex items-center gap-2 bg-[#14141f] px-3 py-1.5 rounded-lg border border-gray-800">
              <Filter className="w-4 h-4 text-purple-400" />
              <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-transparent border-none p-0 text-xs focus:outline-none">
                <option value="all">All States</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="occupied">Occupied</option>
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Records Display Grid */}
          {filteredRooms.length === 0 ? (
            <div className="bg-[#14141f] border border-gray-800 rounded-xl p-12 text-center text-gray-500 text-sm">
              No matching room assets identified in storage database.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRooms.map((room) => (
                <div key={room.id} className="bg-[#14141f] border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xl font-bold text-white">Room {room.number}</span>
                        {room.name && <p className="text-xs text-gray-400">{room.name}</p>}
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                        room.status === 'available' ? 'bg-emerald-500/10 text-emerald-400' :
                        room.status === 'occupied' ? 'bg-amber-500/10 text-amber-400' :
                        room.status === 'reserved' ? 'bg-blue-500/10 text-blue-400' :
                        room.status === 'cleaning' ? 'bg-purple-500/10 text-purple-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {room.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 mt-4 text-xs border-b border-gray-800/60 pb-3">
                      <div><span className="text-gray-500">Classification:</span> <span className="capitalize text-gray-300">{room.type}</span></div>
                      <div><span className="text-gray-500">Floor Layout:</span> <span className="text-gray-300">{room.floor || 'N/A'}</span></div>
                      <div><span className="text-gray-500">Max Capacity:</span> <span className="text-gray-300">{room.capacity} Pax</span></div>
                      <div><span className="text-gray-500">Base Tariff:</span> <span className="text-purple-400 font-medium">₱{room.rate_per_night}/nt</span></div>
                    </div>

                    {room.notes && <p className="text-xs text-gray-400 italic mt-2">"{room.notes}"</p>}
                  </div>

                  <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-800/40">
                    <button onClick={() => startEdit(room)} className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition" title="Modify Details">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteRoom(room.id)} className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition" title="Purge Record">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}