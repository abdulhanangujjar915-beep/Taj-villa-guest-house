import React from 'react';
import { MapPin, Navigation, Phone, MessageCircle, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { VILLA_DETAILS } from '../data/roomsData';

export const LocationSection: React.FC = () => {
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'House 14 Sumbal Rd F-10 Islamabad Pakistan'
  )}`;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-8 shadow-xs">
      <div className="max-w-3xl mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Prime Islamabad Location</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Where to Find Taj Villa Guest House
        </h2>
        <p className="text-stone-600 text-sm mt-1">
          Situated on the quiet, tree-lined Sumbal Road in sector F-10 Islamabad, moments away from F-10 Markaz dining and shopping.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Address & Contact Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Physical Address</span>
              <div className="font-bold text-stone-900 text-sm mt-0.5">
                {VILLA_DETAILS.address}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Google Plus Code: {VILLA_DETAILS.plusCode}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <Phone className="w-4 h-4 text-amber-800 shrink-0" />
                <span className="font-semibold">Hotline:</span>
                <a href={`tel:${VILLA_DETAILS.phoneRaw}`} className="hover:text-amber-900 font-bold">
                  {VILLA_DETAILS.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">WhatsApp:</span>
                <a
                  href={VILLA_DETAILS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-bold"
                >
                  Chat 24/7 Available
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Check-in: 2:00 PM | Check-out: 12:00 PM</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200">
              <a
                href={googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions in Google Maps</span>
                <ExternalLink className="w-3 h-3 text-amber-300" />
              </a>
            </div>
          </div>

          {/* Proximity landmarks */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Proximity & Travel Times
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {VILLA_DETAILS.nearbyLandmarks.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-white border border-stone-200 shadow-2xs flex items-center justify-between"
                >
                  <span className="text-stone-800 font-medium truncate pr-2">{item.name}</span>
                  <span className="text-[11px] font-bold text-amber-800 shrink-0">{item.distance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Map Preview */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl overflow-hidden border border-stone-300 shadow-md bg-stone-100 aspect-16/10 sm:aspect-16/9">
            {/* Embedded OpenStreetMap / Google Maps iframe */}
            <iframe
              title="Taj Villa Guest House Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=33.6925,73.0035&hl=en&z=15&output=embed"
            />

            {/* Overlay card pointing to location */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-stone-200/80 max-w-xs pointer-events-none">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                Taj Villa Guest House
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                House #14, Sumbal Rd, F-10, Islamabad
              </p>
              <div className="text-[10px] text-emerald-700 font-bold mt-1">
                Plus Code: M2V6+JR Islamabad
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
