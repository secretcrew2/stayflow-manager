"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BedDouble, 
  Users, 
  CalendarDays, 
  CircleDollarSign, 
  Wrench, 
  BarChart3, 
  Settings,
  AlertCircle
} from 'lucide-react';
import "./globals.css";

// Interface definitions reflecting SML Objects
export interface Room {
  id: string;
  number: string;
  name: string;
  type: 'single' | 'double' | 'family' | 'dorm' | 'boarding' | 'suite';
  floor: string;
  capacity: number;
  rate_per_night: number;
  status: 'available' | 'reserved' | 'occupied' | 'cleaning' | 'maintenance';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  id_type: 'none' | 'national_id' | 'drivers_license' | 'passport' | 'school_id' | 'other';
  id_number: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  room_id: string;
  guest_id: string;
  check_in_date: string;
  check_out_date: string;
  nights: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  guest_id: string;
  amount: number;
  method: 'cash' | 'gcash' | 'bank_transfer' | 'card' | 'other';
  reference_number: string;
  created_at: string;
}

export interface MaintenanceRequest {
  id: string;
  room_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'cancelled';
  cost: number;
  created_at: string;
  updated_at: string;
}

export interface HotelSettings {
  hotel_name: string;
  owner_name: string;
  currency: string;
  default_check_in_time: string;
  default_check_out_time: string;
  cleaning_after_checkout: boolean;
}

interface AppState {
  status: string;
  search_query: string;
  room_filter: string;
  booking_filter: string;
  payment_filter: string;
  error_message: string | null;
}

