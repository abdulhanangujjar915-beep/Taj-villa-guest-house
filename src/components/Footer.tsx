import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, ShieldCheck, Clock, Heart } from 'lucide-react';
import { VILLA_DETAILS } from '../data/roomsData';

interface FooterProps {
  onOpenLookup: () => void;
  onOpenAdminAuth: () => void;
  setActiveTab: (tab: 'explore' | 'availability' | 'gallery' | 'location' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLookup,
  onOpenAdminAuth,
  setActiveTab,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-24 md:pb-12 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          {/* Brand & Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-700 text-amber-200 flex items-center justify-center font-serif font-bold text-base">
                TV
              </div>
              <span className="font-serif text-lg font-bold text-white">Taj Villa Guest House</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Premier luxury villa retreat offering private guest rooms, artisan ceilings, and unmatched hospitality in the peaceful residential heart of Islamabad F-10.
            </p>
            <div className="text-xs text-stone-300 space-y-1">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{VILLA_DETAILS.address}</span>
              </div>
              <div className="text-emerald-400 font-mono text-[11px] pl-5">
                Plus Code: {VILLA_DETAILS.plusCode}
              </div>
            </div>
          </div>

          {/* Quick Contact & Direct Booking */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Direct Contact & Concierge
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${VILLA_DETAILS.phoneRaw}`} className="hover:text-white font-bold">
                  {VILLA_DETAILS.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href={VILLA_DETAILS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 font-semibold"
                >
                  WhatsApp: +92 342 8332015
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{VILLA_DETAILS.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Front Desk: 24 Hours Open</span>
              </div>
            </div>
          </div>

          {/* Guest Policies & Amenities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Villa Amenities & Policies
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>• Check-in: 2:00 PM | Check-out: 12:00 PM</li>
              <li>• Complimentary Breakfast Included</li>
              <li>• 24/7 Generator & Solar Power Backup</li>
              <li>• High-Speed Wi-Fi in all Rooms</li>
              <li>• En-suite Hot Bathrooms & Daily Cleaning</li>
              <li>• Valid CNIC or Passport required at Check-In</li>
            </ul>
          </div>

          {/* Accepted Payments & Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Secure Payment Options
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <span className="p-1.5 rounded-md bg-stone-800 text-stone-200 border border-stone-700 text-center">
                JazzCash
              </span>
              <span className="p-1.5 rounded-md bg-stone-800 text-stone-200 border border-stone-700 text-center">
                Easypaisa
              </span>
              <span className="p-1.5 rounded-md bg-stone-800 text-stone-200 border border-stone-700 text-center">
                Raast Instant
              </span>
              <span className="p-1.5 rounded-md bg-stone-800 text-stone-200 border border-stone-700 text-center">
                Visa / Mastercard
              </span>
              <span className="p-1.5 rounded-md bg-stone-800 text-stone-200 border border-stone-700 text-center col-span-2">
                Cash at Front Desk
              </span>
            </div>

            <div className="pt-2 flex flex-col gap-1.5">
              <button
                onClick={onOpenLookup}
                className="text-amber-300 hover:text-amber-200 text-left font-semibold cursor-pointer"
              >
                &rarr; Check Existing Reservation Pass
              </button>
              <button
                onClick={onOpenAdminAuth}
                className="text-stone-400 hover:text-stone-200 text-left cursor-pointer"
              >
                &rarr; Staff & Management Portal Login
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-xs">
          <div>
            &copy; {new Date().getFullYear()} Taj Villa Guest House Islamabad. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">House #14, Sumbal Rd, F-10 Islamabad</span>
            <span>•</span>
            <span className="text-emerald-400">Official Mobile App & Web Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
