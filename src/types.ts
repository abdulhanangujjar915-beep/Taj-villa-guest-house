export type RoomCategory = 'executive' | 'deluxe' | 'royal' | 'family' | 'classic';

export type RoomStatus = 'available' | 'reserved' | 'occupied' | 'cleaning' | 'maintenance';

export interface Room {
  id: string;
  roomNumber: string;
  name: string;
  category: RoomCategory;
  floor: string;
  pricePKR: number;
  priceUSD: number;
  capacity: {
    adults: number;
    children: number;
  };
  bedType: string;
  sizeSqFt: number;
  images: string[];
  description: string;
  status: RoomStatus;
  amenities: string[];
  features: string[];
}

export type PaymentMethod = 'jazzcash' | 'easypaisa' | 'bank_raast' | 'card' | 'pay_on_arrival';

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCnicOrPassport?: string;
  guestCity?: string;
  roomId: string;
  roomName: string;
  roomNumber: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nights: number;
  adults: number;
  children: number;
  totalPKR: number;
  totalUSD: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'verified';
  transactionId?: string;
  specialRequests?: string;
  status: BookingStatus;
  createdAt: string; // ISO string
  notes?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'status_change' | 'payment' | 'admin';
  bookingId?: string;
}

export interface SearchFilter {
  checkIn: string;
  checkOut: string;
  guests: number;
  category: string;
}
