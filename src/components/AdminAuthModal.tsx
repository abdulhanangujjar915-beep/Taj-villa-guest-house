import React, { useState } from 'react';
import { X, Shield, Lock, KeyRound, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1410' || pin === 'admin') {
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  const handleInstantDemo = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif font-bold text-base">Taj Villa Staff Portal</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-stone-600">
            Enter authorized staff PIN code to access House #14 booking registry, room status overrides, and notifications.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Staff Security PIN</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  autoFocus
                  placeholder="PIN Code (Default: 1410)"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError(false);
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-sm font-mono tracking-widest text-stone-900 focus:border-amber-700 focus:outline-hidden"
                />
              </div>
              {error && (
                <div className="flex items-center gap-1 text-xs text-rose-600 font-semibold mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Incorrect PIN. (Use 1410 or Demo Access below)</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer transition-colors"
            >
              Sign In to Admin
            </button>
          </form>

          <div className="pt-3 border-t border-stone-100 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleInstantDemo}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span>One-Click Demo Staff Access (PIN 1410)</span>
            </button>
            <span className="text-[10px] text-stone-400">Front Desk Helpline: +92 342 8332015</span>
          </div>
        </div>
      </div>
    </div>
  );
};
