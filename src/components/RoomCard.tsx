import React, { useState } from 'react';
import { Users, Bed, Check, ShieldCheck, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { Room } from '../types';

interface RoomCardProps {
  room: Room;
  currency: 'PKR' | 'USD';
  isAvailableForDates: boolean;
  onBook: (room: Room) => void;
  onViewDetails: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  currency,
  isAvailableForDates,
  onBook,
  onViewDetails,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const formatPrice = (pkr: number, usd: number) => {
    if (currency === 'PKR') {
      return `PKR ${pkr.toLocaleString()}`;
    }
    return `$${usd}`;
  };

  const getStatusBadge = () => {
    if (!isAvailableForDates) {
      return (
        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
          Reserved for Dates
        </span>
      );
    }
    switch (room.status) {
      case 'available':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Available Now
          </span>
        );
      case 'reserved':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Booked / In Use
          </span>
        );
      case 'occupied':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            Guest In Residence
          </span>
        );
      case 'cleaning':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
            Housekeeping
          </span>
        );
      case 'maintenance':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-stone-200 text-stone-700">
            Maintenance
          </span>
        );
    }
  };

  return (
    <div
      id={`room-${room.id}`}
      className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      {/* Image Gallery Header */}
      <div className="relative aspect-16/10 bg-stone-100 overflow-hidden group">
        <img
          src={room.images[selectedImageIndex] || room.images[0]}
          alt={`${room.name} - Taj Villa Guest House Islamabad`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
        />

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">{getStatusBadge()}</div>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs">
            Room #{room.roomNumber} • {room.floor}
          </span>
        </div>

        {/* Thumbnail switcher if multiple images */}
        {room.images.length > 1 && (
          <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1.5 overflow-x-auto py-1">
            {room.images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(idx);
                }}
                className={`w-9 h-7 rounded-md overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  selectedImageIndex === idx ? 'border-amber-500 scale-105' : 'border-white/60 opacity-80'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Price Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900 leading-snug">
                {room.name}
              </h3>
              <p className="text-xs text-stone-500">{room.floor}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-lg font-extrabold text-amber-900">
                {formatPrice(room.pricePKR, room.priceUSD)}
              </div>
              <div className="text-[11px] text-stone-400 font-medium">per night • incl. taxes</div>
            </div>
          </div>

          {/* Quick specs */}
          <div className="flex flex-wrap items-center gap-3 py-2 border-y border-stone-100 text-xs text-stone-600 mb-3">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              Up to {room.capacity.adults} Adults
              {room.capacity.children > 0 && `, ${room.capacity.children} Child`}
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-stone-400" />
              {room.bedType}
            </span>
            <span className="text-stone-300">•</span>
            <span>{room.sizeSqFt} sq.ft</span>
          </div>

          {/* Description */}
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
            {room.description}
          </p>

          {/* Highlight features */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {room.features.map((feat, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200/60"
              >
                {feat}
              </span>
            ))}
          </div>

          {/* Key Amenities preview */}
          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-stone-500 mb-5">
            {room.amenities.slice(0, 4).map((amenity, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
          <button
            onClick={() => onViewDetails(room)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Details
          </button>
          <button
            onClick={() => onBook(room)}
            disabled={!isAvailableForDates}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isAvailableForDates
                ? 'bg-amber-800 hover:bg-amber-900 text-white shadow-xs hover:shadow-md'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>{isAvailableForDates ? 'Book Room' : 'Unavailable for Dates'}</span>
            {isAvailableForDates && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
