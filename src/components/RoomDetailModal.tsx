import React, { useState } from 'react';
import { X, Check, Bed, Users, Square, MapPin, ArrowRight, ShieldCheck, Zap, Wifi, Coffee } from 'lucide-react';
import { Room } from '../types';

interface RoomDetailModalProps {
  room: Room | null;
  currency: 'PKR' | 'USD';
  onClose: () => void;
  onBook: (room: Room) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  currency,
  onClose,
  onBook,
}) => {
  if (!room) return null;

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Modal Image Carousel */}
        <div className="relative aspect-16/10 bg-stone-900">
          <img
            src={room.images[activeImgIndex] || room.images[0]}
            alt={room.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Thumbnail row */}
          {room.images.length > 1 && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 overflow-x-auto">
              {room.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImgIndex(i)}
                  className={`w-12 h-9 rounded-md overflow-hidden border-2 cursor-pointer transition-all ${
                    activeImgIndex === i ? 'border-amber-400 scale-105' : 'border-white/60 opacity-70'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Room #{room.roomNumber} • {room.floor}
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                {room.name}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-extrabold text-amber-900">
                {currency === 'PKR' ? `PKR ${room.pricePKR.toLocaleString()}` : `$${room.priceUSD}`}
              </div>
              <div className="text-xs text-stone-400">per night • taxes included</div>
            </div>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-700" />
              <span>{room.capacity.adults} Adults Max</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-amber-700" />
              <span className="truncate">{room.bedType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4 text-amber-700" />
              <span>{room.sizeSqFt} sq. ft</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
              Room Overview
            </h4>
            <p className="text-stone-600 text-sm leading-relaxed">{room.description}</p>
          </div>

          {/* Features Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Distinctive Villa Features
            </h4>
            <div className="flex flex-wrap gap-2">
              {room.features.map((f, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200"
                >
                  ★ {f}
                </span>
              ))}
            </div>
          </div>

          {/* Complete Amenities Checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Room Amenities & Inclusions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
              {room.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Standard Villa Inclusions */}
          <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 space-y-1.5">
            <div className="font-bold text-stone-800">Taj Villa Guest House Guarantees:</div>
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>24/7 Uninterrupted Electricity via Heavy-Duty Generator & Inverter</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>High-Speed Optical Fiber Internet</span>
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="w-3.5 h-3.5 text-amber-700" />
              <span>Complimentary Breakfast served 7:30 AM to 10:30 AM</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>24/7 CCTV & Private Gated Parking on Sumbal Road</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBook(room);
            }}
            className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <span>Proceed to Book Room #{room.roomNumber}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
