import React, { useState } from 'react';
import { X, Calendar, User, Phone, Mail, CreditCard, ShieldCheck, CheckCircle2, Copy, MessageCircle, Printer, ArrowRight, ArrowLeft, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Room, Booking, PaymentMethod } from '../types';
import { VILLA_DETAILS } from '../data/roomsData';
import { calculateNights, generateBookingId } from '../utils/storage';
import { playNotificationSound, triggerBrowserNotification } from '../utils/audio';

interface BookingModalProps {
  room: Room | null;
  initialDate?: string;
  currency: 'PKR' | 'USD';
  onClose: () => void;
  onBookingConfirmed: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  initialDate,
  currency,
  onClose,
  onBookingConfirmed,
}) => {
  if (!room) return null;

  const today = new Date().toISOString().split('T')[0];
  const defaultCheckIn = initialDate || today;
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');

  // Form State
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('+92 ');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestCity, setGuestCity] = useState('Islamabad');
  const [guestCnic, setGuestCnic] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('jazzcash');
  const [transactionId, setTransactionId] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const nights = calculateNights(checkIn, checkOut);
  const totalPKR = room.pricePKR * nights;
  const totalUSD = room.priceUSD * nights;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim() || guestPhone.length < 8) {
      alert('Please enter your full name and valid phone/WhatsApp number.');
      return;
    }
    setStep('payment');
  };

  const handleCompleteBooking = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const newBookingId = generateBookingId();
      const newBooking: Booking = {
        id: newBookingId,
        guestName,
        guestEmail: guestEmail || 'guest@tajvilla.com',
        guestPhone,
        guestCity,
        guestCnicOrPassport: guestCnic,
        roomId: room.id,
        roomName: room.name,
        roomNumber: room.roomNumber,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights,
        adults,
        children,
        totalPKR,
        totalUSD,
        paymentMethod,
        paymentStatus: paymentMethod === 'pay_on_arrival' ? 'pending' : 'verified',
        transactionId: transactionId || (paymentMethod === 'card' ? `CC-${Date.now().toString().slice(-6)}` : undefined),
        specialRequests,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      setConfirmedBooking(newBooking);
      onBookingConfirmed(newBooking);
      setIsProcessing(false);
      setStep('confirmed');

      // Trigger celebratory chime & confetti
      playNotificationSound();
      triggerBrowserNotification(
        'Taj Villa Reservation Confirmed!',
        `Booking ${newBooking.id} for ${newBooking.roomName} confirmed. Welcome to House #14, F-10 Islamabad!`
      );

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#b45309', '#d97706', '#10b981', '#059669'],
        });
      } catch (err) {
        // Safe fallback
      }
    }, 1000);
  };

  const getWhatsAppMessage = () => {
    if (!confirmedBooking) return '';
    const text = `*New Reservation - Taj Villa Guest House Islamabad*
Booking ID: *${confirmedBooking.id}*
Guest Name: ${confirmedBooking.guestName}
Phone: ${confirmedBooking.guestPhone}
Room: ${confirmedBooking.roomName} (Room #${confirmedBooking.roomNumber})
Check-In: ${confirmedBooking.checkInDate} (From 2:00 PM)
Check-Out: ${confirmedBooking.checkOutDate} (Until 12:00 PM)
Nights: ${confirmedBooking.nights} Night(s)
Guests: ${confirmedBooking.adults} Adults${confirmedBooking.children > 0 ? `, ${confirmedBooking.children} Children` : ''}
Total Amount: PKR ${confirmedBooking.totalPKR.toLocaleString()}
Payment Method: ${confirmedBooking.paymentMethod.toUpperCase()} ${confirmedBooking.transactionId ? `(TID: ${confirmedBooking.transactionId})` : ''}
Location: House #14, Sumbal Rd, F-10 Islamabad (Plus Code: M2V6+JR)`;

    return `https://wa.me/923428332015?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-700 text-amber-200 flex items-center justify-center font-serif font-bold text-lg">
              TV
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold leading-tight">
                {step === 'confirmed' ? 'Reservation Confirmed!' : `Book ${room.name}`}
              </h2>
              <p className="text-xs text-stone-300">
                Taj Villa Guest House • House #14, Sumbal Rd, F-10 Islamabad
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-stone-50 px-6 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step === 'details' ? 'text-amber-800' : 'text-stone-400'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-amber-800 text-white text-[11px]">
              1
            </span>
            <span>Stay & Guest Details</span>
          </div>
          <div className="w-8 h-px bg-stone-300" />
          <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-amber-800' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 'payment' ? 'bg-amber-800 text-white' : 'bg-stone-200 text-stone-600'}`}>
              2
            </span>
            <span>Secure Payment</span>
          </div>
          <div className="w-8 h-px bg-stone-300" />
          <div className={`flex items-center gap-1.5 ${step === 'confirmed' ? 'text-emerald-700' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 'confirmed' ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
              3
            </span>
            <span>Confirmation Voucher</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: STAY & GUEST DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              {/* Room Summary strip */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-14 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-bold text-stone-900 text-sm">{room.name}</h4>
                    <span className="text-xs font-extrabold text-amber-900">
                      {currency === 'PKR' ? `PKR ${room.pricePKR.toLocaleString()}` : `$${room.priceUSD}`}/night
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Room #{room.roomNumber} • {room.bedType} • {room.floor}
                  </p>
                </div>
              </div>

              {/* Date pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-800" />
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-sm font-semibold text-stone-800"
                  />
                  <span className="text-[10px] text-stone-500">Check-in: 2:00 PM</span>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-800" />
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-sm font-semibold text-stone-800"
                  />
                  <span className="text-[10px] text-stone-500">Check-out: 12:00 PM</span>
                </div>
              </div>

              {/* Capacity Counters */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Adults (Age 12+)</label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm bg-white"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} Adult{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Children (0-11 yrs)</label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm bg-white"
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n} Children
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guest Personal Info */}
              <div className="pt-2 border-t border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">Guest Contact Information</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Muhammad Bilal"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:border-amber-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      WhatsApp / Mobile <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        placeholder="+92 3XX XXXXXXX"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:border-amber-600 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        placeholder="guest@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:border-amber-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">City / Country of Residence</label>
                    <input
                      type="text"
                      placeholder="e.g. Islamabad, Lahore, London"
                      value={guestCity}
                      onChange={(e) => setGuestCity(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:border-amber-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    CNIC / Passport Number (For Hotel Register Verification)
                  </label>
                  <input
                    type="text"
                    placeholder="XXXXX-XXXXXXX-X or Passport #"
                    value={guestCnic}
                    onChange={(e) => setGuestCnic(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:border-amber-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Special Requests or Arrival Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Late check-in, extra bed, quiet room, airport pickup assistance..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Price Calculation Footer */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Room rate:</span>
                  <span>PKR {room.pricePKR.toLocaleString()} x {nights} night(s)</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Complimentary Breakfast & Wi-Fi:</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Power Backup / Generator:</span>
                  <span className="text-emerald-600 font-semibold">INCLUDED</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold text-sm text-stone-900">
                  <span>Total Payable:</span>
                  <span className="text-base font-extrabold text-amber-900">
                    PKR {totalPKR.toLocaleString()} <span className="text-xs text-stone-500 font-normal">(${totalUSD})</span>
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 active:bg-amber-950 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Continue to Secure Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: SECURE PAYMENT */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <button
                  onClick={() => setStep('details')}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to details
                </button>
                <div className="text-right">
                  <span className="text-xs text-stone-500">Amount Due: </span>
                  <span className="font-extrabold text-amber-900 text-sm">
                    PKR {totalPKR.toLocaleString()} (${totalUSD})
                  </span>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('jazzcash')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'jazzcash'
                      ? 'border-red-600 bg-red-50/80 ring-2 ring-red-200'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold text-xs text-red-700 flex items-center justify-between">
                    <span>JazzCash</span>
                    <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-sm">Instant</span>
                  </div>
                  <div className="text-[11px] text-stone-600 mt-1">Mobile Account / QR</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('easypaisa')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'easypaisa'
                      ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-200'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold text-xs text-emerald-700 flex items-center justify-between">
                    <span>Easypaisa</span>
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-sm">Instant</span>
                  </div>
                  <div className="text-[11px] text-stone-600 mt-1">Wallet & QR Code</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_raast')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'bank_raast'
                      ? 'border-amber-700 bg-amber-50/80 ring-2 ring-amber-200'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold text-xs text-amber-800">Raast / Bank</div>
                  <div className="text-[11px] text-stone-600 mt-1">Meezan / HBL IBAN</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-200'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold text-xs text-indigo-700">Credit / Debit Card</div>
                  <div className="text-[11px] text-stone-600 mt-1">Visa & Mastercard</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('pay_on_arrival')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all col-span-2 sm:col-span-1 ${
                    paymentMethod === 'pay_on_arrival'
                      ? 'border-stone-800 bg-stone-100 ring-2 ring-stone-300'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold text-xs text-stone-900">Pay on Arrival</div>
                  <div className="text-[11px] text-stone-600 mt-1">Cash at Front Desk</div>
                </button>
              </div>

              {/* METHOD-SPECIFIC DETAILS */}
              {/* JazzCash & Easypaisa Box */}
              {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">
                        {paymentMethod === 'jazzcash' ? 'JazzCash Account' : 'Easypaisa Account'}
                      </h4>
                      <p className="text-xs text-stone-500">
                        Taj Villa Guest House • Official Payment Number
                      </p>
                    </div>
                    <span className="p-2 bg-white rounded-lg border border-stone-200">
                      <QrCode className="w-5 h-5 text-amber-700" />
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500">Mobile Account Number:</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-stone-900">
                        <span>0342-8332015</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('03428332015', 'phone')}
                          className="text-amber-800 hover:text-amber-900 p-0.5 cursor-pointer"
                          title="Copy account number"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500">Account Title:</span>
                      <span className="font-semibold text-stone-800">Taj Villa Guest House</span>
                    </div>
                    {copiedField === 'phone' && (
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        ✓ Account number copied to clipboard!
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Transaction ID / TID (from SMS or App Receipt) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 08273619284"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono text-stone-900 focus:border-amber-600 focus:outline-hidden"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      You can also send the payment screenshot directly via WhatsApp to +92 342 8332015.
                    </p>
                  </div>
                </div>
              )}

              {/* Raast / Bank Details */}
              {paymentMethod === 'bank_raast' && (
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">Raast Instant Pay & Bank Transfer</h4>
                      <p className="text-xs text-stone-500">1Link Instant Transfer from any Bank App</p>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Raast ID:</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-stone-900">
                        <span>03428332015</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('03428332015', 'raast')}
                          className="text-amber-800 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Bank Name:</span>
                      <span className="font-semibold text-stone-800">Meezan Bank Islamabad</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Account Title:</span>
                      <span className="font-semibold text-stone-800">Taj Villa Hospitality</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">IBAN:</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-stone-900 text-[11px]">
                        <span>PK42MEZN0001020104889201</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('PK42MEZN0001020104889201', 'iban')}
                          className="text-amber-800 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Bank Reference / Transaction ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FT260912..."
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono text-stone-900 focus:border-amber-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Credit / Debit Card Simulator */}
              {paymentMethod === 'card' && (
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">Debit or Credit Card</h4>
                      <p className="text-xs text-stone-500">256-Bit SSL Encrypted Card Processing</p>
                    </div>
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="NAME ON CARD"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="4123 •••• •••• 1234"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm font-mono text-stone-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">Expiry MM/YY</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm font-mono text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm font-mono text-stone-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pay on Arrival Info */}
              {paymentMethod === 'pay_on_arrival' && (
                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 space-y-2">
                  <h4 className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-800" />
                    Pay at Villa Front Desk on Arrival
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Your room reservation will be held in our system. You can settle payment in PKR Cash or Card upon arrival at House #14, Sumbal Rd, F-10 Islamabad.
                  </p>
                  <p className="text-[11px] text-amber-900 font-medium">
                    Note: For peak dates, management may request a nominal advance confirmation token.
                  </p>
                </div>
              )}

              {/* Confirm & Process Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCompleteBooking}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirming Reservation...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'pay_on_arrival'
                        ? 'Confirm Booking (Pay Later)'
                        : `Complete Payment (PKR ${totalPKR.toLocaleString()})`}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: CONFIRMED VOUCHER */}
          {step === 'confirmed' && confirmedBooking && (
            <div className="space-y-4">
              {/* Success Banner */}
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Booking Confirmed!
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  We look forward to welcoming you to Taj Villa Guest House Islamabad.
                </p>
              </div>

              {/* Digital Hotel Voucher Card */}
              <div
                id="booking-voucher"
                className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-300/80 shadow-xs space-y-3 font-sans"
              >
                {/* Voucher Top */}
                <div className="flex items-start justify-between pb-3 border-b border-stone-200">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800">
                      OFFICIAL RESERVATION PASS
                    </span>
                    <div className="font-serif text-lg font-bold text-stone-900">
                      Taj Villa Guest House
                    </div>
                    <p className="text-[11px] text-stone-500">
                      House #14, Sumbal Rd, F-10, Islamabad (M2V6+JR)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400">Booking Ref</span>
                    <div className="font-mono text-base font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300/80">
                      {confirmedBooking.id}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-semibold">Guest Name</span>
                    <div className="font-bold text-stone-900">{confirmedBooking.guestName}</div>
                    <div className="text-[11px] text-stone-500">{confirmedBooking.guestPhone}</div>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-semibold">Reserved Room</span>
                    <div className="font-bold text-stone-900">{confirmedBooking.roomName}</div>
                    <div className="text-[11px] text-amber-900 font-semibold">Room #{confirmedBooking.roomNumber}</div>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-semibold">Check-In</span>
                    <div className="font-bold text-stone-900">{confirmedBooking.checkInDate}</div>
                    <div className="text-[11px] text-stone-500">From 2:00 PM</div>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-semibold">Check-Out</span>
                    <div className="font-bold text-stone-900">{confirmedBooking.checkOutDate}</div>
                    <div className="text-[11px] text-stone-500">Until 12:00 PM</div>
                  </div>
                </div>

                {/* Payment summary */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-semibold">Payment Status</span>
                    <div className="font-bold text-emerald-700 capitalize flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {confirmedBooking.paymentMethod.replace('_', ' ').toUpperCase()} • {confirmedBooking.paymentStatus}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-400 text-[10px] uppercase font-semibold">Total Amount</span>
                    <div className="font-extrabold text-amber-900 text-sm">
                      PKR {confirmedBooking.totalPKR.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <a
                  href={getWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Confirmation to Villa WhatsApp</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Voucher</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={onClose}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  Close & Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
