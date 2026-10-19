'use client';

import { useVendorStore } from '@/lib/store';
import { QrCode, CheckCircle2, XCircle, Search, Clock, ArrowRight, ShieldCheck, User, Camera, ScanLine, X, Volume2 } from 'lucide-react';
import { useState } from 'react';

export default function CheckinPage() {
  const { currentMerchant, bookings, checkInBooking } = useVendorStore();
  const [tokenInput, setTokenInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSelectedId, setScanSelectedId] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'success' | 'error';
    message: string;
    bookingRef?: string;
    customerName?: string;
    serviceName?: string;
    time?: string;
  } | null>(null);

  if (!currentMerchant) {
    return <div className="text-center text-[color:var(--text-muted)] py-12">Loading check-in console...</div>;
  }

  // Filter bookings for this merchant
  const merchantBookings = bookings.filter(
    (b) =>
      (b.merchantId && currentMerchant.id && String(b.merchantId) === String(currentMerchant.id)) ||
      b.merchantName.toLowerCase() === currentMerchant.merchantName.toLowerCase() ||
      (currentMerchant.archetype === 'PassEntry' && ['cabs', 'flights', 'trains', 'buses', 'travel', 'movies', 'concerts', 'events', 'exhibitions'].includes(b.category?.toLowerCase() || ''))
  );

  const handleVerifyCode = (code: string) => {
    setVerificationResult(null);
    if (!code.trim()) return;

    const query = code.trim().toLowerCase();
    const matched = merchantBookings.find(
      (b) =>
        b.ref.toLowerCase() === query ||
        (b.otp && b.otp.trim().toLowerCase() === query) ||
        (b.metadata?.pnr && String(b.metadata.pnr).toLowerCase() === query) ||
        (b.metadata?.ticketBarcode && String(b.metadata.ticketBarcode).toLowerCase() === query)
    );

    if (matched) {
      if (matched.status === 'CANCELLED') {
        setVerificationResult({
          status: 'error',
          message: 'This booking has been cancelled and cannot be checked-in.'
        });
      } else if (matched.status === 'COMPLETED') {
        setVerificationResult({
          status: 'error',
          message: 'This session has already been completed.'
        });
      } else if (matched.status === 'CHECKED_IN') {
        setVerificationResult({
          status: 'success',
          message: 'Client is already checked-in.',
          bookingRef: matched.ref,
          customerName: matched.customerName,
          serviceName: matched.serviceName,
          time: matched.time
        });
      } else {
        // CONFIRMED or PENDING -> Perform Check In
        checkInBooking(matched.id);

        // Sync checked in state back to backend so customer portal is updated
        const updatedBooking = { ...matched, status: 'CHECKED_IN' as const };
        fetch('/api/v1/bookings/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedBooking),
        })
          .then((res) => res.json())
          .then((data) => console.log('Successfully synced checkin to NestJS backend:', data))
          .catch((err) => console.error('Failed to sync checkin to NestJS backend:', err));

        setVerificationResult({
          status: 'success',
          message: 'Booking verified! Status updated to Checked In.',
          bookingRef: matched.ref,
          customerName: matched.customerName,
          serviceName: matched.serviceName,
          time: matched.time
        });
      }
    } else {
      setVerificationResult({
        status: 'error',
        message: 'Invalid code. This reference/OTP does not exist or belongs to another merchant catalog.'
      });
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyCode(tokenInput);
  };

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (err) {
      console.warn("Failed to play synthesized audio beep:", err);
    }
  };

  const handleSimulateScan = () => {
    if (!scanSelectedId) return;
    const target = merchantBookings.find(b => b.id === scanSelectedId);
    if (!target) return;

    playBeep();
    setTokenInput(target.ref);
    handleVerifyCode(target.ref);
    setIsScanning(false);
  };

  // Recent check-ins list (Checked In or Completed bookings)
  const checkedInList = merchantBookings.filter(
    (b) => b.status === 'CHECKED_IN' || b.status === 'COMPLETED'
  );

  // List of active bookings available for scanning
  const scanableBookings = merchantBookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'PENDING'
  );

  return (
    <div className="space-y-6 animate-fade-in text-[color:var(--text-primary)]">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[color:var(--border)] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">QR Check-in Console</h1>
          <p className="text-xs text-[color:var(--text-secondary)]">Verify customer references manually or scan QR check-in tokens.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Verification Portal */}
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-tertiary)] p-6 space-y-6 shadow-sm">
          <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 text-[color:var(--primary)]">
            <QrCode className="h-5 w-5 animate-pulse" /> Verify Customer Token
          </h2>

          <div className="aspect-video rounded-2xl bg-[color:var(--bg-secondary)] border-2 border-dashed border-[color:var(--border)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
            <div className="space-y-3 z-10 relative">
              <Camera className="h-12 w-12 text-[color:var(--text-muted)] mx-auto mb-1 group-hover:scale-105 transition-transform" />
              <div className="text-xs font-bold">Simulated QR Code Scanner</div>
              <p className="text-[10px] text-[color:var(--text-secondary)] leading-normal max-w-[260px] mx-auto">
                Camera feed requires SSL/HTTPS domain environment. Use our simulated reader for verification testing.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsScanning(true);
                  if (scanableBookings.length > 0) {
                    setScanSelectedId(scanableBookings[0].id);
                  } else {
                    setScanSelectedId('');
                  }
                }}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[color:var(--primary)] hover:bg-[color:var(--primary-dark)] text-white text-xs font-bold px-4 py-2.5 shadow active:scale-[0.98] transition-all cursor-pointer"
              >
                <ScanLine className="h-4 w-4" /> Open Scanner View
              </button>
            </div>
          </div>

          <form onSubmit={handleVerifySubmit} className="space-y-3">
            <label className="text-[10px] uppercase font-black text-[color:var(--text-muted)] tracking-wider">Manual Reference / OTP Verification</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--text-muted)]" />
                <input 
                  type="text" 
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Enter 6-char Ref (e.g. BK-AA12) or 4-digit OTP" 
                  className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-secondary)] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[color:var(--primary)] transition-all text-[color:var(--text-primary)]" 
                />
              </div>
              <button 
                type="submit"
                className="rounded-xl bg-[color:var(--primary)] hover:bg-[color:var(--primary-dark)] px-5 text-xs font-bold text-white transition-colors cursor-pointer shadow"
              >
                Verify Code
              </button>
            </div>
          </form>

          {/* Verification Result Banner */}
          {verificationResult && (
            <div className={`p-4 rounded-xl border animate-fade-in ${
              verificationResult.status === 'success' 
                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' 
                : 'border-red-500/20 bg-red-500/5 text-red-500'
            }`}>
              <div className="flex items-start gap-3">
                {verificationResult.status === 'success' ? (
                  <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={18} className="shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 flex-1">
                  <div className="text-xs font-bold leading-snug">{verificationResult.message}</div>
                  
                  {verificationResult.status === 'success' && verificationResult.bookingRef && (
                    <div className="p-3.5 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] space-y-2 text-[11px] text-[color:var(--text-secondary)] shadow-sm">
                      <div className="flex items-center justify-between pb-1.5 border-b border-[color:var(--border)]">
                        <div>Ref: <strong className="font-mono text-[color:var(--text-primary)] font-bold">{verificationResult.bookingRef}</strong></div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-extrabold text-[9px] uppercase tracking-wider border border-emerald-500/20">Gate Admitted</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <div className="flex items-center gap-1.5"><User size={12} className="text-[color:var(--primary)]" /> Client: <strong className="text-[color:var(--text-primary)] truncate">{verificationResult.customerName}</strong></div>
                        <div className="flex items-center gap-1.5"><Clock size={12} className="text-[color:var(--primary)]" /> Slot: <span className="font-semibold text-[color:var(--text-primary)]">{verificationResult.time}</span></div>
                      </div>
                      <div>Service: <strong className="text-[color:var(--primary)] font-bold">{verificationResult.serviceName}</strong></div>
                      {verificationResult.bookingRef && (
                        <div className="pt-1 text-[10px] text-slate-400 flex items-center justify-between border-t border-[color:var(--border)]/60 font-mono">
                          <span>PNR: {verificationResult.bookingRef.replace('BK-', 'PNR-')}</span>
                          <span>Barcode Validated ✓</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Checked-in List */}
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-tertiary)] p-6 space-y-4 shadow-sm">
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-[color:var(--text-primary)]">Recent Check-in Logs</h2>
          <p className="text-[11px] text-[color:var(--text-secondary)]">Audit trail of clients validated today. Checked-in clients are queued in the platform console.</p>
          
          <div className="space-y-3 pt-2">
            {checkedInList.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-secondary)] px-4 py-3 text-xs">
                {c.status === 'COMPLETED' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                ) : (
                  <Clock className="h-5 w-5 text-cyan-500 shrink-0 animate-pulse" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{c.customerName}</div>
                  <div className="text-[10px] text-[color:var(--text-muted)] truncate">{c.serviceName} · {c.ref}</div>
                </div>
                <div className="text-right">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    c.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 'bg-cyan-500/10 text-cyan-500'
                  }`}>
                    {c.status}
                  </span>
                  <div className="text-[9px] text-[color:var(--text-muted)] mt-1 font-medium">{c.time}</div>
                </div>
              </div>
            ))}
            {checkedInList.length === 0 && (
              <div className="text-center py-10 rounded-xl border border-dashed border-[color:var(--border)] text-[color:var(--text-muted)] text-xs">
                No client codes validated yet today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulated Scanner View Modal */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-slate-500/ backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[color:var(--bg-tertiary)] border border-[color:var(--border)] rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl relative animate-scale-up text-[color:var(--text-primary)]">
            <button
              onClick={() => setIsScanning(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-[color:var(--primary)] flex items-center gap-2">
                <ScanLine className="h-4 w-4" /> Live QR Scanner Simulator
              </h3>
              <p className="text-[10px] text-[color:var(--text-secondary)]">Simulate a customer holding their ticket QR code to the lens.</p>
            </div>

            {/* Simulated Live Lens Viewport */}
            <div className="relative aspect-video rounded-2xl bg-slate-100 border border-white/10 overflow-hidden flex flex-col items-center justify-center p-4 shadow-inner">
              <style>{`
                @keyframes scan {
                  0% { top: 0%; }
                  50% { top: 100%; }
                  100% { top: 0%; }
                }
                .animate-scan {
                  animation: scan 2.5s ease-in-out infinite;
                }
              `}</style>
              
              {/* Animated Scan Line */}
              <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-scan z-10" />

              {/* Target brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />

              <div className="text-center space-y-1">
                <QrCode className="h-10 w-10 text-emerald-400/40 mx-auto animate-pulse" />
                <span className="text-[9px] font-mono tracking-widest text-emerald-400/60 uppercase">Aligning security code...</span>
              </div>
            </div>

            {/* Ticket Selector Dropdown */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-[color:var(--text-muted)] tracking-wider block">Select device ticket to scan</label>
              {scanableBookings.length > 0 ? (
                <div className="space-y-3">
                  <select
                    value={scanSelectedId}
                    onChange={(e) => setScanSelectedId(e.target.value)}
                    className="w-full bg-[color:var(--bg-secondary)] border border-[color:var(--border)] rounded-xl px-3 py-2 text-xs text-[color:var(--text-primary)] outline-none cursor-pointer focus:border-[color:var(--primary)]"
                  >
                    {scanableBookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.customerName} - {b.serviceName} ({b.ref})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleSimulateScan}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold py-3 rounded-xl uppercase tracking-wider active:scale-[0.98] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    <Volume2 className="h-4 w-4 animate-bounce" />
                    <span>Simulate Scan (Plays Beep)</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed border-[color:var(--border)] rounded-xl text-[color:var(--text-muted)] text-xs">
                  No active or confirmed reservations available to scan.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
