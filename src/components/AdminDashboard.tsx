import React, { useState } from 'react';
import {
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  UserX,
  Phone,
  MessageCircle,
  Plus,
  Printer,
  Sparkles,
  Wrench,
  DollarSign,
  TrendingUp,
  BedDouble,
  Bell,
  Volume2,
  Calendar,
} from 'lucide-react';
import { Room, Booking, RoomStatus, BookingStatus, AppNotification } from '../types';
import { VILLA_DETAILS } from '../data/roomsData';
import { generateBookingId } from '../utils/storage';
import { playNotificationSound, triggerBrowserNotification } from '../utils/audio';

interface AdminDashboardProps {
  rooms: Room[];
  bookings: Booking[];
  currency: 'PKR' | 'USD';
  onUpdateRoomStatus: (roomId: string, status: RoomStatus) => void;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  onAddNewBooking: (booking: Booking) => void;
  onAddNotification: (notif: Omit<AppNotification, 'id' | 'timestamp'>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  rooms,
  bookings,
  currency,
  onUpdateRoomStatus,
  onUpdateBookingStatus,
  onAddNewBooking,
  onAddNotification,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewBookingForm, setShowNewBookingForm] = useState(false);

  // New Walk-in Reservation Form State
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('+92 ');
  const [newRoomId, setNewRoomId] = useState(rooms[0]?.id || '');
  const [newCheckIn, setNewCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [newCheckOut, setNewCheckOut] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [newPaid, setNewPaid] = useState(true);

  // Metrics
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const totalRevenuePKR = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((acc, b) => acc + b.totalPKR, 0);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestPhone.includes(searchQuery) ||
      b.roomName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    const targetRoom = rooms.find((r) => r.id === newRoomId);
    if (!targetRoom || !newGuestName.trim() || !newGuestPhone.trim()) return;

    const start = new Date(newCheckIn);
    const end = new Date(newCheckOut);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const totalPKR = targetRoom.pricePKR * nights;

    const newBooking: Booking = {
      id: generateBookingId(),
      guestName: newGuestName,
      guestEmail: 'walkin@tajvilla.com',
      guestPhone: newGuestPhone,
      guestCity: 'Front Desk Walk-in',
      roomId: targetRoom.id,
      roomName: targetRoom.name,
      roomNumber: targetRoom.roomNumber,
      checkInDate: newCheckIn,
      checkOutDate: newCheckOut,
      nights,
      adults: 2,
      children: 0,
      totalPKR,
      totalUSD: Math.round(totalPKR / 280),
      paymentMethod: 'pay_on_arrival',
      paymentStatus: newPaid ? 'paid' : 'pending',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      notes: 'Direct Front Desk Entry',
    };

    onAddNewBooking(newBooking);
    onUpdateRoomStatus(targetRoom.id, 'occupied');
    setShowNewBookingForm(false);
    setNewGuestName('');
    setNewGuestPhone('+92 ');

    playNotificationSound();
    onAddNotification({
      title: 'Walk-in Booking Created',
      message: `Room #${targetRoom.roomNumber} assigned to ${newGuestName} (${newBooking.id}).`,
      read: false,
      type: 'admin',
      bookingId: newBooking.id,
    });
  };

  const handleTestAlertChime = () => {
    playNotificationSound();
    triggerBrowserNotification(
      'Taj Villa Front Desk Alert',
      'Push notification sound and browser notification test passed!'
    );
    onAddNotification({
      title: 'Front Desk Push Test',
      message: 'Notification chime sounded successfully for staff.',
      read: false,
      type: 'admin',
    });
  };

