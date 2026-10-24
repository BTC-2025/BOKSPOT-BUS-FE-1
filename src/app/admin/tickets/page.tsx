'use client';

import { useVendorStore, PRESET_MERCHANTS } from '../../../lib/store';
import { Ticket, Search, Filter, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, User, Mail, Building2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

export default function SupportTicketsPage() {
  const { supportTickets, resolveSupportTicket, updateSupportTicketStatus, customMerchants, fetchSupportTickets } = useVendorStore();
  
  useEffect(() => {
    fetchSupportTickets();
  }, [fetchSupportTickets]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'pending' | 'resolved'>('all');
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ticket.merchantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCount = supportTickets.filter(t => t.status === 'open').length;
  const pendingCount = supportTickets.filter(t => t.status === 'pending').length;
  const resolvedCount = supportTickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="space-y-4 animate-fade-in text-text-primary">
      
      {/* Top Header & Search Filter Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-bg-secondary border border-border-brand/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-text-primary uppercase tracking-wider">Support Resolution Desk</h1>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ff6325]/10 text-[#ff6325] border border-[#ff6325]/20">
              Live Queue
            </span>
          </div>
          <p className="text-[11px] text-text-secondary mt-0.5">Manage customer complaints, merchant service issues, and live escalations.</p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5" />
            <input 
              type="text" 
              placeholder="Search by ID, subject, merchant..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-black/[0.02] dark:bg-white/[0.03] border border-border-brand/70 rounded-xl text-xs w-full sm:w-60 focus:outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325]/30 transition-colors font-medium placeholder-text-muted/60"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-black/[0.02] dark:bg-white/[0.03] border border-border-brand/70 rounded-xl text-xs focus:outline-none focus:border-[#ff6325] appearance-none cursor-pointer font-bold"
          >
            <option value="all">All ({supportTickets.length})</option>
            <option value="open">Open ({openCount})</option>
            <option value="pending">Pending ({pendingCount})</option>
            <option value="resolved">Resolved ({resolvedCount})</option>
          </select>
        </div>
      </div>

      {/* 2-Column Operational Grid (No Empty Space) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT COLUMN: Ticket Queue (8-cols) */}
        <div className="lg:col-span-8 bg-bg-secondary rounded-2xl border border-border-brand/60 shadow-xs overflow-hidden backdrop-blur-sm">
          <div className="px-4 py-3 border-b border-border-brand/40 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-[#ff6325]/10 text-[#ff6325] flex items-center justify-center">
                <Ticket size={13} />
              </div>
              <h2 className="text-xs font-black text-text-primary tracking-tight">Active Ticket Stream</h2>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-text-muted">
                {filteredTickets.length} Displayed
              </span>
            </div>

            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-text-muted hover:text-[#ff6325] font-bold"
              >
                Clear Search
              </button>
            )}
          </div>
          
          <div className="divide-y divide-border-brand/30">
            {filteredTickets.length === 0 ? (
              <div className="py-12 text-center text-text-secondary text-xs font-medium">
                No support tickets found matching your criteria.
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isExpanded = expandedTicket === ticket.id;
                
                // Lookup merchant info
                const merchantData = PRESET_MERCHANTS.find(m => m.id === ticket.merchantId) || customMerchants[ticket.merchantId] || {};
                const accountId = merchantData.vendorId || ticket.merchantId;
                const email = merchantData.email || `${(ticket.merchantName || 'admin').toLowerCase().replace(/\s+/g, '')}@example.com`;
                const businessType = merchantData.category || 'Service & Resource';

                return (
                  <div key={ticket.id} className="flex flex-col border-b border-border-brand/30 last:border-0">
                    <div 
                      onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                      className="p-3.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider ${
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
                          {!isExpanded && <p className="text-[11px] text-text-secondary mt-0.5 max-w-2xl line-clamp-1">{ticket.message}</p>}
                        </div>
                        
                        {!isExpanded && (
                          <div className="flex items-center gap-2 pt-0.5">
                            <div className="h-4.5 w-4.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-[8.5px] font-black text-indigo-400">
                              {ticket.merchantName ? ticket.merchantName.charAt(0) : 'A'}
                            </div>
                            <span className="text-[10px] font-bold text-text-primary">{ticket.merchantName || 'BOKSPOT Admin'}</span>
                            <span className="text-[9px] text-text-muted font-mono">({accountId || 'SYSTEM'})</span>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                        {ticket.status === 'resolved' && !isExpanded && (
                          <div className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                            <CheckCircle2 size={11} />
                            <span>Resolved</span>
                          </div>
                        )}

                        {ticket.status === 'open' && !isExpanded && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              resolveSupportTicket(ticket.id);
                            }}
                            className="px-2.5 py-1 bg-[#ff6325] hover:bg-[#ff7b47] text-white rounded-lg text-[10px] font-bold transition-all shadow-2xs"
                          >
                            Resolve Now
                          </button>
                        )}
                        
                        <button className="text-[11px] font-bold text-[#ff6325] flex items-center gap-1 hover:underline transition-colors">
                          {isExpanded ? (
                            <>Collapse <ChevronUp size={13} /></>
                          ) : (
                            <>View Case <ChevronDown size={13} /></>
                          )}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] border-t border-border-brand/40 space-y-4">
                        
                        {/* Detailed Message */}
                        <div>
                          <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Detailed Complaint Report</h4>
                          <div className="p-3 bg-bg-primary rounded-xl border border-border-brand/60 text-xs text-text-primary whitespace-pre-wrap leading-relaxed">
                            {ticket.message}
                          </div>
                        </div>

                        {/* Business Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="p-2.5 bg-bg-primary rounded-xl border border-border-brand/50 flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1"><User size={10} /> Account Identity</span>
                            <span className="text-xs font-bold text-text-primary mt-0.5">{ticket.merchantName || 'BOKSPOT Admin'}</span>
                            <span className="text-[10px] text-indigo-400 font-mono">{accountId || 'SYSTEM'}</span>
                          </div>
                          <div className="p-2.5 bg-bg-primary rounded-xl border border-border-brand/50 flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1"><Mail size={10} /> Registered Contact</span>
                            <span className="text-xs font-medium text-text-primary mt-0.5 truncate">{email}</span>
                          </div>
                          <div className="p-2.5 bg-bg-primary rounded-xl border border-border-brand/50 flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1"><Building2 size={10} /> Category Service</span>
                            <span className="text-xs font-medium text-text-primary mt-0.5">{businessType}</span>
                          </div>
                        </div>

                        {/* Reply Box */}
                        <div className="pt-3 border-t border-border-brand/40">
                          <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Official Resolution Dispatch</h4>
                          <textarea 
                            placeholder={`Type your reply to ${ticket.merchantName || 'BOKSPOT Admin'}...`}
                            rows={3}
                            className="w-full bg-bg-primary border border-border-brand/70 rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325]/30 transition-colors resize-none placeholder-text-muted/60"
                          />
                          <div className="flex items-center justify-end mt-2 gap-2">
                            <button className="px-3.5 py-1.5 bg-[#ff6325] hover:bg-[#ff7b47] text-white font-bold rounded-xl text-xs transition-all shadow-xs active:scale-95 cursor-pointer">
                              Send Response &amp; Update Merchant
                            </button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border-brand/40">
                          {ticket.status !== 'resolved' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateSupportTicketStatus(ticket.id, 'resolved'); setExpandedTicket(null); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                            >
                              <CheckCircle2 size={13} />
                              <span>Mark as Resolved</span>
                            </button>
                          )}
                          
                          {ticket.status !== 'pending' && ticket.status !== 'resolved' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateSupportTicketStatus(ticket.id, 'pending'); setExpandedTicket(null); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-border-brand text-text-primary rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                            >
                              <Clock size={13} />
                              <span>Mark Pending</span>
                            </button>
                          )}
                          
                          {ticket.status !== 'open' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateSupportTicketStatus(ticket.id, 'open'); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                            >
                              <span>Reopen Ticket</span>
                            </button>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Quick Status Filters & Resolution Benchmarks (4-cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          
          {/* Queue Statistics Card */}
          <div className="bg-bg-secondary p-4 rounded-2xl border border-border-brand/60 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-text-primary mb-3">
              Resolution Matrix
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                  statusFilter === 'all' 
                    ? 'border-[#ff6325] bg-[#ff6325]/10 text-[#ff6325] font-bold' 
                    : 'border-border-brand/40 bg-black/[0.02] dark:bg-white/[0.02] text-text-secondary hover:border-border-brand'
                }`}
              >
                <span>All Inquiries</span>
                <span className="font-mono font-bold">{supportTickets.length}</span>
              </button>

              <button
                onClick={() => setStatusFilter('open')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                  statusFilter === 'open' 
                    ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold' 
                    : 'border-border-brand/40 bg-black/[0.02] dark:bg-white/[0.02] text-text-secondary hover:border-amber-500/40'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Open Action Needed</span>
                </span>
                <span className="font-mono font-bold text-amber-500">{openCount}</span>
              </button>

              <button
                onClick={() => setStatusFilter('pending')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                  statusFilter === 'pending' 
                    ? 'border-blue-400 bg-blue-500/10 text-blue-400 font-bold' 
                    : 'border-border-brand/40 bg-black/[0.02] dark:bg-white/[0.02] text-text-secondary hover:border-blue-400/40'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  <span>Pending Merchant Reply</span>
                </span>
                <span className="font-mono font-bold text-blue-400">{pendingCount}</span>
              </button>

              <button
                onClick={() => setStatusFilter('resolved')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                  statusFilter === 'resolved' 
                    ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400 font-bold' 
                    : 'border-border-brand/40 bg-black/[0.02] dark:bg-white/[0.02] text-text-secondary hover:border-emerald-400/40'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Closed &amp; Resolved</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">{resolvedCount}</span>
              </button>
            </div>
          </div>

          {/* SLA Performance Card */}
          <div className="bg-bg-secondary p-4 rounded-2xl border border-border-brand/60 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-text-primary mb-2.5">
              SLA Benchmarks
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-border-brand/40 flex items-center justify-between">
                <span className="text-[11px] text-text-secondary">Average First Reply</span>
                <span className="font-bold text-text-primary text-[10px]">~4.2 mins</span>
              </div>

              <div className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-border-brand/40 flex items-center justify-between">
                <span className="text-[11px] text-text-secondary">Resolution Rate</span>
                <span className="font-bold text-emerald-400 text-[10px]">98.4%</span>
              </div>

              <div className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-border-brand/40 flex items-center justify-between">
                <span className="text-[11px] text-text-secondary">Dispute Refund SLA</span>
                <span className="font-bold text-text-primary text-[10px]">Same Day</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
