'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useVendorStore } from '@/lib/store';

export default function ContactPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const { currentMerchant, addSupportTicket } = useVendorStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !currentMerchant) return;
    
    // Simulate support ticket creation
    addSupportTicket({
      merchantId: currentMerchant.id,
      merchantName: currentMerchant.merchantName,
      subject,
      message,
    });
    
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSubject('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wider text-text-primary">Contact Us</h1>
        <p className="text-xs text-text-secondary">Get in touch with BokSpot Merchant Relations or file a platform bug report.</p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border-brand bg-bg-secondary p-4 flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
            <Mail size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Email Support</h4>
            <p className="text-xs text-text-secondary font-mono mt-1">merchant.support@bokspot.com</p>
            <p className="text-[10px] text-text-muted mt-0.5">24/7 Ticketing System</p>
          </div>
        </div>

        <div className="rounded-xl border border-border-brand bg-bg-secondary p-4 flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Phone size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Hotline Support</h4>
            <p className="text-xs text-text-secondary font-mono mt-1">+91 1800 555 9898</p>
            <p className="text-[10px] text-text-muted mt-0.5">Mon - Sat, 9 AM - 6 PM</p>
          </div>
        </div>

        <div className="rounded-xl border border-border-brand bg-bg-secondary p-4 flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
            <MapPin size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Headquarters</h4>
            <p className="text-xs text-text-secondary mt-1">Beta Tower, Sector 62</p>
            <p className="text-[10px] text-text-muted mt-0.5">Noida, UP - 201301</p>
          </div>
        </div>
      </div>

      {/* Support ticket form */}
      <div className="rounded-xl border border-border-brand bg-bg-secondary p-6 shadow-xl relative overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <MessageSquare size={16} className="text-[#ff6325]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Create Support Ticket</h3>
          </div>

          {success && (
            <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={15} />
              <span>Ticket successfully created! Our support team will respond within 4 hours.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-secondary">Subject</label>
              <input 
                type="text"
                placeholder="e.g. Services page loading delays or staff role updates"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-border-brand bg-bg-tertiary/20 px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325]/20 transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-secondary">Message / Issue Details</label>
              <textarea 
                rows={5}
                placeholder="Please describe your query or problem in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-border-brand bg-bg-tertiary/20 px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325]/20 transition-all resize-none"
                required
              />
            </div>

            <button 
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white px-6 py-2.5 text-xs font-bold transition-all shadow-lg shadow-[#ff6325]/25 active:scale-95 cursor-pointer"
            >
              <Send size={14} />
              <span>Submit Support Ticket</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
