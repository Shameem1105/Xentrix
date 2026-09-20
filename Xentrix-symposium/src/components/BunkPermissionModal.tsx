import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Award, ShieldCheck, Download, Share2, CheckCircle2, PartyPopper } from 'lucide-react';
import { soundFx } from '../utils/audioUtils';

interface BunkPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BunkPermissionModal: React.FC<BunkPermissionModalProps> = ({ isOpen, onClose }) => {
  const [studentName, setStudentName] = useState('');
  const [dept, setDept] = useState('Computer Science / ECE');
  const [reasonIndex, setReasonIndex] = useState(0);
  const [generatedPass, setGeneratedPass] = useState(false);

  const funReasons = [
    "🔥 Acute emergency relief required from 7 consecutive hours of boring PPT lectures.",
    "🏆 Representing the institution to win the ₹50,000 Grand Prize Pool at XenTriX '26.",
    "🍕 High risk of starvation from hostel mess food — Urgent relocation to Food Court needed.",
    "🎮 Defending national honor in BGMI Clutch Arena & Robo Race obstacle drift.",
    "⚡ Applying for instant CGPA reboot & attendance credit under Official Symposium OD quota.",
    "🗿 HOD explicitly ordered me to go out and flex our engineering swag."
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    soundFx.playSuccess();
    setGeneratedPass(true);
  };

  const handlePrint = () => {
    soundFx.playPop();
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden border-2 border-gold-500 shadow-2xl relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 p-6 text-white relative">
            <button
              onClick={() => {
                soundFx.playPop();
                onClose();
              }}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 text-xs font-space font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Official Student Perk</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
              Official Bunk & OD Generator 📜
            </h2>
            <p className="text-xs text-gold-200/90 font-poppins pt-1">
              Generate your 100% legit-looking On-Duty Bunk Permission Pass for XenTriX '26!
            </p>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {!generatedPass ? (
              <form onSubmit={handleGenerate} className="space-y-5">
                <div>
                  <label className="block text-xs font-space font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Your Full Name (As printed on College ID)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Pandian"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-maroon-700 font-poppins text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-space font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Department & Year
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ECE - 3rd Year"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-maroon-700 font-poppins text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-space font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Select Your Bunk Reason (HOD Approved Witty Excuses)
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {funReasons.map((reason, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          soundFx.playPop();
                          setReasonIndex(idx);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-poppins transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          reasonIndex === idx
                            ? 'bg-maroon-50 border-maroon-700 text-maroon-900 font-semibold shadow-sm'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{reason}</span>
                        {reasonIndex === idx && <CheckCircle2 className="w-4 h-4 text-maroon-700 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gold-400 hover:bg-gold-500 text-maroon-950 font-space font-black text-sm uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer border-2 border-gold-500"
                >
                  <PartyPopper className="w-5 h-5 text-maroon-950" />
                  <span>Generate Official OD Pass Now</span>
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Printable OD Pass Card */}
                <div id="printable-od-pass" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-100 border-4 border-maroon-800 shadow-2xl relative overflow-hidden">
                  
                  {/* Decorative Stamp */}
                  <div className="absolute top-4 right-4 rotate-12 bg-maroon-800 text-gold-400 font-space font-black text-[10px] sm:text-xs uppercase px-3 py-1.5 rounded-lg border border-gold-400 shadow-lg tracking-widest pointer-events-none">
                    100% OD APPROVED 📜
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 border-b-2 border-maroon-800/20 pb-4">
                    <div className="w-14 h-14 rounded-2xl bg-maroon-900 p-2 border-2 border-gold-500 flex items-center justify-center text-white">
                      <ShieldCheck className="w-8 h-8 text-gold-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-space font-extrabold uppercase tracking-widest text-maroon-800">
                        OFFICIAL ACADEMIC EXEMPTION CERTIFICATE
                      </div>
                      <h3 className="font-heading text-xl font-black text-richblack">
                        XenTriX '26 ON-DUTY PASS
                      </h3>
                      <div className="text-xs font-space font-bold text-gold-700">
                        Date of Exemption: SEPT 26, 2026
                      </div>
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-poppins mb-6">
                    <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                      <span className="text-gray-500 text-[10px] uppercase font-space font-bold block">Student Name:</span>
                      <strong className="text-maroon-950 font-bold text-sm">{studentName}</strong>
                    </div>

                    <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                      <span className="text-gray-500 text-[10px] uppercase font-space font-bold block">Dept & Year:</span>
                      <strong className="text-maroon-950 font-bold text-sm">{dept}</strong>
                    </div>
                  </div>

                  {/* Reason Box */}
                  <div className="bg-maroon-900 text-white p-4 rounded-2xl border border-gold-500/50 mb-6 space-y-1">
                    <span className="text-[10px] uppercase font-space font-bold text-gold-400 tracking-wider">Official Exemption Ground:</span>
                    <p className="text-xs font-poppins leading-relaxed font-semibold italic text-gold-100">
                      "{funReasons[reasonIndex]}"
                    </p>
                  </div>

                  {/* Footer Signatures */}
                  <div className="flex items-end justify-between text-[10px] font-space text-gray-600 border-t border-maroon-800/20 pt-4">
                    <div>
                      <div className="font-bold text-maroon-900">Signed: Head of Backbenchers</div>
                      <div>Zentrix Student Council</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-maroon-900">Signed: OD Coordinator</div>
                      <div>PSVPEC Campus</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={() => setGeneratedPass(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-space font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    ← Edit Pass Details
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={handlePrint}
                      className="px-6 py-3 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-400 font-space font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-gold-500/40"
                    >
                      <Download className="w-4 h-4" />
                      <span>Print / Download OD Pass</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
