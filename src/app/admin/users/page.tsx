'use client';

import { Users, Shield, MoreVertical, Search, CheckCircle2, XCircle, UserCheck, ShieldAlert, Plus, Mail, Building2, UserPlus, Filter } from 'lucide-react';
import { useState } from 'react';

interface PlatformUser {
  id: string;
  name: string;
  businessName: string;
  email: string;
  role: 'Business Owner' | 'Customer' | 'Admin' | 'Staff';
  status: 'Active' | 'Suspended';
  date: string;
  location?: string;
  phone?: string;
}

const INITIAL_USERS: PlatformUser[] = [
  { id: 'USR-1001', name: 'Karthik Raja', businessName: 'Karthik Salon & Spa', email: 'karthik@example.com', role: 'Business Owner', status: 'Active', date: 'Oct 12, 2026', location: 'Chennai', phone: '+91 98401 23456' },
  { id: 'USR-1002', name: 'Meena Kumari', businessName: '-', email: 'meena@example.com', role: 'Customer', status: 'Active', date: 'Oct 14, 2026', location: 'Chennai', phone: '+91 94440 98765' },
  { id: 'USR-1003', name: 'Ramesh Singh', businessName: 'Singh Fitness Center', email: 'ramesh@example.com', role: 'Business Owner', status: 'Suspended', date: 'Nov 02, 2026', location: 'Madurai', phone: '+91 98842 11223' },
  { id: 'USR-1004', name: 'Anita Patel', businessName: '-', email: 'anita@example.com', role: 'Customer', status: 'Active', date: 'Nov 10, 2026', location: 'Bengaluru', phone: '+91 99620 44556' },
  { id: 'USR-1005', name: 'John Doe', businessName: '-', email: 'john@example.com', role: 'Admin', status: 'Active', date: 'Jan 01, 2025', location: 'Headquarters', phone: '+91 98410 00001' },
  { id: 'USR-1006', name: 'Sunstone Frontdesk', businessName: 'Sunstone Resort', email: 'frontdesk@sunstone.com', role: 'Staff', status: 'Active', date: 'Jan 15, 2026', location: 'Chennai', phone: '+91 98405 99887' }
];