  const getGuestWhatsAppUrl = (b: Booking) => {
    const rawNumber = b.guestPhone.replace(/\D/g, '');
    const cleanNumber = rawNumber.startsWith('0') ? `92${rawNumber.slice(1)}` : rawNumber;
    const msg = `Dear ${b.guestName}, Greetings from Taj Villa Guest House Islamabad! 
Your reservation *${b.id}* for *${b.roomName}* (Room #${b.roomNumber}) is confirmed.
Check-in: ${b.checkInDate} | Check-out: ${b.checkOutDate}
Address: House #14, Sumbal Rd, F-10 Islamabad (Plus Code: M2V6+JR)
Contact: +92 342 8332015. We look forward to hosting you!`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Staff Badge & Push Sound Test */}
      <div className="bg-stone-900 text-white p-5 rounded-2xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600 text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-bold">Taj Villa Staff & Admin Control</h1>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Front Desk Live
              </span>
            </div>
            <p className="text-xs text-stone-400">
              House #14, Sumbal Rd, F-10 Islamabad • Hotline: +92 342 8332015
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTestAlertChime}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Test the chime sound played on new reservations"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Test Push Chime</span>
          </button>

          <button
            onClick={() => setShowNewBookingForm(!showNewBookingForm)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Walk-in Booking</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Total Villa Rooms</span>
            <BedDouble className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">{totalRooms}</div>
          <p className="text-[11px] text-stone-400 mt-1">Full House #14 capacity</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Available Rooms</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{availableRooms}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Ready for check-in</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Occupied / Reserved</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-800">{occupiedRooms}</div>
          <p className="text-[11px] text-stone-400 mt-1">Active guest stays</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Bookings Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-900 truncate">
            PKR {totalRevenuePKR.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            {currency === 'USD' ? `Approx $${Math.round(totalRevenuePKR / 280)}` : 'Recorded bookings'}
          </p>
        </div>
      </div>

      {/* NEW WALK-IN RESERVATION MODAL / FORM */}
      {showNewBookingForm && (
        <form
          onSubmit={handleCreateWalkIn}
          className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <h3 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-800" />
              Direct Walk-in / Phone Booking Entry (Staff)
            </h3>
            <button
              type="button"
              onClick={() => setShowNewBookingForm(false)}
              className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Guest Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Mehmood"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone / WhatsApp</label>
              <input
                type="tel"
                required
                placeholder="+92 342 8332015"
                value={newGuestPhone}
                onChange={(e) => setNewGuestPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Assign Room</label>
              <select
                value={newRoomId}
                onChange={(e) => setNewRoomId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    #{r.roomNumber} - {r.name} (PKR {r.pricePKR.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Check-in Date</label>
              <input
                type="date"
                value={newCheckIn}
                onChange={(e) => setNewCheckIn(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Check-out Date</label>
              <input
                type="date"
                value={newCheckOut}
                min={newCheckIn}
                onChange={(e) => setNewCheckOut(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="paid-now"
                checked={newPaid}
                onChange={(e) => setNewPaid(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm cursor-pointer"
              />
              <label htmlFor="paid-now" className="text-xs font-semibold text-stone-800 cursor-pointer">
                Payment Settled at Desk
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Confirm Walk-In & Check In Guest
            </button>
          </div>
        </form>
      )}

      {/* QUICK ROOM STATUS CONTROL MATRIX */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Room Status & Housekeeping Control</h3>
            <p className="text-xs text-stone-500">
              Directly toggle current physical room state at House #14, Sumbal Rd.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between space-y-2.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">#{room.roomNumber}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                      room.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : room.status === 'occupied'
                        ? 'bg-blue-100 text-blue-800'
                        : room.status === 'reserved'
                        ? 'bg-amber-100 text-amber-800'
                        : room.status === 'cleaning'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {room.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-stone-700 truncate mt-0.5">{room.name}</div>
                <div className="text-[11px] text-stone-500">PKR {room.pricePKR.toLocaleString()}/nt</div>
              </div>

              {/* Status Change Dropdown */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Set Status:</label>
                <select
                  value={room.status}
                  onChange={(e) => {
                    const next = e.target.value as RoomStatus;
                    onUpdateRoomStatus(room.id, next);
                    onAddNotification({
                      title: `Room #${room.roomNumber} Status Changed`,
                      message: `Set to ${next.toUpperCase()} by Front Desk Staff.`,
                      read: false,
                      type: 'status_change',
                    });
                  }}
                  className="w-full text-xs font-semibold bg-white border border-stone-300 rounded-lg p-1.5 text-stone-800 cursor-pointer"
                >
                  <option value="available">Available (Vacant)</option>
                  <option value="occupied">Occupied (Checked In)</option>
                  <option value="reserved">Reserved (Booked)</option>
                  <option value="cleaning">Cleaning (Housekeeping)</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALL RESERVATIONS MANAGEMENT TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Table Header & Search Filter */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Reservations & Bookings Registry</h3>
            <p className="text-xs text-stone-500">
              Manage guest check-ins, verify payments, or dispatch WhatsApp vouchers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search guest, ID, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden w-48 sm:w-60"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-700 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px] text-xs">
            <thead>
              <tr className="bg-stone-100 text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200">
                <th className="p-3">Ref ID</th>
                <th className="p-3">Guest</th>
                <th className="p-3">Room</th>
                <th className="p-3">Dates (Nights)</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    No reservations matching current filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-amber-900">
                      {b.id}
                      <div className="text-[10px] text-stone-400 font-normal">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-stone-900">{b.guestName}</div>
                      <div className="text-stone-500 text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {b.guestPhone}
                      </div>
                      {b.guestCity && (
                        <div className="text-[10px] text-stone-400">{b.guestCity}</div>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-stone-900">{b.roomName}</div>
                      <span className="text-[11px] text-amber-800 font-bold">Room #{b.roomNumber}</span>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-stone-800">
                        {b.checkInDate} &rarr; {b.checkOutDate}
                      </div>
                      <div className="text-[11px] text-stone-500 font-semibold">{b.nights} Night(s)</div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-stone-900">PKR {b.totalPKR.toLocaleString()}</div>
                      <div className="text-[10px] text-stone-500 capitalize">
                        {b.paymentMethod.replace('_', ' ')}
                        {b.transactionId && <span className="font-mono ml-1">({b.transactionId})</span>}
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] capitalize ${
                          b.status === 'confirmed'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : b.status === 'checked_in'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : b.status === 'checked_out'
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp guest */}
                        <a
                          href={getGuestWhatsAppUrl(b)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="Message Guest on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        {/* Check In Action */}
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              onUpdateBookingStatus(b.id, 'checked_in');
                              onUpdateRoomStatus(b.roomId, 'occupied');
                              playNotificationSound();
                            }}
                            className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer flex items-center gap-1"
                            title="Check In Guest"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Check-In</span>
                          </button>
                        )}

                        {/* Check Out Action */}
                        {b.status === 'checked_in' && (
                          <button
                            onClick={() => {
                              onUpdateBookingStatus(b.id, 'checked_out');
                              onUpdateRoomStatus(b.roomId, 'cleaning');
                              playNotificationSound();
                            }}
                            className="px-2 py-1 rounded-md bg-stone-700 hover:bg-stone-800 text-white font-bold text-[10px] cursor-pointer flex items-center gap-1"
                            title="Check Out Guest & Mark Room for Cleaning"
                          >
                            <UserX className="w-3 h-3" />
                            <span>Check-Out</span>
                          </button>
                        )}

                        {/* Cancel Action */}
                        {b.status !== 'cancelled' && b.status !== 'checked_out' && (
                          <button
                            onClick={() => {
                              if (confirm(`Cancel reservation ${b.id} for ${b.guestName}?`)) {
                                onUpdateBookingStatus(b.id, 'cancelled');
                                onUpdateRoomStatus(b.roomId, 'available');
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
