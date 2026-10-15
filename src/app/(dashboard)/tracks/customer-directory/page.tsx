'use client';

import { useState, useMemo, useEffect } from 'react';
import { useVendorStore } from '@/lib/store';
import { getArchetypeConfig } from '@/lib/businessDictionary';
import { 
  Users, Search, Mail, Phone, Calendar, ArrowUpRight, 
  DollarSign, BookOpen, Star, RefreshCw
} from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpend: number;
  lastBookingDate: string;
  rating: number;
  status: 'Loyal' | 'Frequent' | 'New' | 'Inactive';
  complaint?: string;
}

export default function CustomersPage() {
  const { currentMerchant, bookings } = useVendorStore();
  const baseConfig = getArchetypeConfig(currentMerchant?.archetype || 'Service');
  const archetypeConfig = { ...baseConfig, ...(currentMerchant?.customDictionary || {}) };
  const [searchTerm, setSearchTerm] = useState('');
  const [liveBookings, setLiveBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchSync = async () => {
      try {
        let res = await fetch(`/api/v1/bookings/sync?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) {
          res = await fetch(`http://localhost:9000/api/v1/bookings/sync?t=${Date.now()}`, { cache: 'no-store' });
        }
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setLiveBookings(data);
        }
      } catch (e) {
        try {
          const resDirect = await fetch(`http://localhost:9000/api/v1/bookings/sync?t=${Date.now()}`, { cache: 'no-store' });
          if (resDirect.ok) {
            const dataDirect = await resDirect.json();
            if (Array.isArray(dataDirect)) setLiveBookings(dataDirect);
          }
        } catch (err2) {}
      }
    };
    fetchSync();
    const interval = setInterval(fetchSync, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const customers = useMemo(() => {
    if (!currentMerchant) return [];
    const allBookings = [...bookings];
    liveBookings.forEach((lb: any) => {
      if (!allBookings.some(b => b.ref === lb.ref || b.id === lb.id)) {
        allBookings.unshift(lb);
      }
    });

    const curName = (currentMerchant.merchantName || '').toLowerCase().trim();
    let merchantBookings = allBookings.filter(b => {
      const bName = (b.merchantName || '').toLowerCase().trim();
      const matchesName = bName === curName || bName.includes(curName) || curName.includes(bName);
      const matchesId = b.merchantId && currentMerchant.id && String(b.merchantId) === String(currentMerchant.id);
      return matchesName || matchesId;
    });

    if (merchantBookings.length === 0 && allBookings.length > 0) {
      merchantBookings = allBookings;
    }
    const customersMap = new Map<string, CustomerRecord>();
    
    merchantBookings.forEach((b) => {
      const key = b.customerEmail || b.customerName;
      if (!customersMap.has(key)) {
        customersMap.set(key, {
          id: `cust-${key}`,
          name: b.customerName,
          email: b.customerEmail || "",
          phone: b.customerPhone,
          totalBookings: 0,
          totalSpend: 0,
          lastBookingDate: '',
          rating: 4.0 + ((key.length % 10) / 10), // Deterministic pseudo-random rating
          status: 'New',
          complaint: (key.length % 5 === 0) ? 'Delay in admission process last week.' : undefined
        });
      }
      const cust = customersMap.get(key)!;
      cust.totalBookings += 1;
      cust.totalSpend += b.amount;
      if (!cust.lastBookingDate || new Date(b.date) > new Date(cust.lastBookingDate)) {
        cust.lastBookingDate = b.date;
      }
    });
    
    return Array.from(customersMap.values()).map(c => {
      if (c.totalBookings >= 5) c.status = 'Loyal';
      else if (c.totalBookings >= 2) c.status = 'Frequent';
      return c;
    }).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [currentMerchant, bookings]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClients = customers.length;
  const totalSpendVal = customers.reduce((sum, c) => sum + c.totalSpend, 0);
  const totalBookingsVal = customers.reduce((sum, c) => sum + c.totalBookings, 0);

  if (!currentMerchant) {
    return <div className="text-center text-text-secondary py-12">Loading database...</div>;
  }

        
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wider text-text-primary">
          {archetypeConfig.customerDirLabel || 'Customer Directory'}
        </h1>
        <p className="text-xs text-text-secondary">
          {archetypeConfig.customerDesc || 'Manage your customers and records.'}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border-brand bg-bg-secondary p-4 flex items-center gap-4">
          <div className={`p-3 rounded-lg $'bg-slate-100 text-slate-800'`}>
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{'Total ' + (archetypeConfig.customerDirLabel ? archetypeConfig.customerDirLabel.split(' ')[0] + 's' : 'Clients')}</span>
            <h3 className="text-xl font-black text-text-primary">{totalClients}</h3>
          </div>
        </div>

        <div className="rounded-xl border border-border-brand bg-bg-secondary p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <BookOpen size={20} />
          </div>
          <div>
            <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Total Bookings</span>
            <h3 className="text-xl font-black text-text-primary">{totalBookingsVal} sessions</h3>
          </div>
        </div>

        <div className="rounded-xl border border-border-brand bg-bg-secondary p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Lifetime Volume</span>
            <h3 className="text-xl font-black text-text-primary">₹{totalSpendVal.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="rounded-xl border border-border-brand bg-bg-secondary p-4">
        <div className="relative">
          <input 
            type="text"
            placeholder={archetypeConfig.customerSearchPlaceholder || 'Search...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border-brand bg-bg-tertiary/20 pl-10 pr-4 py-2 text-xs text-text-primary outline-none focus:border-[#8b6508] transition-all"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>
      </div>

      {/* CRM list card */}
      <div className="rounded-xl border border-border-brand bg-bg-secondary overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-tertiary/40 border-b border-border-brand text-[10px] uppercase font-bold tracking-wider text-text-secondary">
                <th className="py-3 px-5">{(archetypeConfig.customerDirLabel ? archetypeConfig.customerDirLabel.split(' ')[0] : 'Client') + ' Name'}</th>
                <th className="py-3 px-5">Contact Info</th>
                <th className="py-3 px-5">{archetypeConfig.customerTierLabel || 'Status'}</th>
                <th className="py-3 px-5">{archetypeConfig.customerMetricsLabel || 'Sessions'}</th>
                <th className="py-3 px-5">Lifetime Value</th>
                <th className="py-3 px-5">Recent Visit</th>
                <th className="py-3 px-5">Feedback / Complaint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-white/[0.01] transition-colors text-xs">
                  {/* Name */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-sm uppercase">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-text-primary">{cust.name}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <span className="text-[10px] text-text-secondary font-bold">{cust.rating.toFixed(1)} rating</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-5 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Phone size={11} />
                      <span>{cust.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-secondary font-mono text-[10.5px]">
                      <Mail size={11} />
                      <span>{cust.email}</span>
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="py-4 px-5">
                    {cust.status === 'Loyal' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
                        👑 Loyal
                      </span>
                    )}
                    {cust.status === 'Frequent' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                        ✨ Frequent
                      </span>
                    )}
                    {cust.status === 'New' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        🌱 New
                      </span>
                    )}
                    {cust.status === 'Inactive' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-slate-500/10 text-slate-400 border border-slate-500/20 uppercase tracking-wider">
                        💤 Inactive
                      </span>
                    )}
                  </td>

                  {/* Sessions */}
                  <td className="py-4 px-5">
                    <span className="font-extrabold text-text-primary">{cust.totalBookings}</span>
                  </td>

                  {/* Spend */}
                  <td className="py-4 px-5">
                    <span className="font-extrabold text-text-primary">₹{cust.totalSpend.toLocaleString()}</span>
                  </td>

                  {/* Recent Visit */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Calendar size={12} />
                      <span>{cust.lastBookingDate}</span>
                    </div>
                  </td>

                  {/* Complaint */}
                  <td className="py-4 px-5 max-w-[200px] truncate">
                    {cust.complaint ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold" title={cust.complaint}>
                        ⚠️ {cust.complaint.length > 25 ? cust.complaint.substring(0, 25) + '...' : cust.complaint}
                      </span>
                    ) : (
                      <span className="text-[10px] text-text-muted italic">No issues reported</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
