'use client';

import { useVendorStore, PRESET_MERCHANTS } from '../../lib/store';
import { Ticket, CheckCircle2, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect } from 'react';

export default function AdminOverviewPage() {
  const { supportTickets, resolveSupportTicket, customMerchants, fetchSupportTickets } = useVendorStore();

  useEffect(() => {
    fetchSupportTickets();
  }, [fetchSupportTickets]);

  const totalTickets = supportTickets.length;
  const openTickets = supportTickets.filter(t => t.status === 'open').length;
  const resolvedTickets = supportTickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="space-y-4 animate-fade-in text-text-primary">
      
      {/* Platform Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-bg-secondary border border-border-brand/60 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#ff6325] to-[#ff7b47] flex items-center justify-center text-white font-black text-xs shadow-xs">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-text-primary uppercase tracking-wider">BOKSPOT Operations Control Center</h2>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500">Live Services Active</span>
            </div>
            <p className="text-[10px] text-text-muted mt-0.5">Monitoring all merchant bookings, dispute resolution queues &amp; branch activities.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <a
            href="/admin/tickets"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ff6325] hover:bg-[#ff7b47] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Ticket size={13} />
            <span>Manage All Tickets</span>
          </a>
        </div>
      </div>

      {/* KPI Stats (High-Density 4-Column Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-bg-secondary p-3.5 rounded-2xl shadow-xs border border-border-brand/60 flex items-center justify-between hover:border-indigo-500/40 transition-colors group">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Total Tickets</p>
            <h3 className="text-xl font-black text-text-primary tracking-tight">{totalTickets}</h3>
            <p className="text-[9px] text-text-muted">Inquiries &amp; Disputes</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Ticket size={19} className="stroke-[2.5]" />
          </div>
        </div>

        <div className="bg-bg-secondary p-3.5 rounded-2xl shadow-xs border border-border-brand/60 flex items-center justify-between hover:border-amber-500/40 transition-colors group">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Open Inquiries</p>
            <h3 className="text-xl font-black text-amber-500 tracking-tight">{openTickets}</h3>
            <p className="text-[9px] text-text-muted">Requires action</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Clock size={19} className="stroke-[2.5]" />
          </div>
        </div>

        <div className="bg-bg-secondary p-3.5 rounded-2xl shadow-xs border border-border-brand/60 flex items-center justify-between hover:border-emerald-500/40 transition-colors group">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Resolved</p>
            <h3 className="text-xl font-black text-emerald-500 tracking-tight">{resolvedTickets}</h3>
            <p className="text-[9px] text-text-muted">Closed successfully</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
            <CheckCircle2 size={19} className="stroke-[2.5]" />
          </div>
        </div>

        <div className="bg-bg-secondary p-3.5 rounded-2xl shadow-xs border border-border-brand/60 flex items-center justify-between hover:border-sky-500/40 transition-colors group">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-sky-500 uppercase tracking-wider">Active Merchants</p>
            <h3 className="text-xl font-black text-text-primary tracking-tight">
              {PRESET_MERCHANTS.length + Object.keys(customMerchants).length}
            </h3>
            <p className="text-[9px] text-text-muted">Multi-vertical units</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform shrink-0">
            <ShieldAlert size={19} className="stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* 2-Column High-Density Operational Matrix (No Empty Space) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT COLUMN: Recent Support Tickets Table (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-bg-secondary rounded-2xl border border-border-brand/60 shadow-xs overflow-hidden backdrop-blur-sm">
          <div className="px-4 py-3 border-b border-border-brand/40 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-[#ff6325]/10 text-[#ff6325] flex items-center justify-center">
                <Ticket size={13} />
              </div>
              <h2 className="text-xs font-black text-text-primary tracking-tight">Priority Resolution Queue</h2>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-text-muted">
                {supportTickets.length} Active
              </span>
            </div>

            <a 
              href="/admin/tickets" 
              className="text-[11px] font-bold text-[#ff6325] hover:underline flex items-center gap-1"
            >
              <span>View Full Queue</span>
              <ArrowRight size={11} />
            </a>
          </div>
          
          <div className="divide-y divide-border-brand/30">
            {supportTickets.length === 0 ? (
              <div className="py-12 text-center text-text-secondary text-xs font-medium">
                No support tickets found in the system.
              </div>
            ) : (
              supportTickets.map((ticket) => {
                const merchantData = PRESET_MERCHANTS.find(m => m.id === ticket.merchantId) || customMerchants[ticket.merchantId] || {};
                const accountId = merchantData.vendorId || ticket.merchantId;

                return (
                <div key={ticket.id} className="p-3.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider shrink-0 ${
                        ticket.status === 'open' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' : 
                        ticket.status === 'pending' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 
                        'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {ticket.status}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted font-mono">ID: {ticket.id.toUpperCase()}</span>
                      <span className="text-text-muted/40 text-[9px]">&bull;</span>
                      <span className="text-[10px] font-medium text-text-muted">
                        {format(new Date(ticket.createdAt), 'MMM d, yyyy - h:mm a')}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-xs font-extrabold text-text-primary leading-snug">{ticket.subject}</h3>
                      <p className="text-[11px] text-text-secondary line-clamp-1">{ticket.message}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="h-4.5 w-4.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-[8.5px] font-black text-indigo-400 shrink-0">
                        {ticket.merchantName ? ticket.merchantName.charAt(0) : 'A'}
                      </div>
                      <span className="text-[10px] font-bold text-text-primary truncate">{ticket.merchantName || 'BOKSPOT Admin'}</span>
                      <span className="text-[9px] text-text-muted font-mono shrink-0">({accountId || 'SYSTEM'})</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                    {ticket.status === 'open' && (
                      <button 
                        onClick={() => resolveSupportTicket(ticket.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#ff6325] hover:bg-[#ff7b47] active:scale-95 text-white rounded-lg text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        <CheckCircle2 size={12} />
                        <span>Resolve</span>
                      </button>
                    )}
                    
                    {ticket.status === 'resolved' && (
                      <div className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 size={11} />
                        <span>Resolved</span>
                      </div>
                    )}

                    {ticket.status === 'pending' && (
                      <div className="flex items-center gap-1 text-blue-400 font-bold text-[10px] bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">
                        <Clock size={11} />
                        <span>Pending</span>
                      </div>
                    )}

                    <a 
                      href="/admin/tickets" 
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-text-primary rounded-lg text-[11px] font-bold transition-all"
                    >
                      <span>Details</span>
                    </a>
                  </div>

                </div>
              );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Merchant Status & System Health (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-3.5">
          
          {/* Quick System Health Card */}
          <div className="bg-bg-secondary p-4 rounded-2xl border border-border-brand/60 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-text-primary mb-3 flex items-center justify-between">
              <span>Platform Health</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Uptime
              </span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-border-brand/40">
                <span className="text-text-secondary text-[11px]">Primary Core API</span>
                <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Port 9000 (Live)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-border-brand/40">
                <span className="text-text-secondary text-[11px]">Customer Web (FE)</span>
                <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Port 4000 (Live)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-border-brand/40">
                <span className="text-text-secondary text-[11px]">Business Portal (BUS-FE)</span>
                <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Port 4001 (Live)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Merchant Directory Preview */}
          <div className="bg-bg-secondary p-4 rounded-2xl border border-border-brand/60 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-text-primary">
                Active Merchant Nodes
              </h3>
              <a href="/admin/users" className="text-[10px] font-bold text-[#ff6325] hover:underline">
                View All
              </a>
            </div>

            <div className="space-y-2">
              {PRESET_MERCHANTS.slice(0, 3).map((m) => (
                <div key={m.id} className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-border-brand/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-xs shrink-0">
                      {m.merchantName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate">{m.merchantName}</p>
                      <p className="text-[10px] text-text-muted font-mono">{m.category} &bull; {m.vendorId}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 shrink-0">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
