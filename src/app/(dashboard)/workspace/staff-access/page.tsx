'use client';

import { useState } from 'react';
import { useVendorStore, StaffMember, StaffPermissions } from '@/lib/store';
import { getArchetypeConfig } from '@/lib/businessDictionary';
import {
  Users, UserPlus, Search, Star, Phone, Mail, Clock,
  CheckCircle2, X, Plus, Trash2, Shield, Lock
} from 'lucide-react';

export default function StaffPage() {
  const { currentMerchant, staffAccounts, addStaffMember, deleteStaffMember, updateStaffPermissions, loginRole } = useVendorStore();

  const baseConfig = getArchetypeConfig(currentMerchant?.archetype || 'Service');
  const archetypeConfig = { ...baseConfig, ...(currentMerchant?.customDictionary || {}) };
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter for current merchant only
  const merchantStaff = staffAccounts.filter(s => s.merchantId === currentMerchant?.id);

  // Form states
  const [subIdEmail, setSubIdEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newIsDoctor, setNewIsDoctor] = useState(false);
  const [newPassword, setNewPassword] = useState('pass123'); // Default dummy password for sub-id

  const [permissions, setPermissions] = useState<StaffPermissions>({
    canManageVitals: false,
    canAddPrescription: false,
    canManageBilling: false,
    canManageAppointments: false
  });

  const [selectedBranchId, setSelectedBranchId] = useState('');

  // Available branches for this merchant
  const effectiveBranches = (currentMerchant?.branches && currentMerchant.branches.length > 0)
    ? currentMerchant.branches
    : [
        {
          id: 'branch-resort-stay',
          name: `${currentMerchant?.merchantName || 'Main'} - Rooms & Stay`,
          city: currentMerchant?.city || 'Chennai',
          category: 'Resort Booking',
          gstStatus: 'WITH_GST' as const,
          gstNumber: currentMerchant?.gstNumber || '33AAAAA0000A1Z5'
        },
        {
          id: 'branch-resort-turf',
          name: `${currentMerchant?.merchantName || 'Arena'} - Sports Turf`,
          city: currentMerchant?.city || 'Chennai',
          category: 'Football Turf',
          gstStatus: 'WITH_GST' as const,
          gstNumber: currentMerchant?.gstNumber || '33AAAAA0000A1Z5'
        }
      ];

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subIdEmail.trim() || !newName.trim() || !newRole.trim() || !currentMerchant) return;

    const assignedBranch = effectiveBranches.find(b => b.id === selectedBranchId) || effectiveBranches[0];

    const newMember: StaffMember = {
      id: subIdEmail.trim().toLowerCase(),
      merchantId: currentMerchant.id,
      name: newName,
      roleTitle: newRole,
      assignedBranchId: assignedBranch.id,
      assignedBranchName: assignedBranch.name || `${assignedBranch.city} Branch`,
      isDoctor: newIsDoctor,
      passwordHash: newPassword, // In a real app this would be securely handled
      permissions: { ...permissions }
    };

    addStaffMember(newMember);
    setShowAddModal(false);

    // Reset form
    setSubIdEmail('');
    setNewName('');
    setNewRole('');
    setSelectedBranchId('');
    setNewIsDoctor(false);
    setPermissions({
      canManageVitals: false,
      canAddPrescription: false,
      canManageBilling: false,
      canManageAppointments: false
    });
  };

  const filteredStaff = merchantStaff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentMerchant) {
    return <div className="text-center text-text-secondary py-12">Loading staff dashboard...</div>;
  }

  // ONLY THE BUSINESS OWNER (Vendor) can manage staff
  if (loginRole === 'staff') {
    return (
      <div className="flex h-full flex-col items-center justify-center text-text-secondary space-y-4">
        <Lock size={48} className="text-amber-500/50" />
        <h2 className="text-xl font-bold text-text-primary">Access Restricted</h2>
        <p className="text-sm">Only the verified Business Owner can access the Staff Management portal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white flex items-center gap-2.5">
            <Shield size={24} className="text-[#ff6325]" /> Staff Access Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">Grant access to existing Sub-IDs and configure Role-Based Access for your portal.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#ff6325]/25 active:scale-95 cursor-pointer"
        >
          <UserPlus size={16} />
          <span>{currentMerchant?.category?.toLowerCase().includes('camp') ? '+ Add Crew Member' : '+ Add Staff Member'}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-white/10 bg-[#0f1624] p-4 shadow-lg backdrop-blur-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, role or sub-id email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#162033] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325]/20 transition-all"
          />
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Staff list card */}
      <div className="rounded-2xl border border-white/10 bg-[#0f1624] overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#162033]/80 border-b border-white/[0.08] text-[10px] uppercase font-bold tracking-wider text-slate-300">
                <th className="py-3.5 px-5">Staff Member</th>
                <th className="py-3.5 px-5">Verified Sub-ID (Login)</th>
                <th className="py-3.5 px-5">Assigned Branch (Scope)</th>
                <th className="py-3.5 px-5">Active Permissions</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-white/[0.02] transition-colors text-xs">
                  {/* Name & Role */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#0a3161] to-[#124b8f] border border-[#ff6325]/30 flex items-center justify-center font-black text-white text-sm uppercase shrink-0 shadow-md">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2 text-sm">
                          {staff.name}
                          {staff.isDoctor && <span className="bg-[#ff6325]/10 text-[#ff6325] border border-[#ff6325]/20 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">{archetypeConfig.staffTitle || 'Staff'}</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">{staff.roleTitle}</div>
                      </div>
                    </div>
                  </td>

                  {/* Sub-ID */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 text-text-secondary font-mono text-[11px] bg-bg-tertiary/30 px-2 py-1 rounded inline-block">
                      <Mail size={11} className="inline mr-1" />
                      <span className="text-[#9cc3f5]">{staff.id}</span>
                    </div>
                  </td>

                  {/* Assigned Branch */}
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ff6325]/10 border border-[#ff6325]/30 text-[#ff6325] font-bold text-[11px]">
                      🏢 {staff.assignedBranchName || 'All Branches'}
                    </span>
                  </td>

                  {/* Permissions Badges */}
                  <td className="py-4 px-5">
                    <div className="flex flex-wrap gap-1.5">
                      {staff.permissions.canManageVitals && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">Vitals</span>
                      )}
                      {staff.permissions.canAddPrescription && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">Prescriptions</span>
                      )}
                      {staff.permissions.canManageBilling && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">Billing</span>
                      )}
                      {staff.permissions.canManageAppointments && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-orange-500/10 text-[#ff6325] border border-orange-500/20 uppercase">Appointments</span>
                      )}
                      {!Object.values(staff.permissions).some(Boolean) && (
                        <span className="text-[10px] text-slate-500 italic">Read-only Access</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => deleteStaffMember(staff.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Revoke Access & Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-text-secondary text-sm">
                    No staff access granted yet. Click "Grant Access" to add an existing Sub-ID.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
          <div className="w-full max-w-lg bg-[#0f1624] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Shield size={16} className="text-[#ff6325]" /> {currentMerchant?.category?.toLowerCase().includes('camp') ? 'Add Camp Crew Member' : 'Add New Staff Member'}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Create staff login credentials and configure permissions</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4 pt-1">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Priya"
                    className="w-full rounded-xl border border-white/10 bg-[#162033] px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325]/20"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-300">Role Title</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder={
                      currentMerchant?.category?.toLowerCase().includes('camp') || currentMerchant?.archetype === 'Camping'
                        ? "e.g. Camp Leader / Trek Guide / Caretaker"
                        : currentMerchant?.category?.toLowerCase().includes('resort') || currentMerchant?.archetype === 'Accommodation'
                        ? "e.g. Resort Manager / Front Desk"
                        : currentMerchant?.category?.toLowerCase().includes('turf') || currentMerchant?.archetype === 'ResourceBooking'
                        ? "e.g. Ground Manager / Head Referee"
                        : currentMerchant?.category?.toLowerCase().includes('doctor') || currentMerchant?.archetype === 'Healthcare'
                        ? "e.g. Senior Nurse / Resident Doctor"
                        : "e.g. Operations Manager"
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#162033] px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325]/20"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#162033] p-3 rounded-xl border border-white/5">
                <input
                  type="checkbox"
                  id="isDoctor"
                  checked={newIsDoctor}
                  onChange={(e) => setNewIsDoctor(e.target.checked)}
                  className="rounded border-border-brand bg-transparent text-[#ff6325] focus:ring-[#ff6325] accent-[#ff6325]"
                />
                <label htmlFor="isDoctor" className="text-xs font-bold text-text-primary cursor-pointer">This staff member is a Lead/Manager</label>
              </div>

              {/* Branch Assignment (Restricting Sub-ID to this Branch) */}
              <div className="space-y-1.5 p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-cyan-300 flex items-center gap-1.5">
                    🏢 Assign Operating Branch (Scope Isolation)
                  </label>
                  <span className="text-[9px] text-cyan-400 font-semibold">Staff sees only this branch</span>
                </div>
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#162033] px-3 py-2 text-xs text-white outline-none focus:border-[#ff6325] cursor-pointer"
                  required
                >
                  <option value="" disabled>Select Branch / Outlet</option>
                  {effectiveBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name || `${branch.city} Branch`} ({branch.category || branch.city})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  💡 Indha staff login pannumbodhu indha branch-oda bookings & services mattum dhaan access panna mudiyum.
                </p>
              </div>

              {/* Sub-ID Mapping */}
              <div className="space-y-1.5 p-3.5 rounded-xl border border-[#ff6325]/20 bg-[#ff6325]/5">
                <label className="text-[10px] uppercase font-bold text-slate-300">Employee Login Email / Sub-ID</label>
                <div className="flex items-center mt-1">
                  <input
                    type="email"
                    value={subIdEmail}
                    onChange={(e) => setSubIdEmail(e.target.value)}
                    placeholder="e.g. employee@bnxmail.com"
                    className="w-full rounded-xl border border-white/10 bg-[#162033] px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#ff6325] font-mono"
                    required
                  />
                </div>
              </div>

              {/* Password Setting */}
              <div className="space-y-1.5 p-3.5 rounded-xl border border-white/10 bg-[#162033]">
                <label className="text-[10px] uppercase font-bold text-slate-300">Staff Login Passcode</label>
                <div className="flex items-center mt-1">
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter login password (e.g. pass123)"
                    className="w-full rounded-xl border border-white/10 bg-[#0f1624] px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#ff6325] font-mono"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  🔑 Staff intha passcode vachu login pannuvanga. Default: <strong className="text-white">pass123</strong>
                </p>
              </div>

              {/* Permissions Configuration */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Role-Based Feature Access</label>

                <div className="space-y-2">
                  {/* Toggle: Vitals */}
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border-brand bg-bg-tertiary/20 hover:bg-bg-tertiary/40 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400 bg-blue-400/10 p-1.5 rounded-md"><CheckCircle2 size={14} /></div>
                      <div>
                        <div className="text-xs font-bold text-text-primary">{archetypeConfig.feature1Label || 'Manage Core Operations'}</div>
                        <div className="text-[9px] text-text-secondary">{archetypeConfig.feature1Desc || 'Can view and update daily business operations and schedules.'}</div>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${permissions.canManageVitals ? 'bg-[#0a3161]' : 'bg-slate-700'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${permissions.canManageVitals ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                    {/* Hidden actual checkbox to control state */}
                    <input type="checkbox" className="hidden" checked={permissions.canManageVitals} onChange={(e) => setPermissions({ ...permissions, canManageVitals: e.target.checked })} />
                  </label>

                  {/* Toggle: Prescriptions */}
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border-brand bg-bg-tertiary/20 hover:bg-bg-tertiary/40 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="text-purple-400 bg-purple-400/10 p-1.5 rounded-md"><Plus size={14} /></div>
                      <div>
                        <div className="text-xs font-bold text-text-primary">{archetypeConfig.feature2Label || 'Advanced Reports & Billing'}</div>
                        <div className="text-[9px] text-text-secondary">{archetypeConfig.feature2Desc || 'Can view sensitive financial reports and manage billing operations.'}</div>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${permissions.canAddPrescription ? 'bg-[#0a3161]' : 'bg-slate-700'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${permissions.canAddPrescription ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={permissions.canAddPrescription} onChange={(e) => setPermissions({ ...permissions, canAddPrescription: e.target.checked })} />
                  </label>

                  {/* Toggle: Billing */}
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border-brand bg-bg-tertiary/20 hover:bg-bg-tertiary/40 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="text-emerald-400 bg-emerald-400/10 p-1.5 rounded-md"><Star size={14} /></div>
                      <div>
                        <div className="text-xs font-bold text-text-primary">View Financials & Earnings</div>
                        <div className="text-[9px] text-text-secondary">Can see revenue KPIs and billing. (Ideal for Accountants)</div>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${permissions.canManageBilling ? 'bg-[#0a3161]' : 'bg-slate-700'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${permissions.canManageBilling ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={permissions.canManageBilling} onChange={(e) => setPermissions({ ...permissions, canManageBilling: e.target.checked })} />
                  </label>

                  {/* Toggle: Appointments */}
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border-brand bg-bg-tertiary/20 hover:bg-bg-tertiary/40 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="text-amber-400 bg-amber-400/10 p-1.5 rounded-md"><Clock size={14} /></div>
                      <div>
                        <div className="text-xs font-bold text-text-primary">Manage Bookings/Appointments</div>
                        <div className="text-[9px] text-text-secondary">Can approve/cancel/check-in slots. (Ideal for Receptionists)</div>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${permissions.canManageAppointments ? 'bg-[#0a3161]' : 'bg-slate-700'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${permissions.canManageAppointments ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={permissions.canManageAppointments} onChange={(e) => setPermissions({ ...permissions, canManageAppointments: e.target.checked })} />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-text-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#ff6325]/25 cursor-pointer"
                >
                  Grant Access & Configure Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
