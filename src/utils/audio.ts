/**
 * Web Audio API chime synthesizer for hotel reservation notifications
 */
export function playNotificationSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // First harmonious tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
    
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Second bell tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1174.66, now + 0.12); // D6
    
    gain2.gain.setValueAtTime(0.001, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.25, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    osc2.start(now + 0.12);
    osc2.stop(now + 0.9);
  } catch (err) {
    console.warn('Audio chime could not be played automatically:', err);
  }
}

/**
 * Request native browser notification permission & trigger if granted
 */
export async function triggerBrowserNotification(title: string, body: string): Promise<boolean> {
  if (!('Notification' in window)) return false;

  try {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
      return true;
    } else if (Notification.permission !== 'denied') {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
        return true;
      }
    }
  } catch (e) {
    console.warn('Browser notification error:', e);
  }
  return false;
}
