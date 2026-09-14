import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, Clock, XCircle, Wrench, ShieldAlert, Sparkles } from 'lucide-react';
import { Room, Booking, RoomStatus } from '../types';

interface AvailabilityTrackerProps {
  rooms: Room[];
  bookings: Booking[];
  currency: 'PKR' | 'USD';
  onSelectRoomAndDate: (room: Room, date: string) => void;
}

export const AvailabilityTracker: React.FC<AvailabilityTrackerProps> = ({
  rooms,
  bookings,
  currency,
  onSelectRoomAndDate,
}) => {
  const [startDateOffset, setStartDateOffset] = useState(0); // days from today
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Generate next 10 days
  const daysToShow = 10;
  const dates: { dateStr: string; displayDay: string; displayDate: string; isToday: boolean }[] = [];
  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < daysToShow; i++) {
    const d = new Date();
    d.setDate(d.getDate() + startDateOffset + i);
    const dateStr = d.toISOString().split('T')[0];
    dates.push({
      dateStr,
      displayDay: d.toLocaleDateString('en-US', { weekday: 'short' }),
      displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isToday: dateStr === todayStr,
    });
  }

  const getDayStatusForRoom = (room: Room, dateStr: string): { status: RoomStatus; booking?: Booking } => {
    // Check if room has maintenance or cleaning currently
    if (dateStr === todayStr && (room.status === 'maintenance' || room.status === 'cleaning')) {
      return { status: room.status };
    }

    const targetTime = new Date(dateStr).getTime();
    // Check if any active booking covers this date
    const matchedBooking = bookings.find((b) => {
      if (b.roomId !== room.id || b.status === 'cancelled') return false;
      const bStart = new Date(b.checkInDate).getTime();
      const bEnd = new Date(b.checkOutDate).getTime();
      return targetTime >= bStart && targetTime < bEnd;
    });

    if (matchedBooking) {
      return {
        status: matchedBooking.status === 'checked_in' ? 'occupied' : 'reserved',
        booking: matchedBooking,
      };
    }

    return { status: 'available' };
  };

  const filteredRooms = filterCategory === 'all' ? rooms : rooms.filter((r) => r.category === filterCategory);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Live Room Availability Matrix
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Real-time Sync
            </span>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Tap any available slot to book instantly or check occupancy status across House #14, Sumbal Rd.
          </p>
        </div>

        {/* Date Navigation & Category Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs font-semibold bg-stone-100 border border-stone-300 rounded-lg px-3 py-2 text-stone-700 cursor-pointer"
          >
            <option value="all">All Room Types</option>
            <option value="royal">Royal Suite</option>
            <option value="deluxe">Deluxe Master</option>
            <option value="executive">Executive Balcony</option>
            <option value="family">Family Interconnected</option>
            <option value="classic">Classic Comfort</option>
          </select>

          <div className="flex items-center bg-stone-100 border border-stone-200 rounded-lg p-1">
            <button
              onClick={() => setStartDateOffset((prev) => Math.max(0, prev - 5))}
              disabled={startDateOffset === 0}
              className="p-1.5 rounded-md hover:bg-white text-stone-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              title="Earlier dates"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setStartDateOffset(0)}
              className="px-2 py-1 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={() => setStartDateOffset((prev) => prev + 5)}
              className="p-1.5 rounded-md hover:bg-white text-stone-700 cursor-pointer"
              title="Later dates"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-600 mb-4 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
        <span className="font-bold text-stone-800 text-[11px] uppercase tracking-wider">Status:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
          <span>Available (Click to Book)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200" />
          <span>Reserved (Pending/Paid)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-blue-200" />
          <span>Guest Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500 ring-2 ring-purple-200" />
          <span>Housekeeping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-stone-400" />
          <span>Maintenance</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto border border-stone-200 rounded-xl shadow-xs">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-stone-100 text-stone-700 text-xs uppercase font-bold tracking-wider">
              <th className="p-3 border-b border-r border-stone-200 sticky left-0 bg-stone-100 z-10 w-48">
                Room / Category
              </th>
              {dates.map((d) => (
                <th
                  key={d.dateStr}
                  className={`p-2.5 text-center border-b border-stone-200 min-w-[70px] ${
                    d.isToday ? 'bg-amber-100/70 text-amber-900 font-extrabold' : ''
                  }`}
                >
                  <div className="text-[10px] text-stone-500 font-semibold">{d.displayDay}</div>
                  <div className="text-xs font-bold">{d.displayDate}</div>
                  {d.isToday && (
                    <span className="inline-block mt-0.5 text-[9px] uppercase px-1 rounded-sm bg-amber-600 text-white">
                      Today
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 text-xs">
            {filteredRooms.map((room) => (
              <tr key={room.id} className="hover:bg-stone-50/70 transition-colors">
                {/* Room column */}
                <td className="p-3 border-r border-stone-200 sticky left-0 bg-white z-10 shadow-xs">
                  <div className="font-bold text-stone-900 text-sm">{room.name}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <span className="font-semibold text-amber-800">#{room.roomNumber}</span>
                    <span>•</span>
                    <span>{currency === 'PKR' ? `Rs. ${room.pricePKR.toLocaleString()}` : `$${room.priceUSD}`}</span>
                  </div>
                </td>

                {/* Day cells */}
                {dates.map((d) => {
                  const info = getDayStatusForRoom(room, d.dateStr);
                  const isAvailable = info.status === 'available';

                  return (
                    <td
                      key={d.dateStr}
                      className={`p-1.5 text-center border-r border-stone-100 last:border-r-0 ${
                        d.isToday ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {isAvailable ? (
                        <button
                          onClick={() => onSelectRoomAndDate(room, d.dateStr)}
                          className="w-full py-2.5 px-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-[11px] flex flex-col items-center justify-center gap-0.5 cursor-pointer group transition-all"
                          title={`Book ${room.name} for ${d.dateStr}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px]">Open</span>
                        </button>
                      ) : info.status === 'occupied' ? (
                        <div
                          className="w-full py-2.5 px-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[10px] flex flex-col items-center justify-center"
                          title={info.booking ? `Occupied: ${info.booking.guestName} (${info.booking.id})` : 'Occupied'}
                        >
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>In-Stay</span>
                        </div>
                      ) : info.status === 'reserved' ? (
                        <div
                          className="w-full py-2.5 px-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 font-semibold text-[10px] flex flex-col items-center justify-center"
                          title={info.booking ? `Reserved: ${info.booking.guestName} (${info.booking.id})` : 'Reserved'}
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Booked</span>
                        </div>
                      ) : info.status === 'cleaning' ? (
                        <div
                          className="w-full py-2.5 px-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-semibold text-[10px] flex flex-col items-center justify-center"
                          title="Undergoing thorough housekeeping"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>Cleaning</span>
                        </div>
                      ) : (
                        <div
                          className="w-full py-2.5 px-1 rounded-lg bg-stone-100 text-stone-600 border border-stone-300 font-semibold text-[10px] flex flex-col items-center justify-center"
                          title="Under Maintenance"
                        >
                          <Wrench className="w-3.5 h-3.5 text-stone-500" />
                          <span>Repair</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
        <p>💡 Tip: For large corporate delegations or full villa rentals, contact Front Desk directly.</p>
        <span className="font-semibold text-stone-700">+92 342 8332015</span>
      </div>
    </div>
  );
};
