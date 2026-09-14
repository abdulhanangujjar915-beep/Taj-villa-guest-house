import { Booking, Room, AppNotification, RoomStatus } from '../types';
import { INITIAL_ROOMS } from '../data/roomsData';

const ROOMS_KEY = 'taj_villa_rooms_v1';
const BOOKINGS_KEY = 'taj_villa_bookings_v1';
const NOTIFICATIONS_KEY = 'taj_villa_notifications_v1';

// Seed sample active bookings so admin and guests immediately see a live functioning system
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'TJ-7014',
    guestName: 'Hamza Tariq',
    guestEmail: 'hamza.tariq@gmail.com',
    guestPhone: '+92 300 5544321',
    guestCity: 'Lahore',
    roomId: 'room-201',
    roomName: 'Executive Balcony Villa Suite',
    roomNumber: '201',
    checkInDate: getOffsetDateString(0), // Today
    checkOutDate: getOffsetDateString(2),
    nights: 2,
    adults: 2,
    children: 1,
    totalPKR: 29000,
    totalUSD: 104,
    paymentMethod: 'jazzcash',
    paymentStatus: 'verified',
    transactionId: 'JC-883920194',
    specialRequests: 'Late check-in at 8 PM, extra pillow requested.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    notes: 'Guest confirmed via WhatsApp. Room 201 prepared.',
  },
  {
    id: 'TJ-7015',
    guestName: 'Dr. Ayesha Siddiqui',
    guestEmail: 'ayesha.siddiqui@aku.edu',
    guestPhone: '+92 333 9182736',
    guestCity: 'Karachi',
    roomId: 'room-102',
    roomName: 'Deluxe Master Bedroom',
    roomNumber: '102',
    checkInDate: getOffsetDateString(1), // Tomorrow
    checkOutDate: getOffsetDateString(4),
    nights: 3,
    adults: 2,
    children: 0,
    totalPKR: 40500,
    totalUSD: 144,
    paymentMethod: 'bank_raast',
    paymentStatus: 'verified',
    transactionId: 'RAAST-5521094',
    specialRequests: 'Quiet room for academic conference at Islamabad Serena.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Reservation Confirmed',
    message: 'Booking TJ-7014 received for Executive Balcony Suite (Hamza Tariq). Paid via JazzCash.',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    read: false,
    type: 'booking',
    bookingId: 'TJ-7014',
  },
  {
    id: 'notif-2',
    title: 'Room 101 Housekeeping Done',
    message: 'Royal Heritage Suite 101 has been thoroughly cleaned and sanitized. Ready for arrival.',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    read: true,
    type: 'status_change',
  },
];

function getOffsetDateString(dayOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().split('T')[0];
}

export function loadRooms(): Room[] {
  try {
    const raw = localStorage.getItem(ROOMS_KEY);
    if (!raw) {
      localStorage.setItem(ROOMS_KEY, JSON.stringify(INITIAL_ROOMS));
      return INITIAL_ROOMS;
    }
    const parsed: Room[] = JSON.parse(raw);
    // Merge any updated image links from initial rooms in case of schema update
    return parsed.map((r) => {
      const match = INITIAL_ROOMS.find((ir) => ir.id === r.id);
      return match ? { ...r, images: match.images } : r;
    });
  } catch {
    return INITIAL_ROOMS;
  }
}

export function saveRooms(rooms: Room[]): void {
  try {
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  } catch (e) {
    console.error('Error saving rooms:', e);
  }
}

export function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function saveBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Error saving bookings:', e);
  }
}

export function loadNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: AppNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Error saving notifications:', e);
  }
}

export function generateBookingId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `TJ-${num}`;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

export function isRoomAvailable(roomId: string, checkIn: string, checkOut: string, bookings: Booking[]): boolean {
  if (!checkIn || !checkOut) return true;
  const targetStart = new Date(checkIn).getTime();
  const targetEnd = new Date(checkOut).getTime();

  return !bookings.some((b) => {
    if (b.roomId !== roomId || b.status === 'cancelled' || b.status === 'checked_out') {
      return false;
    }
    const bStart = new Date(b.checkInDate).getTime();
    const bEnd = new Date(b.checkOutDate).getTime();
    // Overlap condition: targetStart < bEnd && targetEnd > bStart
    return targetStart < bEnd && targetEnd > bStart;
  });
}
