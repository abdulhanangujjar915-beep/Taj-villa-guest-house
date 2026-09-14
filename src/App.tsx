import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RoomCard } from './components/RoomCard';
import { AvailabilityTracker } from './components/AvailabilityTracker';
import { GallerySection } from './components/GallerySection';
import { LocationSection } from './components/LocationSection';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingModal } from './components/BookingModal';
import { RoomDetailModal } from './components/RoomDetailModal';
import { NotificationCenter } from './components/NotificationCenter';
import { BookingLookupModal } from './components/BookingLookupModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { BottomMobileNav } from './components/BottomMobileNav';
import { Footer } from './components/Footer';

import { Room, Booking, AppNotification, RoomStatus, BookingStatus, SearchFilter } from './types';
import {
  loadRooms,
  saveRooms,
  loadBookings,
  saveBookings,
  loadNotifications,
  saveNotifications,
  isRoomAvailable,
} from './utils/storage';
import { playNotificationSound } from './utils/audio';
import { Filter, Calendar, Sparkles, Check, Phone, MessageCircle } from 'lucide-react';
import { VILLA_DETAILS } from './data/roomsData';

export default function App() {
  // Global State
  const [rooms, setRooms] = useState<Room[]>(loadRooms);
  const [bookings, setBookings] = useState<Booking[]>(loadBookings);
  const [notifications, setNotifications] = useState<AppNotification[]>(loadNotifications);

  const [activeTab, setActiveTab] = useState<'explore' | 'availability' | 'gallery' | 'location' | 'admin'>('explore');
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR');
  const [isAdmin, setIsAdmin] = useState(false);

  // Search & Filter State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [filter, setFilter] = useState<SearchFilter>({
    checkIn: todayStr,
    checkOut: tomorrowStr,
    guests: 2,
    category: 'all',
  });

  // Modals State
  const [bookingModalRoom, setBookingModalRoom] = useState<Room | null>(null);
  const [bookingInitialDate, setBookingInitialDate] = useState<string | undefined>(undefined);
  const [detailModalRoom, setDetailModalRoom] = useState<Room | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveRooms(rooms);
  }, [rooms]);

  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // Handlers
  const handleAddNewBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Update room status
    setRooms((prev) =>
      prev.map((r) => (r.id === newBooking.roomId ? { ...r, status: 'reserved' } : r))
    );

    // Dispatch notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Guest Reservation',
      message: `Reservation ${newBooking.id} received for ${newBooking.roomName} (${newBooking.guestName}). Total PKR ${newBooking.totalPKR.toLocaleString()}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'booking',
      bookingId: newBooking.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateRoomStatus = (roomId: string, status: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status } : r))
    );
  };

  const handleUpdateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const handleAddNotification = (notif: Omit<AppNotification, 'id' | 'timestamp'>) => {
    const fullNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [fullNotif, ...prev]);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Filtered rooms based on selected category
  const displayedRooms = rooms.filter((r) => {
    if (filter.category !== 'all' && r.category !== filter.category) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased selection:bg-amber-200 selection:text-amber-900">
      {/* Primary Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        notifications={notifications}
        setIsNotificationOpen={setIsNotificationOpen}
        onOpenLookup={() => setIsLookupOpen(true)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'admin' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminDashboard
              rooms={rooms}
              bookings={bookings}
              currency={currency}
              onUpdateRoomStatus={handleUpdateRoomStatus}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onAddNewBooking={handleAddNewBooking}
              onAddNotification={handleAddNotification}
            />
          </div>
        ) : (
          <>
            {/* Hero Banner with Search Bar */}
            <Hero
              filter={filter}
              setFilter={setFilter}
              onSearch={() => {
                const el = document.getElementById('rooms-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenBooking={() => setBookingModalRoom(rooms[0])}
              onGoToAvailability={() => setActiveTab('availability')}
            />

            {/* In-page navigation tabs for quick jump */}
            <div className="bg-white border-b border-stone-200 sticky top-18 z-30 shadow-2xs">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto py-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('explore')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      activeTab === 'explore'
                        ? 'bg-amber-800 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    All Rooms & Suites
                  </button>
                  <button
                    onClick={() => setActiveTab('availability')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      activeTab === 'availability'
                        ? 'bg-amber-800 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    Availability Calendar
                  </button>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      activeTab === 'gallery'
                        ? 'bg-amber-800 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    Photo Gallery
                  </button>
                  <button
                    onClick={() => setActiveTab('location')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      activeTab === 'location'
                        ? 'bg-amber-800 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    Map & Directions
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500 shrink-0">
                  <span className="font-semibold text-stone-800">
                    {filter.checkIn} &rarr; {filter.checkOut}
                  </span>
                  <button
                    onClick={() => {
                      setFilter({
                        checkIn: todayStr,
                        checkOut: tomorrowStr,
                        guests: 2,
                        category: 'all',
                      });
                    }}
                    className="text-amber-800 hover:underline font-semibold cursor-pointer text-[11px]"
                  >
                    Reset Dates
                  </button>
                </div>
              </div>
            </div>

            {/* Container for active sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
              {/* TAB 1: EXPLORE / ROOMS */}
              {activeTab === 'explore' && (
                <section id="rooms-section" className="space-y-6">
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                        Select Your Suite or Bedroom
                      </h2>
                      <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                        Each room is individually appointed with private en-suite bath, climate control, and generator backup.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: 'all', label: 'All Rooms' },
                        { id: 'royal', label: 'Royal Suite' },
                        { id: 'deluxe', label: 'Deluxe Master' },
                        { id: 'executive', label: 'Executive Balcony' },
                        { id: 'family', label: 'Family Interconnected' },
                        { id: 'classic', label: 'Classic' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setFilter((prev) => ({ ...prev, category: item.id }))}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                            filter.category === item.id
                              ? 'bg-amber-800 text-white shadow-xs'
                              : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Room Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedRooms.map((room) => {
                      const available = isRoomAvailable(room.id, filter.checkIn, filter.checkOut, bookings);
                      return (
                        <RoomCard
                          key={room.id}
                          room={room}
                          currency={currency}
                          isAvailableForDates={available}
                          onBook={(r) => setBookingModalRoom(r)}
                          onViewDetails={(r) => setDetailModalRoom(r)}
                        />
                      );
                    })}
                  </div>

                  {/* Quick Villa Experience Highlights */}
                  <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-stone-800">
                    <div className="max-w-3xl">
                      <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                        The Taj Villa Difference
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1 mb-2">
                        Serene Luxury in F-10 Islamabad
                      </h3>
                      <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6">
                        Unlike busy commercial hotels, Taj Villa Guest House provides an exclusive, tranquil residential ambiance. With an arched Mediterranean colonnade, peaceful tree-shaded veranda, hand-decorated artisan coffered ceilings, and around-the-clock power backup, we ensure comfort for both international travelers and domestic visitors.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div className="border-l-2 border-amber-500 pl-3">
                          <div className="font-bold text-white text-sm">24/7 Power</div>
                          <div className="text-stone-400 text-[11px]">Generator + Solar Inverter</div>
                        </div>
                        <div className="border-l-2 border-emerald-500 pl-3">
                          <div className="font-bold text-white text-sm">Prime F-10</div>
                          <div className="text-stone-400 text-[11px]">House #14, Sumbal Rd</div>
                        </div>
                        <div className="border-l-2 border-amber-400 pl-3">
                          <div className="font-bold text-white text-sm">Breakfast</div>
                          <div className="text-stone-400 text-[11px]">Included Every Morning</div>
                        </div>
                        <div className="border-l-2 border-sky-400 pl-3">
                          <div className="font-bold text-white text-sm">Instant Pay</div>
                          <div className="text-stone-400 text-[11px]">JazzCash, Easypaisa & Cards</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB 2: AVAILABILITY TRACKER */}
              {activeTab === 'availability' && (
                <section>
                  <AvailabilityTracker
                    rooms={rooms}
                    bookings={bookings}
                    currency={currency}
                    onSelectRoomAndDate={(room, date) => {
                      setBookingInitialDate(date);
                      setBookingModalRoom(room);
                    }}
                  />
                </section>
              )}

              {/* TAB 3: GALLERY */}
              {activeTab === 'gallery' && (
                <section>
                  <GallerySection />
                </section>
              )}

              {/* TAB 4: LOCATION */}
              {activeTab === 'location' && (
                <section>
                  <LocationSection />
                </section>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        setActiveTab={setActiveTab}
      />

      {/* Bottom Navigation for Mobile Devices */}
      <BottomMobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickBooking={() => setBookingModalRoom(rooms[0])}
        isAdmin={isAdmin}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
      />

      {/* Booking Process Modal */}
      <BookingModal
        room={bookingModalRoom}
        initialDate={bookingInitialDate}
        currency={currency}
        onClose={() => {
          setBookingModalRoom(null);
          setBookingInitialDate(undefined);
        }}
        onBookingConfirmed={(b) => handleAddNewBooking(b)}
      />

      {/* Room Detail Modal */}
      <RoomDetailModal
        room={detailModalRoom}
        currency={currency}
        onClose={() => setDetailModalRoom(null)}
        onBook={(r) => {
          setDetailModalRoom(null);
          setBookingModalRoom(r);
        }}
      />

      {/* Real-Time Push Notification Drawer */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearNotifications={handleClearNotifications}
      />

      {/* Guest Reservation Search Modal */}
      <BookingLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        bookings={bookings}
      />

      {/* Staff Authentication PIN Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => {
          setIsAdmin(true);
          setActiveTab('admin');
        }}
      />
    </div>
  );
}
