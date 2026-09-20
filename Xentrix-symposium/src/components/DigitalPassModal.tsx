import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, Printer, ShieldAlert, Sparkles, X, UserCheck, Users, Ticket, ArrowLeft, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { RegistrationResult } from '../types';

interface DigitalPassModalProps {
  result: RegistrationResult | null;
  onClose: () => void;
}

export const DigitalPassModal: React.FC<DigitalPassModalProps> = ({ result, onClose }) => {
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) {
      // Fire celebratory confetti cannons
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [result]);

  if (!result) return null;

  // Construct full list of registered participants (Leader + all Teammates)
  const allParticipants = [
    {
      name: result.leaderName || 'Team Leader',
      role: 'Team Leader',
      email: result.leaderEmail,
      phone: result.leaderPhone || '',
      idSuffix: 'L1',
    },
    ...(result.members || []).map((m, idx) => ({
      name: (m.name && m.name.trim()) ? m.name : `Teammate #${idx + 2}`,
      role: `Teammate #${idx + 2}`,
      email: m.email || '',
      phone: m.phone || '',
      idSuffix: `M${idx + 2}`,
    }))
  ];

  const activeParticipant = allParticipants[selectedMemberIndex] || allParticipants[0];

  // Generate dynamic scannable QR Code Data URL for selected participant
  useEffect(() => {
    if (result && activeParticipant) {
      const passIdStr = `${result.registrationId}-${activeParticipant.idSuffix}`;
      const qrPayload = JSON.stringify({
        passId: passIdStr,
        name: activeParticipant.name,
        role: activeParticipant.role,
        team: result.teamName,
        college: result.collegeName,
        department: result.department
      });

      QRCode.toDataURL(qrPayload, {
        width: 300,
        margin: 1,
        color: { dark: '#1A0407', light: '#FFFFFF' }
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [result, selectedMemberIndex]);

  // Print Pass handler
  const handlePrint = () => {
    window.print();
  };

  // High-Resolution Ticket Pass Canvas Image Generator & Downloader with embedded QR code
  const handleDownloadPNG = async () => {
    setIsDownloading(true);

    try {
      const passIdStr = `${result.registrationId}-${activeParticipant.idSuffix}`;
      const qrPayload = JSON.stringify({
        passId: passIdStr,
        name: activeParticipant.name,
        role: activeParticipant.role,
        team: result.teamName,
        college: result.collegeName,
        department: result.department
      });

      // Generate QR Code data URL asynchronously
      const qrDataUrl = await QRCode.toDataURL(qrPayload, {
        width: 350,
        margin: 1,
        color: { dark: '#1A0407', light: '#FFFFFF' }
      });

      const qrImg = new Image();
      qrImg.src = qrDataUrl;
      await new Promise((resolve) => {
        qrImg.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 700;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // 1. Dark Maroon Gradient Background
      const bgGradient = ctx.createLinearGradient(0, 0, 1200, 700);
      bgGradient.addColorStop(0, '#2D060C'); // Deep maroon
      bgGradient.addColorStop(0.5, '#4A0C16');
      bgGradient.addColorStop(1, '#1A0407');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 1200, 700);

      // 2. Gold Border Framing
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, 1160, 660);

      ctx.strokeStyle = '#F3E5AB';
      ctx.lineWidth = 2;
      ctx.strokeRect(28, 28, 1144, 644);

      // 3. Header Branding Text
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText("XenTriX '26", 60, 80);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px sans-serif';
      ctx.fillText('PRINCE SHRI VENKATESHWARA PADMAVATHY ENGINEERING COLLEGE', 60, 110);

      // Delegate Badge Pill
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.roundRect(900, 50, 240, 45, 10);
      ctx.fill();

      ctx.fillStyle = '#1A0407';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(activeParticipant.role.toUpperCase(), 1020, 80);
      ctx.textAlign = 'left';

      // Horizontal Divider
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 135);
      ctx.lineTo(1140, 135);
      ctx.stroke();

      // 4. Participant Name Section
      ctx.fillStyle = '#A0A0A0';
      ctx.font = '14px sans-serif';
      ctx.fillText('REGISTERED PARTICIPANT NAME', 60, 175);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 44px serif';
      ctx.fillText(activeParticipant.name, 60, 225);

      // 5. Team Details Grid Box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.beginPath();
      ctx.roundRect(60, 260, 1080, 130, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.stroke();

      // Grid Columns inside details box
      // Col 1: Team Name
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('TEAM NAME', 90, 290);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(result.teamName, 90, 325);

      // Col 2: College & Dept
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('COLLEGE & DEPT', 430, 290);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`${result.collegeName} (${result.department})`, 430, 325);

      // Col 3: Unique Pass ID
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('PASS REGISTRATION ID', 830, 290);
      ctx.fillStyle = '#4ADE80';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`${result.registrationId}-${activeParticipant.idSuffix}`, 830, 325);

      // 6. Registered Events Track Section (Left side, bounded at x=820)
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`REGISTERED EVENTS TRACK (${result.selectedEvents.length} EVENTS)`, 60, 425);

      let eventOffsetX = 60;
      let eventOffsetY = 450;
      result.selectedEvents.forEach((evt) => {
        const text = `${evt.name} (${evt.displayTime})`;
        ctx.font = 'bold 14px sans-serif';
        const textWidth = ctx.measureText(text).width;

        if (eventOffsetX + textWidth + 30 > 840) {
          eventOffsetX = 60;
          eventOffsetY += 45;
        }

        ctx.fillStyle = 'rgba(128, 0, 32, 0.8)';
        ctx.beginPath();
        ctx.roundRect(eventOffsetX, eventOffsetY, textWidth + 24, 34, 8);
        ctx.fill();
        ctx.strokeStyle = '#D4AF37';
        ctx.stroke();

        ctx.fillStyle = '#F3E5AB';
        ctx.fillText(text, eventOffsetX + 12, eventOffsetY + 22);

        eventOffsetX += textWidth + 36;
      });

      // 7. White Square Box for QR Code (Placed on the right overlapping from y=385 to y=585 as in user photo)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(870, 385, 210, 200, 14);
      ctx.fill();
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw Dynamic QR Code Image inside white box
      ctx.drawImage(qrImg, 885, 395, 180, 155);

      // QR Verification Label inside white box bottom
      ctx.fillStyle = '#1A0407';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN AT ENTRY GATE', 975, 572);
      ctx.textAlign = 'left';

      // 8. Footer Date Line
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.beginPath();
      ctx.moveTo(60, 605);
      ctx.lineTo(1140, 605);
      ctx.stroke();

      ctx.fillStyle = '#A0A0A0';
      ctx.font = '14px sans-serif';
      ctx.fillText('SYMPOSIUM DATE & VENUE', 60, 632);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Saturday, 26 September 2026 • Main Campus Seminar Hall', 60, 660);

      // Trigger Direct Browser Download
      const link = document.createElement('a');
      const cleanName = activeParticipant.name.replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `XenTriX26_Pass_${cleanName}_${activeParticipant.idSuffix}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setIsDownloading(false);
    } catch (err) {
      console.error('Download pass error:', err);
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-[#FAF9F6] text-richblack flex flex-col font-poppins selection:bg-maroon-700 selection:text-gold-400 relative z-20"
    >
      {/* 1. TOP HEADER NAVIGATION BAR WITH BACK BUTTON */}
      <header className="bg-maroon-900 border-b border-gold-500/30 text-white sticky top-0 z-50 shadow-xl px-4 sm:px-8 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Return to Main Site Button */}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 font-space text-xs sm:text-sm font-bold uppercase tracking-wider text-gold-400 bg-maroon-800 hover:bg-gold-500 hover:text-richblack px-4 py-2.5 rounded-xl border border-gold-500/40 transition-all duration-200 cursor-pointer shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Main Site</span>
          </button>

          {/* Portal Title Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500 text-richblack flex items-center justify-center font-bold font-space shadow-md">
              <Sparkles className="w-5 h-5 text-richblack" />
            </div>
            <div>
              <div className="text-gold-400 text-[10px] font-space font-semibold uppercase tracking-widest">
                XenTriX '26
              </div>
              <h1 className="font-heading text-sm sm:text-lg font-bold text-white tracking-tight hidden sm:block">
                Official Delegate Ticket Pass Portal
              </h1>
            </div>
          </div>

          <div className="hidden sm:block w-36" />
        </div>
      </header>

      {/* 2. MAIN FULL-PAGE WORKSPACE CONTENT */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 flex flex-col justify-between">
        <div className="space-y-6">

          {/* Registration Confirmed Banner Card */}
          <div className="bg-white rounded-3xl border border-bordergray shadow-xl p-6 sm:p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-richblack">
              Team Registration Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Personalized Official Invitation Passes generated for all <span className="font-bold text-maroon-700">{allParticipants.length} registered members</span>. Select a member below to view and download their PNG ticket pass.
            </p>
          </div>

          {/* Participant Pass Selector Bar */}
          <div className="bg-white rounded-2xl border border-bordergray shadow-md p-4 sm:p-6">
            <div className="text-xs font-space font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-maroon-700" />
              <span>Select Member Pass To View & Download ({allParticipants.length} Members):</span>
            </div>
            
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
              {allParticipants.map((p, idx) => {
                const isSelected = idx === selectedMemberIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedMemberIndex(idx)}
                    className={`px-4 py-3 rounded-xl text-xs font-space font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-maroon-700 text-gold-400 border-gold-500 shadow-md ring-2 ring-maroon-700/20 scale-[1.02]'
                        : 'bg-gray-50 text-gray-700 border-bordergray hover:bg-gray-100'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-gold-400" />
                    <span>{p.name}</span>
                    <span className="text-[10px] opacity-80 font-normal">({p.role})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Digital Invitation Ticket Pass Card Container */}
          <div
            ref={cardRef}
            className="bg-gradient-to-br from-[#2D060C] via-[#4A0C16] to-[#1A0407] rounded-3xl p-6 sm:p-8 border-4 border-gold-500 shadow-2xl relative overflow-hidden text-white min-h-[480px]"
          >
            {/* Inner Gold Frame Accent */}
            <div className="absolute inset-2 border border-gold-300/30 rounded-2xl pointer-events-none" />

            {/* Header Branding Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-500/40 pb-4 mb-5 relative z-10">
              <div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-gold-400 tracking-wider">
                  XenTriX '26
                </h3>
                <p className="text-xs sm:text-sm font-space font-medium text-white/90 tracking-wide mt-0.5">
                  PRINCE SHRI VENKATESHWARA PADMAVATHY ENGINEERING COLLEGE
                </p>
              </div>

              {/* Delegate Role Pill */}
              <div className="px-5 py-2.5 rounded-xl bg-gold-500 text-richblack font-space text-xs sm:text-sm font-extrabold shadow-lg uppercase tracking-wider flex items-center gap-2 border border-gold-300">
                <Ticket className="w-4 h-4" />
                <span>{activeParticipant.role}</span>
              </div>
            </div>

            {/* Registered Participant Name */}
            <div className="mb-5 relative z-10">
              <div className="text-xs font-space font-bold uppercase tracking-widest text-gold-400/80 mb-1">
                REGISTERED PARTICIPANT NAME
              </div>
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {activeParticipant.name}
              </div>
            </div>

            {/* Team Details Grid Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-gold-500/30 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              <div>
                <span className="text-[11px] font-space font-bold uppercase tracking-wider text-gold-400 block mb-1">
                  TEAM NAME
                </span>
                <span className="font-space font-bold text-lg text-white">
                  {result.teamName}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-space font-bold uppercase tracking-wider text-gold-400 block mb-1">
                  COLLEGE & DEPT
                </span>
                <span className="font-space font-bold text-base text-white">
                  {result.collegeName} ({result.department})
                </span>
              </div>

              <div>
                <span className="text-[11px] font-space font-bold uppercase tracking-wider text-gold-400 block mb-1">
                  PASS REGISTRATION ID
                </span>
                <span className="font-mono font-extrabold text-xl text-emerald-400 tracking-wider">
                  {result.registrationId}-{activeParticipant.idSuffix}
                </span>
              </div>
            </div>

            {/* Middle Content Row: Left (Registered Events Track), Right (White QR Code Box) */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10 mb-6">
              <div className="flex-1">
                <span className="text-xs font-space font-bold uppercase tracking-widest text-gold-400 block mb-3">
                  REGISTERED EVENTS TRACK ({result.selectedEvents.length} EVENTS)
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {result.selectedEvents.map((evt) => (
                    <span
                      key={evt.id}
                      className="px-3.5 py-2 rounded-xl bg-maroon-900/90 text-gold-300 font-space text-xs font-bold border border-gold-500/50 shadow-md"
                    >
                      {evt.name} ({evt.displayTime})
                    </span>
                  ))}
                </div>
              </div>

              {/* White Square Box for QR Code placed right on the right as in user photo */}
              <div className="bg-white p-3 rounded-2xl border-4 border-gray-400 shadow-2xl flex flex-col items-center justify-center shrink-0 self-center md:self-end text-richblack w-48 sm:w-52">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt={`Pass QR Code for ${activeParticipant.name}`}
                    className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-36 h-36 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                    <span className="text-xs font-space text-gray-400 font-bold">Generating QR...</span>
                  </div>
                )}
                <div className="text-[10px] font-space font-extrabold text-maroon-950 uppercase tracking-wider mt-1.5 text-center">
                  SCAN AT ENTRY GATE
                </div>
              </div>
            </div>

            {/* Footer Date & Location */}
            <div className="pt-4 border-t border-gold-500/40 relative z-10">
              <div className="text-xs font-space font-bold uppercase tracking-widest text-gold-400/80 mb-1">
                SYMPOSIUM DATE & VENUE
              </div>
              <div className="font-space font-bold text-sm sm:text-base text-white">
                Saturday, 26 September 2026 • Main Campus Seminar Hall
              </div>
            </div>
          </div>

          {/* Security Notice Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-poppins flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block uppercase font-space text-xs mb-0.5">Important Entry Verification</span>
              <span>Each participant must carry their own printed or downloaded digital pass matching their registered name (<strong>{activeParticipant.name}</strong>) along with their original College ID Card for entry.</span>
            </div>
          </div>

        </div>
      </main>

      {/* 3. BOTTOM STICKY ACTION FOOTER BAR */}
      <footer className="bg-white border-t border-bordergray py-4 px-4 sm:px-8 sticky bottom-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-600 font-space text-center sm:text-left">
            Viewing Pass <strong className="text-maroon-800">{selectedMemberIndex + 1} of {allParticipants.length}</strong>: <span className="font-semibold text-richblack">{activeParticipant.name}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-nowrap overflow-x-auto">
            {/* Direct PNG Image Download Button */}
            <button
              onClick={handleDownloadPNG}
              disabled={isDownloading}
              className="px-4 sm:px-5 py-3 rounded-xl bg-gold-500 text-richblack hover:bg-gold-400 font-space font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Downloading...' : 'Download Pass (PNG)'}</span>
            </button>

            {/* Print Pass Button */}
            <button
              onClick={handlePrint}
              className="px-4 sm:px-5 py-3 rounded-xl bg-white text-maroon-700 border border-maroon-700/30 hover:bg-maroon-50 font-space font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-all whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Print Pass</span>
            </button>

            {/* Completed Button */}
            <button
              onClick={onClose}
              className="px-5 sm:px-7 py-3 rounded-xl bg-maroon-700 text-gold-400 hover:bg-gold-500 hover:text-richblack font-space font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-md cursor-pointer transition-all whitespace-nowrap flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed</span>
            </button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};
