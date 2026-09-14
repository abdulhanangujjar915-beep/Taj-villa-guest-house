import React from 'react';
import { Home, CalendarCheck, MapPin, Shield, MessageCircle, BedDouble } from 'lucide-react';
import { VILLA_DETAILS } from '../data/roomsData';

interface BottomMobileNavProps {
  activeTab: 'explore' | 'availability' | 'gallery' | 'location' | 'admin';
  setActiveTab: (tab: 'explore' | 'availability' | 'gallery' | 'location' | 'admin') => void;
  onOpenQuickBooking: () => void;
  isAdmin: boolean;
  onOpenAdminAuth: () => void;
}

export const BottomMobileNav: React.FC<BottomMobileNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickBooking,
  isAdmin,
  onOpenAdminAuth,
}) => {
  return (
    <>
      {/* Floating WhatsApp Action Button */}
      <aside aria-label="Quick contact" className="fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6">
        <a
          href={VILLA_DETAILS.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 group"
          title="Chat with Taj Villa Front Desk on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 shrink-0" />
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            Book via WhatsApp
          </span>
        </a>
      </aside>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile screens) */}
      <nav aria-label="Mobile Navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 flex items-center justify-around md:hidden shadow-lg">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg cursor-pointer transition-colors ${
            activeTab === 'explore' ? 'text-amber-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Rooms</span>
        </button>

        <button
          onClick={() => setActiveTab('availability')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg cursor-pointer transition-colors ${
            activeTab === 'availability' ? 'text-amber-800 font-bold' : 'text-stone-500'
          }`}
        >
          <CalendarCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Calendar</span>
        </button>

        {/* Central Prominent "Book Now" Button */}
        <button
          onClick={onOpenQuickBooking}
          className="flex flex-col items-center justify-center -mt-5 bg-amber-800 text-white w-12 h-12 rounded-full shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-transform"
        >
          <BedDouble className="w-5 h-5" />
          <span className="text-[9px] font-extrabold uppercase">Book</span>
        </button>

        <button
          onClick={() => setActiveTab('location')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg cursor-pointer transition-colors ${
            activeTab === 'location' ? 'text-amber-800 font-bold' : 'text-stone-500'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Location</span>
        </button>

        <button
          onClick={() => {
            if (isAdmin) {
              setActiveTab('admin');
            } else {
              onOpenAdminAuth();
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg cursor-pointer transition-colors ${
            activeTab === 'admin' ? 'text-amber-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Staff</span>
        </button>
      </nav>
    </>
  );
};