export default function ManageUsersPage() {
  const [users, setUsers] = useState<PlatformUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'Business Owner' | 'Customer' | 'Admin' | 'Staff'>('all');
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const businessOwnersCount = users.filter(u => u.role === 'Business Owner').length;
  const customersCount = users.filter(u => u.role === 'Customer').length;
  const staffCount = users.filter(u => u.role === 'Staff' || u.role === 'Admin').length;
  const activeCount = users.filter(u => u.status === 'Active').length;

  return (
    <div className="space-y-4 animate-fade-in text-text-primary">
      
      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-bg-secondary border border-border-brand/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-text-primary uppercase tracking-wider">User Identity &amp; Access Directory</h1>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {activeCount} Verified Active
            </span>
          </div>
          <p className="text-[11px] text-text-secondary mt-0.5">RBAC management for merchants, frontdesk attendants, customers &amp; platform super admins.</p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5" />
            <input 
              type="text" 
              placeholder="Search user, email, business..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-black/[0.02] dark:bg-white/[0.03] border border-border-brand/70 rounded-xl text-xs w-full sm:w-56 focus:outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325]/30 transition-colors font-medium placeholder-text-muted/60"
            />
          </div>
          
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-black/[0.02] dark:bg-white/[0.03] border border-border-brand/70 rounded-xl text-xs focus:outline-none focus:border-[#ff6325] appearance-none cursor-pointer font-bold"
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="Business Owner">Merchants ({businessOwnersCount})</option>
            <option value="Customer">Customers ({customersCount})</option>
            <option value="Staff">Staff &amp; Admins ({staffCount})</option>
          </select>
        </div>
      </div>

      {/* 4 KPI Role Metrics Cards (Solid Rich High-Visibility Icon Badges) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-bg-secondary p-3.5 rounded-2xl shadow-xs border border-border-brand/60 flex items-center justify-between hover:border-indigo-500/40 transition-colors group">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Total Accounts</p>
            <h3 className="text-xl font-black text-text-primary tracking-tight">{users.length}</h3>
            <p className="text-[9px] text-text-muted">Registered in Auth</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Users size={19} className="stroke-[2.5]" />
          </div>
        </div>

        <div className="bg-bg-secondary p-3.5 rounded-2xl shadow-xs border border-border-brand/60 flex items-center justify-between hover:border-[#ff6325]/40 transition-colors group">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-[#ff6325] uppercase tracking-wider">Business Owners</p>
            <h3 className="text-xl font-black text-text-primary tracking-tight">{businessOwnersCount}</h3>
            <p className="text-[9px] text-text-muted">Approved Merchants</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#ff6325] to-[#e0480b] text-white flex items-center justify-center shadow-md shadow-[#ff6325]/25 group-hover:scale-105 transition-transform shrink-0">
            <Building2 size={19} className="stroke-[2.5]" />
          </div>
        </div>

        <div className="bg-bg-secondary p-3.5 rounded-2xl shadow-xs border border-border-brand/60 flex items-center justify-between hover:border-sky-500/40 transition-colors group">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-sky-500 uppercase tracking-wider">Active Customers</p>
            <h3 className="text-xl font-black text-text-primary tracking-tight">{customersCount}</h3>
            <p className="text-[9px] text-text-muted">Verified Mobile/Email</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform shrink-0">
            <UserCheck size={19} className="stroke-[2.5]" />
          </div>
        </div>

        <div className="bg-bg-secondary p-3.5 rounded-2xl shadow-xs border border-border-brand/60 flex items-center justify-between hover:border-emerald-500/40 transition-colors group">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Security Health</p>
            <h3 className="text-xl font-black text-emerald-500 tracking-tight">100%</h3>
            <p className="text-[9px] text-text-muted">2FA &amp; JWT Verified</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Shield size={19} className="stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* 2-Column High-Density Operational Matrix (No Empty Space) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT COLUMN: User Directory Table (8-cols) */}
        <div className="lg:col-span-8 bg-bg-secondary rounded-2xl border border-border-brand/60 shadow-xs overflow-hidden backdrop-blur-sm">
          <div className="px-4 py-3 border-b border-border-brand/40 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Users size={13} />
              </div>
              <h2 className="text-xs font-black text-text-primary tracking-tight">User Roster Stream</h2>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-text-muted">
                {filteredUsers.length} Users
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
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-border-brand/40 text-[10px] uppercase tracking-wider text-text-secondary font-bold">
                  <th className="px-4 py-3">User Profile</th>
                  <th className="px-4 py-3">Role &amp; Business</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-brand/30">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    
                    {/* User Profile */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#0a3161] to-[#142642] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-xs text-text-primary flex items-center gap-1.5">
                            <span className="truncate">{user.name}</span>
                            <span className="text-[9px] text-indigo-400 font-mono font-bold bg-indigo-500/10 px-1 py-0.2 rounded border border-indigo-500/20 shrink-0">
                              {user.id}
                            </span>
                          </div>
                          <div className="text-[10px] text-text-muted truncate mt-0.5">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Business */}
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          user.role === 'Business Owner' ? 'bg-[#ff6325]/10 text-[#ff6325] border border-[#ff6325]/20' :
                          user.role === 'Admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          user.role === 'Staff' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                          'bg-black/5 dark:bg-white/10 text-text-secondary'
                        }`}>
                          {user.role}
                        </span>
                        {user.businessName !== '-' && (
                          <p className="text-[10px] text-[#ff6325] font-bold truncate">
                            {user.businessName}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {user.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 size={11} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                          <XCircle size={11} /> Suspended
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3 text-[11px] text-text-secondary whitespace-nowrap font-medium">
                      {user.date}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => toggleStatus(user.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            user.status === 'Active'
                              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25'
                          }`}
                        >
                          {user.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>

                        <button 
                          onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="py-10 text-center text-text-secondary text-xs font-medium">
                No users found matching your search criteria.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: User Inspector & Quick Actions (4-cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          
          {/* Selected User Quick Inspector Card */}
          <div className="bg-bg-secondary p-4 rounded-2xl border border-border-brand/60 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-text-primary mb-3 flex items-center justify-between">
              <span>Selected Account</span>
              <span className="text-[9px] font-bold text-text-muted">
                {selectedUser ? selectedUser.id : 'Click details to inspect'}
              </span>
            </h3>

            {selectedUser ? (
              <div className="space-y-2.5 text-xs animate-fade-in">
                <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-border-brand/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Full Name</span>
                    <span className="font-extrabold text-text-primary">{selectedUser.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Email Address</span>
                    <span className="font-medium text-text-secondary truncate max-w-[170px]">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Phone</span>
                    <span className="font-mono text-text-primary">{selectedUser.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Location</span>
                    <span className="font-bold text-text-primary">{selectedUser.location || 'Chennai'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleStatus(selectedUser.id)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] text-xs font-bold transition-all text-text-primary cursor-pointer"
                  >
                    {selectedUser.status === 'Active' ? 'Toggle Suspend' : 'Reactivate'}
                  </button>
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="py-1.5 px-3 rounded-xl text-text-muted hover:text-text-primary text-xs font-bold transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-border-brand/40">
                <Users size={20} className="mx-auto text-text-muted/60 mb-1" />
                <p className="text-text-muted font-medium text-xs">No account selected.</p>
                <p className="text-[10px] text-text-muted/80 mt-0.5">Click any action row on the left table to inspect.</p>
              </div>
            )}
          </div>

          {/* Platform Access Summary Card */}
          <div className="bg-bg-secondary p-4 rounded-2xl border border-border-brand/60 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-text-primary mb-2.5">
              Access Governance
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-border-brand/40 flex items-center justify-between">
                <span className="text-[11px] text-text-secondary">Password Security Policy</span>
                <span className="font-bold text-emerald-400 text-[10px]">Bcrypt 12 Rounds</span>
              </div>

              <div className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-border-brand/40 flex items-center justify-between">
                <span className="text-[11px] text-text-secondary">Session Token Expiry</span>
                <span className="font-bold text-text-primary text-[10px]">7 Days (JWT)</span>
              </div>

              <div className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-border-brand/40 flex items-center justify-between">
                <span className="text-[11px] text-text-secondary">Multi-Branch Access</span>
                <span className="font-bold text-emerald-400 text-[10px]">Role-Scoped</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
