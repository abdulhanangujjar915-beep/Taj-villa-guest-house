import React from 'react';
import { Calendar, Users, Search, Phone, MapPin, ShieldCheck, Zap, Wifi, Coffee, Star } from 'lucide-react';
import { TAJ_VILLA_IMAGES, VILLA_DETAILS } from '../data/roomsData';
import { SearchFilter } from '../types';

interface HeroProps {
  filter: SearchFilter;
  setFilter: React.Dispatch<React.SetStateAction<SearchFilter>>;
  onSearch: () => void;
  onOpenBooking: () => void;
  onGoToAvailability: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  filter,
  setFilter,
  onSearch,
  onOpenBooking,
  onGoToAvailability,
}) => {
  return (
    <section className="relative bg-stone-900 text-white overflow-hidden">
      {/* Background Image with warm overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={TAJ_VILLA_IMAGES.exterior}
          alt="Taj Villa Guest House Islamabad Exterior"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/80 to-stone-900/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            Premier Boutique Guest House
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-stone-200 border border-white/15 backdrop-blur-xs">
            <MapPin className="w-3 h-3 text-emerald-400" />
            F-10/2 & F-10/3 Islamabad
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" />
            Verified & Gated Security
          </span>
        </div>

        {/* Hero Title & Text */}
        <div className="max-w-3xl mb-8">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-4">
            Taj Villa <span className="text-amber-400 italic">Guest House</span>
          </h1>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed mb-3">
            Experience serene luxury at our private villa residence. Arched Mediterranean colonnades, artisan coffered ceilings, modern ensuite rooms, and warm Pakistani hospitality in Islamabad&apos;s prime F-10 sector.
          </p>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-200/90 font-medium">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>House #14, Sumbal Rd, F-10, Islamabad, Pakistan</span>
            <span className="text-stone-500">•</span>
            <span className="text-emerald-400">Plus Code: M2V6+JR</span>
          </div>
        </div>

        {/* Key Amenities Micro Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mb-8 text-xs text-stone-300">
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 backdrop-blur-xs">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>24/7 Generator & Solar Power</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 backdrop-blur-xs">
            <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>High-Speed Wi-Fi</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 backdrop-blur-xs">
            <Coffee className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Complimentary Breakfast</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 backdrop-blur-xs">
            <Phone className="w-4 h-4 text-sky-400 shrink-0" />
            <span>+92 342 8332015</span>
          </div>
        </div>

        {/* Quick Booking & Availability Search Widget */}
        <div className="bg-white text-stone-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-stone-200/80 max-w-4xl">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center justify-between">
            <span>Check Room Availability & Instant Rates</span>
            <span className="text-emerald-600 font-semibold lowercase">Instant confirmation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Check-In Date */}
            <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                Check-In Date
              </label>
              <input
                type="date"
                value={filter.checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFilter((prev) => ({ ...prev, checkIn: e.target.value }))}
                className="w-full bg-transparent text-sm font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
              />
            </div>

            {/* Check-Out Date */}
            <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                Check-Out Date
              </label>
              <input
                type="date"
                value={filter.checkOut}
                min={filter.checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => setFilter((prev) => ({ ...prev, checkOut: e.target.value }))}
                className="w-full bg-transparent text-sm font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
              />
            </div>

            {/* Guests & Category */}
            <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-700" />
                Guests & Room
              </label>
              <select
                value={filter.category}
                onChange={(e) => setFilter((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full bg-transparent text-sm font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Room Types</option>
                <option value="royal">Royal Heritage Suite</option>
                <option value="deluxe">Deluxe Master</option>
                <option value="executive">Executive Balcony</option>
                <option value="family">Family Interconnected</option>
                <option value="classic">Classic Comfort</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onSearch}
                className="flex-1 h-full min-h-[46px] bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Find Rooms
              </button>
            </div>
          </div>

          {/* Quick links below search */}
          <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={onGoToAvailability}
                className="text-amber-800 hover:text-amber-900 font-semibold underline underline-offset-2 cursor-pointer"
              >
                View Full Room Calendar Matrix &rarr;
              </button>
              <span>•</span>
              <a
                href={VILLA_DETAILS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                Instant WhatsApp Booking
              </a>
            </div>
            <div className="text-stone-400">
              JazzCash, Easypaisa, Raast & Cards Accepted
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
