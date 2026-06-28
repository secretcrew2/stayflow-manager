"use client";

import React, { useState } from 'react';
import { useStayFlow } from '../layout';
import { CheckCircle, AlertTriangle, Hammer, Plus } from 'lucide-react';

export default function MaintenancePage() {
  const {
    maintenance = [],
    rooms,
    addMaintenance,
    resolveMaintenance,
  } = useStayFlow(); // Default parameter added
  const maintenanceList = maintenance;

  // Form states parameters components
  const [roomId, setRoomId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [cost, setCost] = useState('0');

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !title) return;

    addMaintenance({
      room_id: roomId,
      title,
      description,
      priority,
      cost: Number(cost)
    });

    setRoomId(''); setTitle(''); setDescription(''); setPriority('medium'); setCost('0');
  };

  const activeCostSummary = maintenanceList.reduce((sum, item) => sum + (item.status !== 'cancelled' ? item.cost : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Facility Maintenance Logs</h2>
          <p className="text-gray-400 text-sm">Isolate compromised units, register technical requests, track facility overhead.</p>
        </div>
        <div className="bg-[#14141f] border border-gray-800 px-4 py-2.5 rounded-xl text-right">
          <span className="text-[10px] text-gray-500 uppercase font-mono block">Accumulated Service Cost</span>
          <span className="text-lg font-bold text-red-400">₱{activeCostSummary.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Maintenance Dispatch Entry Form */}
        <div className="bg-[#14141f] p-6 rounded-xl border border-gray-800 h-fit">
          <h3 className="text-base font-semibold text-white mb-4">File Maintenance Action</h3>
          <form onSubmit={handleMaintenanceSubmit} className="space-y-4 text-sm">
            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Compromised Room Asset</label>
              <select value={roomId} onChange={e => setRoomId(e.target.value)} required>
                <option value="">-- Choose Room Unit --</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>Room {r.number} - Current Status: {r.status}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Issue Summary Headline</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Defective AC Unit Compressor" required />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-gray-400 text-xs font-medium">Granular Problem Specifications</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe structural issue..." rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">Threat Level Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value as any)}>
                  <option value="low">Low Level</option>
                  <option value="medium">Medium Baseline</option>
                  <option value="high">High Disruptive</option>
                  <option value="urgent">Urgent Intervene</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-gray-400 text-xs font-medium">Projected Overhead Cost (₱)</label>
                <input type="number" min="0" value={cost} onChange={e => setCost(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition">
              Dispatch Structural Ticket
            </button>
          </form>
        </div>

        {/* Ticket Operations Pipeline Monitoring Panel */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-base font-semibold text-white mb-2">Active Engineering Infrastructure Pipelines</h3>
          {maintenanceList.length === 0 ? (
            <div className="bg-[#14141f] border border-gray-800 rounded-xl p-12 text-center text-gray-500 text-sm">
              Facility infrastructure reports indicate clean parameters across all rooms.
            </div>
          ) : (
            <div className="space-y-3">
              {maintenanceList.map((ticket) => {
                const room = rooms.find(r => r.id === ticket.room_id);
                return (
                  <div key={ticket.id} className="bg-[#14141f] border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-mono font-bold bg-gray-900 border border-gray-800 px-2 py-0.5 text-amber-400 rounded">Room {room?.number || '??'}</span>
                        <h4 className="text-sm font-semibold text-white">{ticket.title}</h4>
                      </div>
                      {ticket.description && <p className="text-xs text-gray-400">{ticket.description}</p>}
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono pt-1">
                        <div>Priority: <span className="text-purple-300 font-semibold uppercase">{ticket.priority}</span></div>
                        <div>Estimated Tariff: <span className="text-red-400">₱{ticket.cost}</span></div>
                        <div>Logged: {ticket.created_at}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gray-800/60 pt-2.5 md:pt-0">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {ticket.status}
                      </span>
                      {ticket.status === 'open' && (
                        <button
                          onClick={() => resolveMaintenance(ticket.id)}
                          className="text-xs flex items-center gap-1 bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 px-3 py-1 rounded-lg transition"
                        >
                          <CheckCircle className="w-3 h-3" /> Mark Resolved
                        </button>
                      )}
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