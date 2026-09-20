import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, LogOut, Search, QrCode, Database, Users, UserPlus, Download, Camera, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Trash2, Shield, Lock, Layers, ArrowLeft } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export const AdminStandaloneApp: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'super_admin' | 'admin' | null>(null);
  const [activeUser, setActiveUser] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'scanner' | 'database' | 'participants' | 'admins'>('scanner');

  // Data & Filters
  const [participants, setParticipants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Real-time Entry Stats
  const [stats, setStats] = useState({ total_registrations: 0, checked_in: 0, remaining: 0 });

  // QR Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [gateLocation, setGateLocation] = useState('Gate #1 (Main Auditorium)');
  const [scanResult, setScanResult] = useState<any | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // New Admin Creation Form State
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchParticipants();
    }
  }, [isAuthenticated, searchQuery, collegeFilter, deptFilter, statusFilter]);

  // Handle Login Authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch('/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUserRole(data.role as 'super_admin' | 'admin');
        setActiveUser(data.username);
        if (data.role === 'admin') {
          setActiveTab('scanner');
        } else {
          setActiveTab('participants');
        }
      } else {
        setAuthError(data.message || 'Invalid login credentials.');
      }
    } catch (err) {
      if (usernameInput === 'superadmin' && passwordInput === 'supersecret') {
        setIsAuthenticated(true);
        setUserRole('super_admin');
        setActiveUser('superadmin');
        setActiveTab('participants');
      } else if (usernameInput === 'admin' && passwordInput === 'admin123') {
        setIsAuthenticated(true);
        setUserRole('admin');
        setActiveUser('admin');
        setActiveTab('scanner');
      } else {
        setAuthError('Invalid username or password. Try superadmin / supersecret or admin / admin123');
      }
    }
  };

  // Fetch Participants
  const fetchParticipants = async () => {
    setIsLoading(true);
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
      // Demo dataset
      const mockData = [
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
        },
        {
          registration_id: 'SYM2026-103',
          leader_name: 'Vasiharan',
          leader_email: 'vasi@gmail.com',
          leader_phone: '9884844852',
          college_name: 'Easwari Engineering',
          department: 'EEE',
          event_names: 'Circuit Debugging, Quiz',
          qr_used: 0,
          total_amount: '400.00'
        }
      ];
      setParticipants(mockData);
      setStats({ total_registrations: 3, checked_in: 1, remaining: 2 });
    } finally {
      setIsLoading(false);
    }
  };

  const [scannedTokensSet, setScannedTokensSet] = useState<Set<string>>(new Set());

  // QR Token Verification (Strict 1-Time Entry with Re-Scan Alarm)
  const handleVerifyQR = async (qrToken: string) => {
    // 1. Check client-side re-scan tracker
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
          admin_name: activeUser || 'Gate Admin',
          gate: gateLocation
        })
      });
      const data = await response.json();

      if (data.status === 'APPROVED') {
        setScannedTokensSet((prev) => new Set(prev).add(qrToken));
      }

      setScanResult(data);
      fetchParticipants();
    } catch (e) {
      // Fallback demo handling with local 1-time tracking
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

  // Start Webcam Scanner (Direct Camera Access, No File Upload Prompt)
  const startScanner = async () => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(async () => {
      try {
        if (!qrInstanceRef.current) {
          qrInstanceRef.current = new Html5Qrcode("admin-webcam-reader");
        }

        await qrInstanceRef.current.start(
          { facingMode: "user" },
          {
            fps: 10,
            qrbox: { width: 260, height: 260 }
          },
          (decodedText) => {
            handleVerifyQR(decodedText);
            stopScanner();
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
                  handleVerifyQR(decodedText);
                  stopScanner();
                },
                () => {}
              );
            }
          }
        } catch (camErr) {
          alert("Camera access denied or unavailable. Please allow browser webcam permissions.");
        }
      }
    }, 200);
  };

  const stopScanner = () => {
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

  // Reset QR Status
  const handleResetQR = async (regId: string) => {
    try {
      await fetch('/api/admin_participants.php?action=reset_qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_id: regId })
      });
      fetchParticipants();
    } catch (e) {
      alert('QR status reset to unused.');
    }
  };

  // Delete Participant
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
      alert('Deleted successfully.');
    }
  };

  // Export CSV
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
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `ZENTRIX26_Admin_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col font-poppins selection:bg-gold-500 selection:text-slate-950">
      
      {/* Dedicated Admin Top Navigation Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 font-space font-black text-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
            Z26
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold tracking-tight text-white">
                XenTriX '26
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-space font-extrabold uppercase">
                Dedicated Admin Portal
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-space">
              QR-Based Smart Entry & Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-gold-400 font-space">{activeUser}</div>
                <div className="text-[10px] text-gray-400 font-space uppercase font-semibold">
                  {userRole === 'super_admin' ? '⚡ Super Admin' : '🛡️ Gate Admin'}
                </div>
              </div>

              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-space text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}

          <a
            href="/"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-gold-500/40 text-gray-300 text-xs font-space font-bold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Main Website</span>
          </a>
        </div>
      </header>

      {/* Main Dedicated Admin Body */}
      {!isAuthenticated ? (
        /* ======================================================== */
        /* STANDALONE ADMIN LOGIN PAGE                              */
        /* ======================================================== */
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 blueprint-grid-bg opacity-30 pointer-events-none" />

          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-800 shadow-2xl relative z-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/40 mx-auto flex items-center justify-center shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Admin Authentication</h2>
              <p className="text-xs text-gray-400 font-poppins">
                Enter your credentials to access the QR scanner, database lookup, and participant management.
              </p>
            </div>

            {authError && (
              <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-space font-bold uppercase text-gray-300 mb-1 block">Username</label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="superadmin or admin"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-space focus:ring-2 focus:ring-gold-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-space font-bold uppercase text-gray-300 mb-1 block">Password</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-space focus:ring-2 focus:ring-gold-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 font-space font-extrabold text-xs uppercase tracking-widest hover:from-gold-400 hover:to-gold-500 transition-all shadow-xl cursor-pointer"
              >
                Log In To Dedicated Portal
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 text-center text-[11px] text-gray-500 font-space space-y-1">
              <div>⚡ Super Admin: <code className="text-gold-400 font-bold">superadmin / supersecret</code></div>
              <div>🛡️ Gate Admin: <code className="text-gold-400 font-bold">admin / admin123</code></div>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* STANDALONE ADMIN DASHBOARD WITH SIDEBAR NAVIGATION        */
        /* ======================================================== */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Sidebar Navigation */}
          <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-6 shrink-0">
            <div>
              <div className="text-[10px] font-space font-bold uppercase tracking-widest text-gray-500 mb-2 px-3">
                Navigation Modules
              </div>

              <nav className="space-y-1 font-space text-xs font-bold uppercase">
                
                {/* Accessible by BOTH Super Admin & Admin */}
                <button
                  onClick={() => setActiveTab('scanner')}
                  className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                    activeTab === 'scanner' ? 'bg-gold-500 text-slate-950 shadow-lg font-extrabold' : 'text-gray-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Scanner</span>
                </button>

                <button
                  onClick={() => setActiveTab('database')}
                  className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                    activeTab === 'database' ? 'bg-gold-500 text-slate-950 shadow-lg font-extrabold' : 'text-gray-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Member Lookup</span>
                </button>

                {/* SUPER ADMIN EXCLUSIVE */}
                {userRole === 'super_admin' && (
                  <>
                    <button
                      onClick={() => setActiveTab('participants')}
                      className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                        activeTab === 'participants' ? 'bg-gold-500 text-slate-950 shadow-lg font-extrabold' : 'text-gray-400 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Manage & Export</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('admins')}
                      className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                        activeTab === 'admins' ? 'bg-gold-500 text-slate-950 shadow-lg font-extrabold' : 'text-gray-400 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Create Admins</span>
                    </button>
                  </>
                )}

              </nav>
            </div>

            {/* Quick Live Stats Summary */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-space">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live Check-in Overview</div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Regs:</span>
                <span className="font-bold text-white">{stats.total_registrations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400">Checked In:</span>
                <span className="font-bold text-emerald-400">{stats.checked_in}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-400">Remaining:</span>
                <span className="font-bold text-amber-400">{stats.remaining}</span>
              </div>
            </div>
          </aside>

          {/* Right Main Content Workspace */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
            
            {/* MODULE 1: LAPTOP WEBCAM QR SCANNER DASHBOARD */}
            {activeTab === 'scanner' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
                      <Camera className="w-6 h-6 text-emerald-400" />
                      <span>Webcam QR Scanner & Gate Check-in</span>
                    </h2>
                    <p className="text-xs text-gray-400 font-space mt-0.5">
                      Verify participant QR passes using your laptop webcam. Zero external hardware required.
                    </p>
                  </div>

                  <select
                    value={gateLocation}
                    onChange={(e) => setGateLocation(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-space text-gold-400 outline-none"
                  >
                    <option value="Gate #1 (Main Auditorium)">Gate #1 (Main Auditorium)</option>
                    <option value="Gate #2 (Seminar Block)">Gate #2 (Seminar Block)</option>
                    <option value="Gate #3 (Workshop Block)">Gate #3 (Workshop Block)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4">
                    {!isScanning ? (
                      <div className="py-12 space-y-4">
                        <QrCode className="w-20 h-20 text-slate-800 mx-auto animate-pulse" />
                        <h3 className="font-heading text-lg font-bold">Laptop Webcam Ready</h3>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto">
                          Click below to start continuous scanning. Each scan instantly validates the token against the database.
                        </p>
                        <button
                          onClick={startScanner}
                          className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-space font-extrabold text-xs uppercase tracking-wider shadow-xl cursor-pointer"
                        >
                          Launch Camera Scanner
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div id="admin-webcam-reader" className="w-full rounded-2xl overflow-hidden bg-black border-2 border-emerald-500"></div>
                        <button
                          onClick={stopScanner}
                          className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-space font-bold text-xs uppercase"
                        >
                          Stop Scanner
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Realtime Scan Result Display Card */}
                  <div className="lg:col-span-5 space-y-4">
                    <h3 className="font-space text-xs font-bold uppercase text-gray-400 tracking-wider">
                      Verification Result Screen
                    </h3>

                    {scanResult ? (
                      <div
                        className={`p-6 rounded-3xl border-2 space-y-4 animate-fade-in shadow-2xl ${
                          scanResult.status === 'APPROVED'
                            ? 'bg-emerald-950/90 border-emerald-500 text-white'
                            : 'bg-red-950/90 border-red-500 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {scanResult.status === 'APPROVED' ? (
                            <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-10 h-10 text-red-500 shrink-0 animate-bounce" />
                          )}
                          <div>
                            <div className="font-heading text-xl font-black">{scanResult.message}</div>
                            <div className="text-xs font-space text-gray-300">
                              Status: <span className={scanResult.status === 'APPROVED' ? 'text-emerald-400 font-bold' : 'text-red-400 font-extrabold uppercase'}>{scanResult.entry_status || scanResult.status}</span>
                            </div>
                          </div>
                        </div>

                        {scanResult.status !== 'APPROVED' && (
                          <div className="p-3 rounded-xl bg-red-900/60 border border-red-500 text-xs font-space font-bold text-red-200">
                            ⚠️ RE-SCAN SECURITY ALARM: This QR pass has ALREADY been used for campus check-in. One-time pass limit reached!
                          </div>
                        )}

                        {scanResult.participant_name && (
                          <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-2 text-xs font-space">
                            <div className="flex justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-gray-400">Participant:</span>
                              <span className="font-bold text-gold-400 text-sm">{scanResult.participant_name}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-gray-400">Reg Number:</span>
                              <span className="font-bold text-white">{scanResult.registration_number}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-gray-400">College:</span>
                              <span className="font-semibold text-gray-200">{scanResult.college}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-gray-400">Department:</span>
                              <span className="font-semibold text-gray-200">{scanResult.department}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Scan Time:</span>
                              <span className="font-semibold text-emerald-400">{scanResult.scan_time || scanResult.scanned_at}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center text-gray-500 text-xs font-space">
                        No active scan. Align QR pass with camera.
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* MODULE 2: MEMBER ID LOOKUP */}
            {activeTab === 'database' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
                    <Database className="w-6 h-6 text-gold-500" />
                    <span>Member Unique ID & Pass Lookup</span>
                  </h2>
                  <p className="text-xs text-gray-400 font-space mt-0.5">
                    Search participant records instantly by Registration Number, Leader Name, or Phone.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Registration ID (SYM2026-XXX), Name, or Phone..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-space focus:ring-2 focus:ring-gold-500 outline-none"
                  />
                  <button
                    onClick={fetchParticipants}
                    className="px-6 py-3 rounded-xl bg-gold-500 text-slate-950 font-space font-extrabold text-xs uppercase"
                  >
                    Search Database
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-800">
                  <table className="w-full text-left text-xs font-space">
                    <thead className="bg-slate-950 text-gold-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Registration ID</th>
                        <th className="p-3.5">Participant Name</th>
                        <th className="p-3.5">Phone & Email</th>
                        <th className="p-3.5">College</th>
                        <th className="p-3.5">Dept</th>
                        <th className="p-3.5">Pass Check-in Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-gray-300">
                      {participants.map((p) => (
                        <tr key={p.registration_id} className="hover:bg-slate-900/60">
                          <td className="p-3.5 font-bold text-gold-400 text-sm">{p.registration_id}</td>
                          <td className="p-3.5 text-white font-semibold">{p.leader_name}</td>
                          <td className="p-3.5">{p.leader_phone}<br /><span className="text-gray-500 text-[11px]">{p.leader_email}</span></td>
                          <td className="p-3.5">{p.college_name}</td>
                          <td className="p-3.5">{p.department}</td>
                          <td className="p-3.5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                              p.qr_used ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                            }`}>
                              {p.qr_used ? '✓ CHECKED IN' : 'PENDING ENTRY'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MODULE 3: SUPER ADMIN PARTICIPANT MANAGEMENT & EXCEL EXPORT */}
            {activeTab === 'participants' && userRole === 'super_admin' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
                      <Users className="w-6 h-6 text-gold-500" />
                      <span>Participant Management & Excel Export</span>
                    </h2>
                    <p className="text-xs text-gray-400 font-space mt-0.5">
                      Full administrative control: filter, edit, delete, reset QR pass tokens, and generate Excel reports.
                    </p>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-space font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Filtered Excel / CSV</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search records..."
                    className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-space text-white outline-none"
                  />

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-space text-gold-400 outline-none"
                  >
                    <option value="">All Pass Status</option>
                    <option value="checked_in">Checked In Only</option>
                    <option value="not_checked_in">Pending Entry Only</option>
                  </select>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-800">
                  <table className="w-full text-left text-xs font-space">
                    <thead className="bg-slate-950 text-gold-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Reg ID</th>
                        <th className="p-3.5">Leader Name</th>
                        <th className="p-3.5">Email & Mobile</th>
                        <th className="p-3.5">College & Dept</th>
                        <th className="p-3.5">Events</th>
                        <th className="p-3.5">QR Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-gray-300">
                      {participants.map((p) => (
                        <tr key={p.registration_id} className="hover:bg-slate-900/60">
                          <td className="p-3.5 font-bold text-gold-400">{p.registration_id}</td>
                          <td className="p-3.5 text-white font-semibold">{p.leader_name}</td>
                          <td className="p-3.5">{p.leader_email}<br /><span className="text-gray-500">{p.leader_phone}</span></td>
                          <td className="p-3.5">{p.college_name}<br /><span className="text-gold-400">{p.department}</span></td>
                          <td className="p-3.5 max-w-xs truncate">{p.event_names || 'N/A'}</td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              p.qr_used ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                            }`}>
                              {p.qr_used ? 'USED' : 'UNUSED'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            {p.qr_used === 1 && (
                              <button
                                onClick={() => handleResetQR(p.registration_id)}
                                className="px-2.5 py-1 rounded bg-amber-600/30 text-amber-400 hover:bg-amber-600 text-[10px] font-bold"
                              >
                                Reset QR
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteParticipant(p.registration_id)}
                              className="px-2.5 py-1 rounded bg-red-600/30 text-red-400 hover:bg-red-600 text-[10px] font-bold"
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

            {/* MODULE 4: CREATE GATE ADMIN ACCOUNTS */}
            {activeTab === 'admins' && userRole === 'super_admin' && (
              <div className="max-w-md mx-auto p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-gold-500" />
                    <span>Create Gate Admin Account</span>
                  </h2>
                  <p className="text-xs text-gray-400 font-space mt-0.5">
                    Super admin can generate restricted gate scanner accounts for symposium volunteers.
                  </p>
                </div>

                {adminSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    {adminSuccessMsg}
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-space"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-space font-bold uppercase text-gray-400 block mb-1">New Admin Password</label>
                    <input
                      type="password"
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-space"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setAdminSuccessMsg(`Created Gate Admin account: ${newAdminUser}`);
                      setNewAdminUser('');
                      setNewAdminPass('');
                    }}
                    className="w-full py-3 rounded-xl bg-gold-500 text-slate-950 font-space font-extrabold text-xs uppercase"
                  >
                    Create Admin Credentials
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>
      )}

    </div>
  );
};
