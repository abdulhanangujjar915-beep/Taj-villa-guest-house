import React from 'react';
import { Phone, MessageCircle, Bell, Shield, CalendarCheck, Home, MapPin, Image as ImageIcon, Search } from 'lucide-react';
import { VILLA_DETAILS } from '../data/roomsData';
import { AppNotification } from '../types';

interface HeaderProps {
  activeTab: 'explore' | 'availability' | 'gallery' | 'location' | 'admin';
  setActiveTab: (tab: 'explore' | 'availability' | 'gallery' | 'location' | 'admin') => void;
  currency: 'PKR' | 'USD';
  setCurrency: (c: 'PKR' | 'USD') => void;
  notifications: AppNotification[];
  setIsNotificationOpen: (open: boolean) => void;
  onOpenLookup: () => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  onOpenAdminAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  notifications,
  setIsNotificationOpen,
  onOpenLookup,
  isAdmin,
  setIsAdmin,
  onOpenAdminAuth,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top micro bar with contact info */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-stone-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              House #14, Sumbal Rd, F-10, Islamabad (Plus Code: M2V6+JR)
            </span>
            <span className="text-stone-400">|</span>
            <a
              href={`tel:${VILLA_DETAILS.phoneRaw}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              {VILLA_DETAILS.phone}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenLookup}
              className="text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Search className="w-3 h-3" />
              Find My Reservation
            </button>
            <span className="text-stone-600">•</span>
            <a
              href={VILLA_DETAILS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Helpdesk
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 text-amber-200 flex items-center justify-center font-serif font-bold text-xl shadow-md border border-amber-600/30 group-hover:scale-105 transition-transform">
              TV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg sm:text-xl text-stone-900 tracking-tight leading-tight">
                  Taj Villa
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 hidden sm:inline-block">
                  Guest House F-10
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Islamabad, Pakistan • 24/7 Front Desk
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'explore'
                  ? 'bg-amber-50 text-amber-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Home className="w-4 h-4 text-amber-700" />
              Rooms & Suites
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'availability'
                  ? 'bg-amber-50 text-amber-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-amber-700" />
              Live Availability
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'gallery'
                  ? 'bg-amber-50 text-amber-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-amber-700" />
              Villa Gallery
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'location'
                  ? 'bg-amber-50 text-amber-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-700" />
              Location & Map
            </button>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency selector */}
            <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
              <button
                onClick={() => setCurrency('PKR')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  currency === 'PKR' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                PKR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                USD
              </button>
            </div>

            {/* Notifications button */}
            <button
              id="notif-btn"
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Notifications & Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* WhatsApp Quick Dial button */}
            <a
              href={VILLA_DETAILS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>

            {/* Admin Switch */}
            <button
              id="admin-nav-btn"
              onClick={() => {
                if (isAdmin) {
                  setActiveTab(activeTab === 'admin' ? 'explore' : 'admin');
                } else {
                  onOpenAdminAuth();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                activeTab === 'admin'
                  ? 'bg-amber-900 text-white border-amber-800 shadow-sm'
                  : isAdmin
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">
                {isAdmin ? (activeTab === 'admin' ? 'Exit Admin' : 'Admin Panel') : 'Staff Login'}
              </span>
              <span className="sm:hidden">Staff</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
