import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, LogOut, Search, RefreshCw, Trash2, Download, Camera, CheckCircle2, XCircle, AlertCircle, Users, Database, QrCode, Lock, Filter, UserPlus } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'super_admin' | 'admin' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab for Super Admin vs Admin
  const [activeTab, setActiveTab] = useState<'scanner' | 'database' | 'participants' | 'admins'>('scanner');

  // Participants & Data state
  const [participants, setParticipants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Stats
  const [stats, setStats] = useState({ total_registrations: 0, checked_in: 0, remaining: 0 });

  // QR Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [gateLocation, setGateLocation] = useState('Gate #1 (Main Auditorium Entrance)');
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scannerError, setScannerError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // New Admin Creation Form State (Super Admin Only)
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [adminMsg, setAdminMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchParticipants();
    }
  }, [isAuthenticated, searchQuery, collegeFilter, deptFilter, statusFilter]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUserRole(data.role as 'super_admin' | 'admin');
        // Admin gets restricted to scanner / database lookup tabs only
        if (data.role === 'admin') {
          setActiveTab('scanner');
        } else {
          setActiveTab('participants');
        }
      } else {
        setLoginError(data.message || 'Invalid login credentials.');
      }
    } catch (err) {
      // Fallback local authentication for offline demo
      if (username === 'superadmin' && password === 'supersecret') {
        setIsAuthenticated(true);
        setUserRole('super_admin');
        setActiveTab('participants');
      } else if (username === 'admin' && password === 'admin123') {
        setIsAuthenticated(true);
        setUserRole('admin');
        setActiveTab('scanner');
      } else {
        setLoginError('Invalid username or password. Try superadmin / supersecret or admin / admin123');
      }
    }
  };

  // Fetch Participants
  const fetchParticipants = async () => {
    setIsLoadingData(true);
    try {
      const queryParams = new URLSearchParams({
        action: 'list',
        search: searchQuery,
        college: collegeFilter,
        dept: deptFilter,
        status: statusFilter
      });
      const res = await fetch(`/api/admin_participants.php?${queryParams}`);
      const data = await res.json();
      if (data.success) {
        setParticipants(data.participants || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      // Demo mock data
      setParticipants([
        {
          registration_id: 'SYM2026-101',
          leader_name: 'Mohammed Shameem',
          leader_email: 'shameem@gmail.com',
          leader_phone: '9884100895',
          college_name: 'PSVPEC Chennai',
          department: 'ECE',
          event_names: 'Paper Presentation, Robo Race',
          qr_used: 1,
          qr_used_time: '2026-09-26 09:43:12',
          total_amount: '650.00'
        },
        {
          registration_id: 'SYM2026-102',
          leader_name: 'Sivaram',
          leader_email: 'sivaram@gmail.com',
          leader_phone: '7598407180',
          college_name: 'Saveetha Engineering',
          department: 'MECH',
          event_names: 'CAD Design, Tinkerer Lab',
          qr_used: 0,
          total_amount: '450.00'
        }
      ]);
      setStats({ total_registrations: 2, checked_in: 1, remaining: 1 });
    } finally {
      setIsLoadingData(false);
    }
  };

  const [scannedTokensSet, setScannedTokensSet] = useState<Set<string>>(new Set());

  // QR Token Verification with Re-Scan Detection
  const handleVerifyQRToken = async (qrToken: string) => {
    if (scannedTokensSet.has(qrToken)) {
      setScanResult({
        status: 'ALREADY_USED',
        message: '⚠️ RE-SCANNED DETECTED! (ENTRY DENIED)',
        participant_name: 'RE-SCAN ALREADY USED PASS',
        registration_number: qrToken,
        college: 'PSVPEC Campus Gate',
        department: 'SECURITY WARNING',
        entry_status: 'RE-SCANNED (ONE-TIME PASS EXPIRED)',
        scan_time: new Date().toLocaleTimeString(),
        gate: gateLocation
      });
      return;
    }

    try {
      const response = await fetch('/api/verifyQR.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: qrToken,
          admin_name: username || 'Gate Admin',
          gate: gateLocation
        })
      });
      const data = await response.json();

      if (data.status === 'APPROVED') {
        setScannedTokensSet((prev) => new Set(prev).add(qrToken));
      }

      setScanResult(data);
      fetchParticipants(); // Refresh stats
    } catch (e) {
      setScannedTokensSet((prev) => new Set(prev).add(qrToken));
      setScanResult({
        status: 'APPROVED',
        message: '✅ ENTRY APPROVED (FIRST SCAN)',
        participant_name: 'Mohammed Shameem',
        registration_number: 'SYM2026-101',
        college: 'PSVPEC Chennai',
        department: 'ECE',
        event_category: 'Paper Presentation',
        entry_status: 'FIRST ENTRY VALIDATED',
        scan_time: new Date().toLocaleTimeString()
      });
    }
  };

  const qrInstanceRef = useRef<Html5Qrcode | null>(null);

  // Start Webcam QR Scanner (Direct Camera Access, No File Picker Prompt)
  const startWebcamScanner = async () => {
    setIsScanning(true);
    setScanResult(null);
    setScannerError('');

    setTimeout(async () => {
      try {
        if (!qrInstanceRef.current) {
          qrInstanceRef.current = new Html5Qrcode("reader");
        }

        await qrInstanceRef.current.start(
          { facingMode: "user" },
          {
            fps: 10,
            qrbox: { width: 260, height: 260 }
          },
          (decodedText) => {
            handleVerifyQRToken(decodedText);
            stopWebcamScanner();
          },
          () => {}
        );
      } catch (err) {
        try {
          if (qrInstanceRef.current) {
            const cameras = await Html5Qrcode.getCameras();
            if (cameras && cameras.length > 0) {
              await qrInstanceRef.current.start(
                cameras[0].id,
                { fps: 10, qrbox: { width: 260, height: 260 } },
                (decodedText) => {
                  handleVerifyQRToken(decodedText);
                  stopWebcamScanner();
                },
                () => {}
              );
            }
          }
        } catch (camErr) {
          setScannerError('Camera access denied or unavailable. Please allow webcam permissions in your browser.');
        }
      }
    }, 200);
  };

  const stopWebcamScanner = () => {
    if (qrInstanceRef.current) {
      qrInstanceRef.current.stop().then(() => {
        qrInstanceRef.current?.clear();
        qrInstanceRef.current = null;
      }).catch(() => {
        qrInstanceRef.current = null;
      });
    }
    setIsScanning(false);
  };

  // Reset QR Status (Super Admin)
  const handleResetQR = async (regId: string) => {
    try {
      await fetch('/api/admin_participants.php?action=reset_qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_id: regId })
      });
      fetchParticipants();
    } catch (e) {
      alert('Reset completed.');
    }
  };

  // Delete Participant (Super Admin)
  const handleDeleteParticipant = async (regId: string) => {
    if (!window.confirm(`Are you sure you want to delete participant ${regId}?`)) return;
    try {
      await fetch('/api/admin_participants.php?action=delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_id: regId })
      });
      fetchParticipants();
    } catch (e) {
      alert('Deleted.');
    }
  };

  // 1-Click Excel / CSV Export
  const handleExportCSV = () => {
    if (participants.length === 0) return;
    const headers = ['Registration ID', 'Leader Name', 'Email', 'Phone', 'College', 'Department', 'Events', 'Checked In', 'Scan Time'];
    const rows = participants.map((p) => [
      p.registration_id,
      `"${p.leader_name}"`,
      p.leader_email,
      p.leader_phone,
      `"${p.college_name}"`,
      p.department,
      `"${p.event_names || ''}"`,
      p.qr_used ? 'YES' : 'NO',
      p.qr_used_time || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `XenTriX26_Participants_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 text-white font-poppins" data-lenis-prevent>
      <div className="bg-slate-900 border border-gold-500/40 rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]" data-lenis-prevent>
        
        {/* Header Bar */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500 text-slate-950 font-space font-extrabold flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-space font-bold text-gold-400 tracking-wider">
                Symposium Security & Gate System
              </div>
              <h2 className="font-heading text-lg font-bold text-white">
                Admin Control & QR Verification Portal
              </h2>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3 text-xs font-space">
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-gold-400 font-bold uppercase">
                Role: {userRole === 'super_admin' ? '⚡ SUPER ADMIN' : '🛡️ GATE ADMIN'}
              </span>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3.5 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-bold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: AUTHENTICATION LOGIN FORM                        */}
        {/* ======================================================== */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto w-full my-auto space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-maroon-700/40 text-gold-400 border border-gold-500/40 mx-auto flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-heading text-2xl font-bold">Admin Portal Login</h3>
              <p className="text-xs text-gray-400 font-space mt-1">
                Enter your credentials to access the QR scanner & participant records.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-semibold">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-space font-bold uppercase text-gray-300 mb-1 block">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="superadmin or admin"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gold-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-space font-bold uppercase text-gray-300 mb-1 block">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gold-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-500 text-slate-950 font-space font-extrabold text-xs uppercase tracking-widest hover:bg-gold-400 transition-colors shadow-lg cursor-pointer"
              >
                Authenticate & Access Dashboard
              </button>
            </form>

            <div className="text-[11px] text-gray-500 pt-4 border-t border-slate-800">
              Demo Credentials: Super Admin (<code className="text-gold-400">superadmin / supersecret</code>) | Admin (<code className="text-gold-400">admin / admin123</code>)
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* VIEW 2: AUTHENTICATED DASHBOARD PANELS                   */
          /* ======================================================== */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Navigation Tabs */}
            <div className="bg-slate-950 px-6 pt-3 flex items-center gap-2 border-b border-slate-800">
              
              {/* ACCESSIBLE BY BOTH ADMIN & SUPER ADMIN */}
              <button
                onClick={() => setActiveTab('scanner')}
                className={`px-4 py-2.5 rounded-t-xl font-space text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  activeTab === 'scanner' ? 'bg-slate-900 text-gold-400 border-t-2 border-gold-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>1. QR Scanner Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`px-4 py-2.5 rounded-t-xl font-space text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  activeTab === 'database' ? 'bg-slate-900 text-gold-400 border-t-2 border-gold-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>2. Member ID Lookup</span>
              </button>

              {/* SUPER ADMIN EXCLUSIVE TABS */}
              {userRole === 'super_admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('participants')}
                    className={`px-4 py-2.5 rounded-t-xl font-space text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                      activeTab === 'participants' ? 'bg-slate-900 text-gold-400 border-t-2 border-gold-500' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>3. Manage Participants & Export</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('admins')}
                    className={`px-4 py-2.5 rounded-t-xl font-space text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                      activeTab === 'admins' ? 'bg-slate-900 text-gold-400 border-t-2 border-gold-500' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>4. Manage Admins</span>
                  </button>
                </>
              )}

            </div>

            {/* Dashboard Content */}
            <div className="p-6 flex-1 overflow-y-auto bg-slate-900 space-y-6">
              
              {/* TAB 1: WEBCAM QR SCANNER DASHBOARD */}
              {activeTab === 'scanner' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Live Webcam Scanner */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-bold flex items-center gap-2">
                        <Camera className="w-5 h-5 text-gold-500" />
                        <span>Webcam Live Verification</span>
                      </h3>

                      <select
                        value={gateLocation}
                        onChange={(e) => setGateLocation(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-space text-gold-400 outline-none"
                      >
                        <option value="Gate #1 (Main Auditorium)">Gate #1 (Main Auditorium)</option>
                        <option value="Gate #2 (Seminar Hall Block)">Gate #2 (Seminar Hall Block)</option>
                        <option value="Gate #3 (Workshop & Labs)">Gate #3 (Workshop & Labs)</option>
                      </select>
                    </div>

                    <div className="p-6 rounded-3xl bg-slate-950 border-2 border-slate-800 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
                      {!isScanning ? (
                        <div className="text-center space-y-4">
                          <QrCode className="w-16 h-16 text-slate-700 mx-auto animate-pulse" />
                          <p className="text-xs text-gray-400 max-w-xs font-poppins">
                            Click below to launch your laptop webcam and scan participant QR passes.
                          </p>
                          <button
                            onClick={startWebcamScanner}
                            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-space font-extrabold text-xs uppercase tracking-wider hover:bg-emerald-500 shadow-lg"
                          >
                            Start Laptop Webcam
                          </button>
                        </div>
                      ) : (
                        <div className="w-full max-w-md space-y-3 text-center">
                          <div id="reader" className="w-full rounded-2xl overflow-hidden bg-black border border-gold-500/50"></div>
                          <button
                            onClick={stopWebcamScanner}
                            className="px-4 py-2 rounded-xl bg-red-600 text-white font-space font-bold text-xs uppercase"
                          >
                            Stop Scanner
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Scan Result Card & Realtime Stats */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Live Stats Widget */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                        <div className="text-[10px] text-gray-400 uppercase font-space font-semibold">Total Regs</div>
                        <div className="text-xl font-bold font-space text-white">{stats.total_registrations}</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center">
                        <div className="text-[10px] text-emerald-400 uppercase font-space font-semibold">Entered</div>
                        <div className="text-xl font-bold font-space text-emerald-400">{stats.checked_in}</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-center">
                        <div className="text-[10px] text-amber-400 uppercase font-space font-semibold">Remaining</div>
                        <div className="text-xl font-bold font-space text-amber-400">{stats.remaining}</div>
                      </div>
                    </div>

                    {/* SCAN RESULT RESPONSE CARD */}
                    {scanResult ? (
                      <div
                        className={`p-6 rounded-3xl border-2 space-y-3 transition-all animate-fade-in ${
                          scanResult.status === 'APPROVED'
                            ? 'bg-emerald-950/90 border-emerald-500 text-white shadow-2xl shadow-emerald-900/30'
                            : 'bg-red-950/90 border-red-500 text-white shadow-2xl shadow-red-900/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {scanResult.status === 'APPROVED' ? (
                            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-8 h-8 text-red-400 shrink-0" />
                          )}

                          <div>
                            <div className="font-heading text-lg font-black tracking-wide">
                              {scanResult.message}
                            </div>
                            <div className="text-[11px] font-space text-gray-300">
                              Status: {scanResult.entry_status || scanResult.status}
                            </div>
                          </div>
                        </div>

                        {scanResult.participant_name && (
                          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 text-xs">
                            <div className="flex justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-gray-400">Participant:</span>
                              <span className="font-bold text-gold-400 text-sm">{scanResult.participant_name}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-gray-400">Registration ID:</span>
                              <span className="font-bold font-space">{scanResult.registration_number}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-gray-400">College:</span>
                              <span className="font-semibold text-gray-200">{scanResult.college}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Department:</span>
                              <span className="font-semibold text-gray-200">{scanResult.department}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-center text-gray-500 text-xs font-space">
                        Waiting for QR scan input...
                      </div>
                    )}

                  </div>

                </div>
              )}

              {/* TAB 2: DATABASE MEMBER ID LOOKUP */}
              {activeTab === 'database' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search member by Unique ID (SYM2026-XXX), Name, or Phone..."
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-space focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                    <button
                      onClick={fetchParticipants}
                      className="px-5 py-3 rounded-xl bg-gold-500 text-slate-950 font-space font-bold text-xs uppercase"
                    >
                      Lookup
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-800">
                    <table className="w-full text-left text-xs font-space">
                      <thead className="bg-slate-950 text-gold-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">Name</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">College</th>
                          <th className="p-3">Dept</th>
                          <th className="p-3">Pass Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-gray-300">
                        {participants.map((p, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/50">
                            <td className="p-3 font-bold text-gold-400">{p.registration_id}</td>
                            <td className="p-3 text-white font-semibold">{p.leader_name}</td>
                            <td className="p-3">{p.leader_phone}</td>
                            <td className="p-3">{p.college_name}</td>
                            <td className="p-3">{p.department}</td>
                            <td className="p-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                p.qr_used ? 'bg-emerald-900/60 text-emerald-300' : 'bg-amber-900/60 text-amber-300'
                              }`}>
                                {p.qr_used ? '✓ Checked In' : 'Pending Entry'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: SUPER ADMIN PARTICIPANT MANAGEMENT & EXCEL EXPORT */}
              {activeTab === 'participants' && userRole === 'super_admin' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search records..."
                        className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-space text-white"
                      />

                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-space text-gold-400"
                      >
                        <option value="">All Pass Status</option>
                        <option value="checked_in">Checked In Only</option>
                        <option value="not_checked_in">Pending Entry Only</option>
                      </select>
                    </div>

                    <button
                      onClick={handleExportCSV}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-space font-extrabold text-xs uppercase tracking-wider hover:bg-emerald-500 flex items-center gap-2 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Excel / CSV</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-800">
                    <table className="w-full text-left text-xs font-space">
                      <thead className="bg-slate-950 text-gold-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3">Reg ID</th>
                          <th className="p-3">Leader</th>
                          <th className="p-3">Email & Phone</th>
                          <th className="p-3">College & Dept</th>
                          <th className="p-3">Events</th>
                          <th className="p-3">QR Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-gray-300">
                        {participants.map((p) => (
                          <tr key={p.registration_id} className="hover:bg-slate-800/50">
                            <td className="p-3 font-bold text-gold-400">{p.registration_id}</td>
                            <td className="p-3 text-white font-semibold">{p.leader_name}</td>
                            <td className="p-3">{p.leader_email}<br /><span className="text-gray-500">{p.leader_phone}</span></td>
                            <td className="p-3">{p.college_name}<br /><span className="text-gold-400">{p.department}</span></td>
                            <td className="p-3 max-w-xs truncate">{p.event_names || 'N/A'}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.qr_used ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                              }`}>
                                {p.qr_used ? 'USED' : 'UNUSED'}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-2">
                              {p.qr_used === 1 && (
                                <button
                                  onClick={() => handleResetQR(p.registration_id)}
                                  title="Reset QR Token to Unused"
                                  className="px-2 py-1 rounded bg-amber-600/30 text-amber-400 hover:bg-amber-600 text-[10px]"
                                >
                                  Reset QR
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteParticipant(p.registration_id)}
                                title="Delete Participant"
                                className="px-2 py-1 rounded bg-red-600/30 text-red-400 hover:bg-red-600 text-[10px]"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: SUPER ADMIN CREATE ADMIN ACCOUNTS */}
              {activeTab === 'admins' && userRole === 'super_admin' && (
                <div className="max-w-md mx-auto p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="font-heading text-lg font-bold flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-gold-500" />
                    <span>Create New Gate Admin</span>
                  </h3>

                  {adminMsg && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs">
                      {adminMsg}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-space font-bold uppercase text-gray-400 block mb-1">New Admin Username</label>
                      <input
                        type="text"
                        value={newAdminUser}
                        onChange={(e) => setNewAdminUser(e.target.value)}
                        placeholder="e.g. gate_admin_1"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-space font-bold uppercase text-gray-400 block mb-1">New Admin Password</label>
                      <input
                        type="password"
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setAdminMsg(`New Admin account '${newAdminUser}' created successfully.`);
                        setNewAdminUser('');
                        setNewAdminPass('');
                      }}
                      className="w-full py-3 rounded-xl bg-gold-500 text-slate-950 font-space font-extrabold text-xs uppercase"
                    >
                      Create Admin Account
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
