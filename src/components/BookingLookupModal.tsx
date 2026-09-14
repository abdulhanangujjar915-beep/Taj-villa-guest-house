import React, { useState } from 'react';
import { X, Search, CheckCircle2, Calendar, Phone, MapPin, Printer, MessageCircle, ShieldCheck } from 'lucide-react';
import { Booking } from '../types';
import { VILLA_DETAILS } from '../data/roomsData';

interface BookingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
}

export const BookingLookupModal: React.FC<BookingLookupModalProps> = ({
  isOpen,
  onClose,
  bookings,
}) => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const clean = query.trim().toLowerCase();
    if (!clean) {
      setResult(null);
      return;
    }
    const found = bookings.find(
      (b) =>
        b.id.toLowerCase() === clean ||
        b.guestPhone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')) ||
        b.guestName.toLowerCase().includes(clean)
    );
    setResult(found || null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-base">Find My Reservation</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700">
              Enter Booking Ref (e.g. TJ-7014) or Phone Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="TJ-XXXX or 03428332015"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 focus:border-amber-700 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                Search
              </button>
            </div>
            <p className="text-[11px] text-stone-400">
              Sample active booking references in system: <span className="font-mono text-amber-900 font-bold">TJ-7014</span> or <span className="font-mono text-amber-900 font-bold">TJ-7015</span>
            </p>
          </form>

          {searched && !result && (
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-center text-xs text-stone-600">
              No reservation found for &quot;{query}&quot;. Please check the booking code or WhatsApp us at {VILLA_DETAILS.phone}.
            </div>
          )}

          {result && (
            <div className="bg-stone-50 border border-amber-200/80 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between pb-2 border-b border-stone-200">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-800">
                    Booking Confirmed
                  </span>
                  <div className="font-bold text-stone-900 text-sm">{result.guestName}</div>
                  <div className="text-xs text-stone-500">{result.roomName} (Room #{result.roomNumber})</div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-sm">
                    {result.id}
                  </span>
                  <div className="text-[10px] text-emerald-700 font-bold capitalize mt-1">
                    Status: {result.status.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-400 text-[10px]">Check-In:</span>
                  <div className="font-semibold">{result.checkInDate} (From 2 PM)</div>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px]">Check-Out:</span>
                  <div className="font-semibold">{result.checkOutDate} (By 12 PM)</div>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px]">Total Amount:</span>
                  <div className="font-bold text-amber-900">PKR {result.totalPKR.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px]">Payment Method:</span>
                  <div className="font-semibold uppercase">{result.paymentMethod.replace('_', ' ')}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                <a
                  href={`https://wa.me/923428332015?text=Hi%20Taj%20Villa,%20I%20have%20inquiry%20regarding%20my%20booking%20${result.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Concierge
                </a>
                <button
                  onClick={() => window.print()}
                  className="text-stone-700 hover:text-stone-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Pass
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
