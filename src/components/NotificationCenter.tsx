import React from 'react';
import { X, Bell, Check, Volume2, CheckCircle2, ShieldAlert, Sparkles, Smartphone } from 'lucide-react';
import { AppNotification } from '../types';
import { playNotificationSound, triggerBrowserNotification } from '../utils/audio';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotifications,
}) => {
  if (!isOpen) return null;

  const handleRequestPushPermission = async () => {
    const granted = await triggerBrowserNotification(
      'Taj Villa Push Alerts Enabled',
      'You will now receive instant push alerts for new room reservations at House #14, F-10 Islamabad.'
    );
    playNotificationSound();
    if (granted) {
      alert('Push Notifications enabled! You will hear a hotel chime and see popups when new reservations arrive.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-200">
        {/* Top bar */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-base">Real-time Push Notifications</h3>
              <p className="text-[11px] text-stone-300">Front Desk & Reservation Feed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Push Notification Banner */}
        <div className="bg-amber-50 p-3 border-b border-amber-200 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-800 shrink-0" />
            <span className="text-stone-700">Enable device push chime alerts</span>
          </div>
          <button
            onClick={handleRequestPushPermission}
            className="px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded-md font-bold text-[11px] cursor-pointer"
          >
            Enable Push
          </button>
        </div>

        {/* Control toolbar */}
        <div className="px-4 py-2 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>{notifications.length} Total Alerts</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onMarkAllAsRead}
              className="text-amber-800 hover:underline cursor-pointer font-semibold"
            >
              Mark all read
            </button>
            <span>•</span>
            <button
              onClick={onClearNotifications}
              className="hover:text-stone-800 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <Bell className="w-10 h-10 stroke-1 mb-2 text-stone-300" />
              <p className="text-sm font-semibold text-stone-600">No new notifications</p>
              <p className="text-xs text-stone-400 mt-1">
                New booking reservations and room status alerts will arrive here in real time.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  n.read
                    ? 'bg-white border-stone-200 text-stone-600'
                    : 'bg-amber-50/60 border-amber-300/80 text-stone-900 shadow-2xs font-medium'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    {!n.read && <span className="w-2 h-2 rounded-full bg-amber-600" />}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-stone-400 shrink-0">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-stone-600 leading-relaxed">{n.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Bottom footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <button
            onClick={() => playNotificationSound()}
            className="flex items-center gap-1 text-amber-800 font-semibold cursor-pointer hover:underline"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Play Notification Tone</span>
          </button>
          <span>Taj Villa Live Server</span>
        </div>
      </div>
    </div>
  );
};