interface StayFlowContextProps {
  rooms: Room[];
  guests: Guest[];
  bookings: Booking[];
  payments: Payment[];
  maintenance: MaintenanceRequest[];
  settings: HotelSettings;
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  addRoom: (r: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => void;
  updateRoom: (id: string, r: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  addGuest: (g: Omit<Guest, 'id' | 'created_at' | 'updated_at'>) => void;
  updateGuest: (id: string, g: Partial<Guest>) => void;
  createBooking: (b: Omit<Booking, 'id' | 'nights' | 'total_amount' | 'paid_amount' | 'balance_amount' | 'status' | 'payment_status' | 'created_at' | 'updated_at'>) => boolean;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  recordPayment: (p: { booking_id: string; amount: number; method: Payment['method']; reference_number: string }) => void;
  addMaintenance: (m: Omit<MaintenanceRequest, 'id' | 'status' | 'created_at' | 'updated_at'>) => void;
  resolveMaintenance: (id: string) => void;
  updateSettings: (s: HotelSettings) => void;
  clearAllData: () => void;
}

const StayFlowContext = createContext<StayFlowContextProps | undefined>(undefined);

export function useStayFlow() {
  const context = useContext(StayFlowContext);
  if (!context) throw new Error("useStayFlow must be used within context provider");
  return context;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [settings, setSettings] = useState<HotelSettings>({
    hotel_name: "StayFlow Boarding House",
    owner_name: "",
    currency: "₱",
    default_check_in_time: "14:00",
    default_check_out_time: "12:00",
    cleaning_after_checkout: true
  });
  const [appState, setAppState] = useState<AppState>({
    status: 'idle',
    search_query: '',
    room_filter: 'all',
    booking_filter: 'all',
    payment_filter: 'all',
    error_message: null
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRooms(JSON.parse(localStorage.getItem('sf_rooms') || '[]'));
      setGuests(JSON.parse(localStorage.getItem('sf_guests') || '[]'));
      setBookings(JSON.parse(localStorage.getItem('sf_bookings') || '[]'));
      setPayments(JSON.parse(localStorage.getItem('sf_payments') || '[]'));
      setMaintenance(JSON.parse(localStorage.getItem('sf_maintenance') || '[]'));
      const savedSettings = localStorage.getItem('sf_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addRoom = (r: any) => {
    const newRoom: Room = {
      ...r,
      id: 'rm_' + Date.now(),
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };
    const updated = [...rooms, newRoom];
    setRooms(updated);
    saveToStorage('sf_rooms', updated);
  };

  const updateRoom = (id: string, updatedFields: Partial<Room>) => {
    const updated = rooms.map(r => r.id === id ? { ...r, ...updatedFields, updated_at: new Date().toISOString().split('T')[0] } : r);
    setRooms(updated);
    saveToStorage('sf_rooms', updated);
  };

  const deleteRoom = (id: string) => {
    const filterRooms = rooms.filter(r => r.id !== id);
    const filterBookings = bookings.filter(b => b.room_id !== id);
    const filterMaint = maintenance.filter(m => m.room_id !== id);
    setRooms(filterRooms);
    setBookings(filterBookings);
    setMaintenance(filterMaint);
    saveToStorage('sf_rooms', filterRooms);
    saveToStorage('sf_bookings', filterBookings);
    saveToStorage('sf_maintenance', filterMaint);
  };

  const addGuest = (g: any) => {
    const newGuest: Guest = {
      ...g,
      id: 'gst_' + Date.now(),
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };
    const updated = [...guests, newGuest];
    setGuests(updated);
    saveToStorage('sf_guests', updated);
  };

  const updateGuest = (id: string, updatedFields: Partial<Guest>) => {
    const updated = guests.map(g => g.id === id ? { ...g, ...updatedFields, updated_at: new Date().toISOString().split('T')[0] } : g);
    setGuests(updated);
    saveToStorage('sf_guests', updated);
  };

  const createBooking = (b: any): boolean => {
    const today = new Date().toISOString().split('T')[0];
    if (b.check_out_date <= b.check_in_date || b.check_in_date < today) {
      setAppState(prev => ({ ...prev, status: 'error', error_message: "Booking dates are invalid." }));
      return false;
    }

    const selectedRoom = rooms.find(r => r.id === b.room_id);
    if (selectedRoom && ['maintenance', 'occupied', 'cleaning'].includes(selectedRoom.status)) {
      setAppState(prev => ({ ...prev, status: 'error', error_message: "Room is not available for booking." }));
      return false;
    }

    const hasConflict = bookings.some(book => 
      book.room_id === b.room_id && 
      book.status !== 'cancelled' && 
      book.status !== 'checked_out' &&
      ((b.check_in_date >= book.check_in_date && b.check_in_date < book.check_out_date) ||
       (b.check_out_date > book.check_in_date && b.check_out_date <= book.check_out_date))
    );

    if (hasConflict) {
      setAppState(prev => ({ ...prev, status: 'error', error_message: "Room already has a booking for the selected dates." }));
      return false;
    }

    const nights = Math.max(1, Math.round((new Date(b.check_out_date).getTime() - new Date(b.check_in_date).getTime()) / (1000 * 60 * 60 * 24)));
    const rate = selectedRoom ? selectedRoom.rate_per_night : 0;
    const total_amount = nights * rate;

    const newBooking: Booking = {
      ...b,
      id: 'bk_' + Date.now(),
      nights,
      total_amount,
      paid_amount: 0,
      balance_amount: total_amount,
      status: 'confirmed',
      payment_status: 'unpaid',
      created_at: today,
      updated_at: today
    };

    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    saveToStorage('sf_bookings', updatedBookings);
    updateRoom(b.room_id, { status: 'reserved' });
    return true;
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    const today = new Date().toISOString().split('T')[0];
    const bookingToUpdate = bookings.find(b => b.id === id);
    if (!bookingToUpdate) return;

    let roomStatus: Room['status'] = 'available';
    if (status === 'checked_in') roomStatus = 'occupied';
    else if (status === 'checked_out') roomStatus = settings.cleaning_after_checkout ? 'cleaning' : 'available';
    else if (status === 'confirmed') roomStatus = 'reserved';

    const updated = bookings.map(b => b.id === id ? { ...b, status, updated_at: today } : b);
    setBookings(updated);
    saveToStorage('sf_bookings', updated);
    updateRoom(bookingToUpdate.room_id, { status: roomStatus });
  };

  const recordPayment = (p: any) => {
    const today = new Date().toISOString().split('T')[0];
    const targetBooking = bookings.find(b => b.id === p.booking_id);
    if (!targetBooking) return;

    const newPayment: Payment = {
      id: 'pm_' + Date.now(),
      booking_id: p.booking_id,
      guest_id: targetBooking.guest_id,
      amount: Number(p.amount),
      method: p.method,
      reference_number: p.reference_number,
      created_at: today
    };

    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    saveToStorage('sf_payments', updatedPayments);

    const totalPaid = targetBooking.paid_amount + Number(p.amount);
    const balance = Math.max(0, targetBooking.total_amount - totalPaid);
    let payStatus: Booking['payment_status'] = 'partial';
    if (totalPaid >= targetBooking.total_amount) payStatus = 'paid';
    if (totalPaid === 0) payStatus = 'unpaid';

    const updatedBookings = bookings.map(b => b.id === p.booking_id ? {
      ...b,
      paid_amount: totalPaid,
      balance_amount: balance,
      payment_status: payStatus,
      updated_at: today
    } : b);

    setBookings(updatedBookings);
    saveToStorage('sf_bookings', updatedBookings);
  };

  const addMaintenance = (m: any) => {
    const today = new Date().toISOString().split('T')[0];
    const newMaint: MaintenanceRequest = {
      ...m,
      id: 'mnt_' + Date.now(),
      status: 'open',
      created_at: today,
      updated_at: today
    };
    const updated = [...maintenance, newMaint];
    setMaintenance(updated);
    saveToStorage('sf_maintenance', updated);
    updateRoom(m.room_id, { status: 'maintenance' });
  };

  const resolveMaintenance = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const targetMaint = maintenance.find(m => m.id === id);
    if (!targetMaint) return;

    const updated = maintenance.map(m => m.id === id ? { ...m, status: 'resolved' as const, updated_at: today } : m);
    setMaintenance(updated);
    saveToStorage('sf_maintenance', updated);
    updateRoom(targetMaint.room_id, { status: 'available' });
  };

  const updateSettings = (newSettings: HotelSettings) => {
    setSettings(newSettings);
    saveToStorage('sf_settings', newSettings);
  };

  const clearAllData = () => {
    localStorage.clear();
    setRooms([]);
    setGuests([]);
    setBookings([]);
    setPayments([]);
    setMaintenance([]);
    setSettings({
      hotel_name: "StayFlow Boarding House",
      owner_name: "",
      currency: "₱",
      default_check_in_time: "14:00",
      default_check_out_time: "12:00",
      cleaning_after_checkout: true
    });
  };

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/rooms', label: 'Rooms', icon: BedDouble },
    { href: '/guests', label: 'Guests', icon: Users },
    { href: '/bookings', label: 'Bookings', icon: CalendarDays },
    { href: '/payments', label: 'Payments', icon: CircleDollarSign },
    { href: '/maintenance', label: 'Maintenance', icon: Wrench },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  // SML Descriptive Stayflow Health evaluation 
  const getHealthText = () => {
    if (maintenance.some(m => m.status === 'open')) return "Some rooms need maintenance";
    if (bookings.some(b => b.payment_status === 'unpaid')) return "Some bookings still have unpaid balances";
    if (rooms.length === 0) return "No rooms yet. Add your first room.";
    return "StayFlow records are active";
  };

  return (
    <html lang="en">
      <body>
        <StayFlowContext.Provider value={{
          rooms, guests, bookings, payments, maintenance, settings, appState, setAppState,
          addRoom, updateRoom, deleteRoom, addGuest, updateGuest, createBooking, updateBookingStatus,
          recordPayment, addMaintenance, resolveMaintenance, updateSettings, clearAllData
        }}>
          <div className="flex min-h-screen">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-[#14141f] border-r border-gray-800 flex flex-col p-4 space-y-6">
              <div className="px-2 py-3 border-b border-gray-800">
                <h1 className="text-xl font-bold text-purple-400 tracking-wide">{settings.hotel_name}</h1>
                <p className="text-xs text-gray-400 mt-1">Admin Operations Console</p>
              </div>

              <nav className="flex-1 space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                        isActive 
                          ? 'bg-purple-600/20 text-purple-400 font-medium border-l-4 border-purple-500 pl-2' 
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'}`} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
                <div className="text-xs text-purple-300 font-medium uppercase tracking-wider mb-1">System Health</div>
                <div className="text-xs text-gray-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {getHealthText()}
                </div>
              </div>
            </aside>

            {/* Main Application Window */}
            <main className="flex-1 bg-[#0f0f17] p-8 overflow-y-auto">
              {appState.status === 'error' && appState.error_message && (
                <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-xl mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span>{appState.error_message}</span>
                  </div>
                  <button 
                    onClick={() => setAppState(prev => ({ ...prev, status: 'idle', error_message: null }))}
                    className="text-xs uppercase bg-red-800 px-3 py-1 rounded-md hover:bg-red-700"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              {children}
            </main>
          </div>
        </StayFlowContext.Provider>
      </body>
    </html>
  );
}