import React, { useState, useEffect } from 'react';
import { authAPI, geoAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const ROLE_META = {
  MEMBER:          { label: 'Member',         roleValue: 'MEMBER'    },
  DONOR:           { label: 'Donor',          roleValue: 'DONOR'     },
  FIELD_ASSOCIATE: { label: 'Field Associate', roleValue: 'ASSOCIATE' },
  DISTRICT_ADMIN:  { label: 'District Admin', roleValue: 'ADMIN'     },
};

const EMPTY_FORM = {
  name: '', phone: '', email: '', password: '',
  districtId: '', blockId: '', associateId: '',
};

// ─── small helpers ────────────────────────────────────────────────────────────
function InfoCell({ label, value, mono, color }) {
  const colorMap = { violet: 'text-violet-700', emerald: 'text-emerald-700', sky: 'text-sky-700', slate: 'text-slate-800' };
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
      <p className={`text-sm font-semibold break-all ${mono ? 'font-mono' : ''} ${colorMap[color] || colorMap.slate}`}>
        {value || '—'}
      </p>
    </div>
  );
}

export default function ManageMembers({ currentViewRole }) {
  const { user: authUser } = useAuth();
  const actorRole = authUser?.role || 'SUPER_ADMIN'; // SUPER_ADMIN | ADMIN | ASSOCIATE

  const meta = ROLE_META[currentViewRole] || { label: 'User', roleValue: currentViewRole };

  // Only show associate cascade for MEMBER/DONOR creation by Admin/SuperAdmin
  const showAssociateCascade =
    (meta.roleValue === 'MEMBER' || meta.roleValue === 'DONOR') &&
    (actorRole === 'ADMIN' || actorRole === 'SUPER_ADMIN');

  // Associate sees only their own members — no cascade needed
  const isAssociate = actorRole === 'ASSOCIATE';

  const [users,        setUsers]        = useState([]);
  const [search,       setSearch]       = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddingNew,  setIsAddingNew]  = useState(false);
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [districts,    setDistricts]    = useState([]);
  const [blocks,       setBlocks]       = useState([]);
  const [associates,   setAssociates]   = useState([]);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState('');
  const [successMsg,   setSuccessMsg]   = useState('');

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  // ── Fetch user list ────────────────────────────────────────────────────────
  const loadUsers = () => {
    setUsers([]);
    // If associate, only fetch their own members (backend also enforces this)
    const associateIdParam = isAssociate ? (authUser?._id || authUser?.id) : undefined;
    authAPI.getUsers(meta.roleValue, undefined, associateIdParam)
      .then(({ data }) => {
        const list = (data.data || []).map((u) => ({
          ...u,
          district: u.districtId?.name || '—',
          block:    u.blockId?.name    || '—',
          associateName: u.associateId?.name || '—',
        }));
        setUsers(list);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load users. Check your connection.');
      });
  };

  useEffect(() => { loadUsers(); }, [currentViewRole, meta.roleValue]);

  // ── Districts (needed for cascade and for ADMIN/ASSOCIATE creation) ─────────
  useEffect(() => {
    const needsDistrict = showAssociateCascade || isAssociate ||
      meta.roleValue === 'ASSOCIATE' || meta.roleValue === 'ADMIN';
    if (!needsDistrict) return;
    geoAPI.getDistricts()
      .then(({ data }) => setDistricts(data.data || []))
      .catch(() => {});
  }, [showAssociateCascade, isAssociate, meta.roleValue]);

  // ── Blocks cascade from district ──────────────────────────────────────────
  useEffect(() => {
    // Load blocks when: Admin/SuperAdmin cascade OR Associate adding a member
    const shouldLoadBlocks = showAssociateCascade || isAssociate;
    if (!shouldLoadBlocks || !form.districtId) { setBlocks([]); return; }
    geoAPI.getBlocks(form.districtId)
      .then(({ data }) => setBlocks(data.data || []))
      .catch(() => setBlocks([]));
  }, [form.districtId, showAssociateCascade, isAssociate]);

  // ── Associates cascade from block ─────────────────────────────────────────
  useEffect(() => {
    if (!showAssociateCascade || !form.blockId) { setAssociates([]); return; }
    geoAPI.getAssociatesByBlock(form.blockId)
      .then(({ data }) => setAssociates(data.data || []))
      .catch(() => setAssociates([]));
  }, [form.blockId, showAssociateCascade]);

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.district?.toLowerCase().includes(search.toLowerCase()) ||
    u.memberId?.toLowerCase().includes(search.toLowerCase()) ||
    u.donorId?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = filtered.filter((u) => u.status === 'active').length;

  // ── Create ─────────────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.password) {
      setError('Name, phone and password are required.');
      return;
    }
    // For associate cascade: district + block + associate required
    if (showAssociateCascade && (!form.districtId || !form.blockId || !form.associateId)) {
      setError('Please select district, block and associate.');
      return;
    }
    // For associate self-creation: district + block required (associate auto-set by backend)
    if (isAssociate && (!form.districtId || !form.blockId)) {
      setError('District and block are required.');
      return;
    }
    // For ADMIN/ASSOCIATE role creation: only district required (no block)
    if ((meta.roleValue === 'ADMIN' || meta.roleValue === 'ASSOCIATE') && !form.districtId) {
      setError('District is required.');
      return;
    }    setSubmitting(true);
    setError('');
    try {
      await authAPI.adminRegister({
        name:        form.name,
        phone:       form.phone,
        email:       form.email || undefined,
        password:    form.password,
        role:        meta.roleValue,
        districtId:  form.districtId  || undefined,
        // blockId only relevant for MEMBER/DONOR, not for ADMIN/ASSOCIATE
        blockId:     (meta.roleValue !== 'ADMIN' && meta.roleValue !== 'ASSOCIATE')
                       ? (form.blockId || undefined)
                       : undefined,
        associateId: showAssociateCascade ? form.associateId : undefined,
      });
      showSuccess(`${meta.label} registered successfully.`);
      setForm(EMPTY_FORM);
      setIsAddingNew(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle status ──────────────────────────────────────────────────────────
  const handleToggleStatus = async (userId) => {
    try {
      const { data } = await authAPI.toggleUserStatus(userId);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, status: data.data.status } : u));
      if (selectedUser?._id === userId) setSelectedUser((p) => ({ ...p, status: data.data.status }));
      showSuccess(`Status updated to ${data.data.status}.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Status update failed.');
    }
  };

  // ── Password reset ─────────────────────────────────────────────────────────
  const handlePasswordReset = async (userId, userName) => {
    const newPass = prompt(`Enter new password for ${userName}:`);
    if (!newPass) return;
    try {
      await authAPI.adminResetPassword(userId, newPass);
      showSuccess(`Password reset for ${userName}.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed.');
    }
  };

  // ── Form district/block reset helpers ─────────────────────────────────────
  const onDistrictChange = (districtId) =>
    setForm((f) => ({ ...f, districtId, blockId: '', associateId: '' }));
  const onBlockChange = (blockId) =>
    setForm((f) => ({ ...f, blockId, associateId: '' }));

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Feedback */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl flex items-center justify-between">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 ml-3">✕</button>
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-4 py-3 rounded-xl">
          {successMsg}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative w-full sm:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={`Search ${meta.label}s...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition"
          />
        </div>
        <button
          onClick={() => { setIsAddingNew(true); setSelectedUser(null); setError(''); setForm(EMPTY_FORM); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add {meta.label}
        </button>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">{meta.label} Directory</p>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {activeCount} active / {filtered.length} total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">District / Block</th>
                  {(meta.roleValue === 'MEMBER' || meta.roleValue === 'DONOR') && !isAssociate && (
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Associate</th>
                  )}
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length > 0 ? filtered.map((u) => (
                  <tr key={u._id} className={`hover:bg-slate-50/60 transition-colors ${selectedUser?._id === u._id ? 'bg-violet-50/40' : ''}`}>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{u.name}</p>
                      {u.employeeId && <p className="text-xs text-violet-600 font-mono mt-0.5">{u.employeeId}</p>}
                      {u.memberId   && <p className="text-xs text-emerald-600 font-mono mt-0.5">{u.memberId}</p>}
                      {u.donorId    && <p className="text-xs text-sky-600 font-mono mt-0.5">{u.donorId}</p>}
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{u._id?.slice(-8)}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-700 text-sm">{u.district}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{u.block}</p>
                    </td>
                    {(meta.roleValue === 'MEMBER' || meta.roleValue === 'DONOR') && !isAssociate && (
                      <td className="py-3.5 px-4 text-slate-600 text-sm">{u.associateName}</td>
                    )}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                        u.status === 'active'
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : 'bg-amber-50 border-amber-100 text-amber-600'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {u.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400 text-sm">
                      {users.length === 0
                        ? `No ${meta.label.toLowerCase()}s registered yet. Add one to get started.`
                        : `No results for "${search}".`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel — desktop */}
        <div className="lg:col-span-5 hidden lg:block">
          {selectedUser ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.name}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedUser._id}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <InfoCell label="Phone"    value={selectedUser.phone} />
                  <InfoCell label="Email"    value={selectedUser.email} />
                  <InfoCell label="District" value={selectedUser.district} />
                  <InfoCell label="Block"    value={selectedUser.block} />
                  <InfoCell label="Status"   value={selectedUser.status} />
                  <InfoCell label="Membership ID" value={selectedUser.membershipId || 'N/A'} />
                  {selectedUser.memberId   && <InfoCell label="Member ID"   value={selectedUser.memberId}   mono color="emerald" />}
                  {selectedUser.donorId    && <InfoCell label="Donor ID"    value={selectedUser.donorId}    mono color="sky"     />}
                  {selectedUser.employeeId && <InfoCell label="Employee ID" value={selectedUser.employeeId} mono color="violet"  />}
                  {selectedUser.associateName && selectedUser.associateName !== '—' && (
                    <InfoCell label="Under Associate" value={selectedUser.associateName} />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(selectedUser._id)}
                    className={`flex-1 text-sm font-medium py-2 rounded-lg border transition-colors ${
                      selectedUser.status === 'active'
                        ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-100'
                        : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-100'
                    }`}
                  >
                    {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handlePasswordReset(selectedUser._id, selectedUser.name)}
                    className="flex-1 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-100 py-2 rounded-lg transition-colors"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-medium text-slate-500 mb-1">Total {meta.label}s</p>
                <p className="text-2xl font-bold text-slate-800">{users.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-medium text-slate-500 mb-1">Active</p>
                <p className="text-2xl font-bold text-emerald-600">{users.filter((u) => u.status === 'active').length}</p>
              </div>
              {isAssociate && (
                <div className="bg-violet-600 rounded-xl p-4 text-white">
                  <p className="text-xs font-semibold text-violet-200 mb-1">Your Members</p>
                  <p className="text-xs text-violet-100 leading-relaxed">
                    You are viewing only the members assigned under your account. New members you create will be automatically linked to you.
                  </p>
                </div>
              )}
              {!isAssociate && (
                <div className="bg-slate-800 rounded-xl p-4 text-white">
                  <p className="text-xs font-semibold text-slate-400 mb-1">Quick Tip</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Click "View" on any row to see full profile. When creating a Member, select District → Block → Associate to assign them correctly.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Add User Modal ── */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddingNew(false)} />
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Add New {meta.label}</h4>
                {isAssociate && (
                  <p className="text-xs text-violet-600 mt-0.5">Will be assigned under your account automatically</p>
                )}
              </div>
              <button onClick={() => setIsAddingNew(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 overflow-y-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3 py-2 rounded-lg">{error}</div>
              )}

              {/* Basic info */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Full Name *</label>
                <input required type="text" placeholder="e.g. Satish Kumar"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Phone *</label>
                  <input required type="text" placeholder="10-digit number"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Email</label>
                  <input type="email" placeholder="name@domain.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
              </div>

              {/* ── Location fields ── */}
              {/* Associate actor creating Member/Donor: district + block (auto-assigned to self) */}
              {/* Admin/SuperAdmin creating Member/Donor: district + block + associate cascade */}
              {/* Admin/SuperAdmin creating ASSOCIATE or ADMIN: district only (no block) */}

              {(isAssociate || showAssociateCascade || meta.roleValue === 'ASSOCIATE' || meta.roleValue === 'ADMIN') && (
                <div className="space-y-3">
                  {showAssociateCascade && (
                    <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">
                      <svg className="w-4 h-4 text-violet-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-violet-700">Select District → Block → Associate to assign this {meta.label}.</p>
                    </div>
                  )}

                  {/* District — always shown */}
                  <div className={`grid gap-3 ${(isAssociate || showAssociateCascade) ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">District *</label>
                      <select
                        required
                        value={form.districtId}
                        onChange={(e) => onDistrictChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        <option value="">Select district...</option>
                        {districts.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                      </select>
                    </div>

                    {/* Block — only for Member/Donor creation (not for ASSOCIATE or ADMIN) */}
                    {(isAssociate || showAssociateCascade) && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600">Block *</label>
                        <select
                          required
                          value={form.blockId}
                          onChange={(e) => onBlockChange(e.target.value)}
                          disabled={!form.districtId}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                        >
                          <option value="">Select block...</option>
                          {blocks.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Associate — only for Admin/SuperAdmin creating Member/Donor */}
                  {showAssociateCascade && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">Assign to Associate *</label>
                      <select
                        required
                        value={form.associateId}
                        onChange={(e) => setForm({ ...form, associateId: e.target.value })}
                        disabled={!form.blockId}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
                      >
                        <option value="">
                          {!form.blockId
                            ? 'Select a block first...'
                            : associates.length === 0
                            ? 'No associates assigned to this block'
                            : 'Select associate...'}
                        </option>
                        {associates.map((a) => (
                          <option key={a._id} value={a._id}>
                            {a.name}{a.employeeId ? ` (${a.employeeId})` : ''}
                          </option>
                        ))}
                      </select>
                      {form.blockId && associates.length === 0 && (
                        <p className="text-xs text-amber-600 mt-1">
                          ⚠ No associates are assigned to this block yet. Assign one first from Locations → Assign Associate.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Password *</label>
                <input required type="password" placeholder="Initial password"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddingNew(false)}
                  className="flex-1 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-[2] text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded-lg transition-colors disabled:opacity-50">
                  {submitting ? 'Registering...' : `Register ${meta.label}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Mobile profile modal ── */}
      {selectedUser && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl z-10 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">{selectedUser.name}</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedUser._id}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-sm">
                <p className="text-slate-600"><span className="font-medium text-slate-500">Phone:</span> {selectedUser.phone}</p>
                <p className="text-slate-600"><span className="font-medium text-slate-500">Email:</span> {selectedUser.email || '—'}</p>
                <p className="text-slate-600"><span className="font-medium text-slate-500">District:</span> {selectedUser.district}</p>
                <p className="text-slate-600"><span className="font-medium text-slate-500">Block:</span> {selectedUser.block}</p>
                <p className="text-slate-600"><span className="font-medium text-slate-500">Status:</span> {selectedUser.status}</p>
                {selectedUser.associateName && selectedUser.associateName !== '—' && (
                  <p className="text-slate-600"><span className="font-medium text-slate-500">Associate:</span> {selectedUser.associateName}</p>
                )}
                {selectedUser.employeeId && (
                  <p className="text-violet-700 font-mono font-semibold"><span className="font-medium text-slate-500 font-sans">Employee ID:</span> {selectedUser.employeeId}</p>
                )}
                {selectedUser.memberId && (
                  <p className="text-emerald-700 font-mono font-semibold"><span className="font-medium text-slate-500 font-sans">Member ID:</span> {selectedUser.memberId}</p>
                )}
                {selectedUser.donorId && (
                  <p className="text-sky-700 font-mono font-semibold"><span className="font-medium text-slate-500 font-sans">Donor ID:</span> {selectedUser.donorId}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { handleToggleStatus(selectedUser._id); setSelectedUser(null); }}
                  className={`flex-1 text-sm font-medium py-2 rounded-lg border transition-colors ${
                    selectedUser.status === 'active'
                      ? 'text-amber-600 bg-amber-50 border-amber-100'
                      : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                  }`}
                >
                  {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => { handlePasswordReset(selectedUser._id, selectedUser.name); setSelectedUser(null); }}
                  className="flex-1 text-sm font-medium text-violet-600 bg-violet-50 border border-violet-100 py-2 rounded-lg transition-colors"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
